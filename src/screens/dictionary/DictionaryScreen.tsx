/**
 * DictionaryScreen.tsx
 * Academic Vocabulary Lookup & Offline Favorites.
 * Powered by the Free Dictionary API (https://api.dictionaryapi.dev).
 * Saves favorites locally to AsyncStorage for offline access.
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { DictionaryEntry, FavoriteWord } from '../../types';
import { lookupWord } from '../../services/dictionaryService';
import { getFavorites, saveFavorites } from '../../services/storageService';
import { fontSize, spacing, radius } from '../../theme';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import EmptyState from '../../components/EmptyState';

type TabView = 'search' | 'favorites';

export default function DictionaryScreen() {
  const { colors, isDark } = useTheme();

  const [activeTab, setActiveTab] = useState<TabView>('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<FavoriteWord[]>([]);

  // Load saved favorites on mount
  useEffect(() => {
    getFavorites().then(setFavorites);
  }, []);

  // Quick search keywords for students
  const QUICK_WORDS = ['heuristic', 'algorithm', 'paradigm', 'empirical', 'cognitive'];

  const handleSearch = async (termToSearch?: string) => {
    const query = (termToSearch ?? searchTerm).trim();
    if (!query) return;

    if (termToSearch) setSearchTerm(termToSearch);

    setIsLoading(true);
    setErrorMessage(null);
    setEntries([]);

    try {
      const results = await lookupWord(query);
      setEntries(results);
    } catch {
      setErrorMessage(`No definitions found for "${query}". Check spelling and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const isWordFavorite = (word: string) => {
    return favorites.some((f) => f.word.toLowerCase() === word.toLowerCase());
  };

  const toggleFavorite = async (entry: DictionaryEntry) => {
    const exists = isWordFavorite(entry.word);
    let updated: FavoriteWord[];

    if (exists) {
      updated = favorites.filter((f) => f.word.toLowerCase() !== entry.word.toLowerCase());
    } else {
      const firstMeaning = entry.meanings[0];
      const firstDef = firstMeaning?.definitions[0]?.definition ?? 'No definition available.';
      const newFav: FavoriteWord = {
        id: 'fav-' + Date.now(),
        word: entry.word,
        partOfSpeech: firstMeaning?.partOfSpeech ?? 'word',
        definition: firstDef,
        savedAt: new Date().toISOString(),
      };
      updated = [newFav, ...favorites];
    }

    setFavorites(updated);
    await saveFavorites(updated);
  };

  const removeFavorite = async (id: string) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    await saveFavorites(updated);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Dictionary</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Look up academic definitions and store offline vocabulary
        </Text>
      </View>

      {/* Segmented Tab */}
      <View style={[styles.tabBar, { backgroundColor: colors.surfaceSecondary }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('search')}
          style={[
            styles.tabItem,
            {
              backgroundColor: activeTab === 'search' ? colors.surface : 'transparent',
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'search' ? colors.primary : colors.textSecondary,
                fontWeight: activeTab === 'search' ? '700' : '500',
              },
            ]}
          >
            🔍 Search Words
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('favorites')}
          style={[
            styles.tabItem,
            {
              backgroundColor: activeTab === 'favorites' ? colors.surface : 'transparent',
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'favorites' ? colors.primary : colors.textSecondary,
                fontWeight: activeTab === 'favorites' ? '700' : '500',
              },
            ]}
          >
            ⭐ Saved ({favorites.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'search' ? (
        <ScrollView contentContainerStyle={styles.content}>
          {/* Search Bar */}
          <Card>
            <View style={styles.searchRow}>
              <View style={{ flex: 1, marginRight: spacing[2] }}>
                <Input
                  label="Search Term"
                  placeholder="e.g. paradigm, heuristic, entropy"
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  onSubmitEditing={() => handleSearch()}
                />
              </View>
              <Button
                title={isLoading ? '...' : 'Search'}
                onPress={() => handleSearch()}
                isLoading={isLoading}
                style={{ marginTop: 22 }}
              />
            </View>

            {/* Quick Keyword Suggestions */}
            <View style={styles.suggestionsRow}>
              <Text style={[styles.suggestLabel, { color: colors.textSecondary }]}>
                Suggestions:
              </Text>
              {QUICK_WORDS.map((w) => (
                <TouchableOpacity
                  key={w}
                  onPress={() => handleSearch(w)}
                  style={[
                    styles.suggestChip,
                    { backgroundColor: isDark ? colors.surfaceSecondary : '#EEF2FF' },
                  ]}
                >
                  <Text style={[styles.suggestText, { color: colors.primary }]}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Loading Indicator */}
          {isLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                Querying Dictionary API...
              </Text>
            </View>
          ) : null}

          {/* Error State */}
          {errorMessage ? (
            <EmptyState icon="❓" title="Word Not Found" message={errorMessage} />
          ) : null}

          {/* Search Results */}
          {entries.map((entry, idx) => {
            const isFav = isWordFavorite(entry.word);
            const phonetic = entry.phonetics.find((p) => p.text)?.text ?? '';

            return (
              <Card key={idx} style={styles.entryCard}>
                <View style={styles.wordHeaderRow}>
                  <View>
                    <Text style={[styles.entryWord, { color: colors.textPrimary }]}>
                      {entry.word}
                    </Text>
                    {phonetic ? (
                      <Text style={[styles.phonetic, { color: colors.primary }]}>{phonetic}</Text>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    onPress={() => toggleFavorite(entry)}
                    style={[
                      styles.favButton,
                      {
                        backgroundColor: isFav ? '#FEF3C7' : colors.surfaceSecondary,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 20 }}>{isFav ? '⭐' : '☆'}</Text>
                  </TouchableOpacity>
                </View>

                {/* Meanings */}
                {entry.meanings.map((meaning, mIdx) => (
                  <View key={mIdx} style={styles.meaningBlock}>
                    <View
                      style={[
                        styles.posBadge,
                        {
                          backgroundColor: isDark ? colors.surfaceSecondary : '#F3F4F6',
                        },
                      ]}
                    >
                      <Text style={[styles.posText, { color: colors.primaryDark }]}>
                        {meaning.partOfSpeech.toUpperCase()}
                      </Text>
                    </View>

                    {meaning.definitions.slice(0, 3).map((def, dIdx) => (
                      <View key={dIdx} style={styles.defItem}>
                        <Text style={[styles.defBullet, { color: colors.primary }]}>•</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.defText, { color: colors.textPrimary }]}>
                            {def.definition}
                          </Text>
                          {def.example ? (
                            <Text style={[styles.defExample, { color: colors.textSecondary }]}>
                              "{def.example}"
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </Card>
            );
          })}
        </ScrollView>
      ) : (
        /* Saved Favorites List */
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          ListEmptyComponent={
            <EmptyState
              icon="⭐"
              title="No Saved Words Yet"
              message="Look up academic words and tap the star to save them for offline study."
            />
          }
          renderItem={({ item }) => (
            <Card style={styles.favCard}>
              <View style={styles.favRow}>
                <View style={{ flex: 1 }}>
                  <View style={styles.favTitleRow}>
                    <Text style={[styles.favWord, { color: colors.textPrimary }]}>{item.word}</Text>
                    <View
                      style={[
                        styles.posBadge,
                        {
                          backgroundColor: isDark ? colors.surfaceSecondary : '#EEF2FF',
                          marginLeft: spacing[2],
                        },
                      ]}
                    >
                      <Text style={[styles.posText, { color: colors.primary }]}>
                        {item.partOfSpeech}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.favDef, { color: colors.textSecondary }]}>
                    {item.definition}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => removeFavorite(item.id)}
                  style={styles.deleteFavBtn}
                >
                  <Text style={{ fontSize: 18 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[8],
    paddingBottom: spacing[3],
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
  },
  subtitle: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: spacing[5],
    borderRadius: radius.lg,
    padding: 4,
    marginBottom: spacing[4],
  },
  tabItem: {
    flex: 1,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderRadius: radius.md,
  },
  tabText: {
    fontSize: fontSize.xs,
  },
  content: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[10],
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: spacing[2],
  },
  suggestLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  suggestChip: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  suggestText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  centerBox: {
    alignItems: 'center',
    paddingVertical: spacing[8],
  },
  statusText: {
    fontSize: fontSize.sm,
    marginTop: spacing[2],
  },
  entryCard: {
    marginTop: spacing[3],
  },
  wordHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  entryWord: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  phonetic: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginTop: 2,
  },
  favButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meaningBlock: {
    marginTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: spacing[3],
  },
  posBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: spacing[2],
  },
  posText: {
    fontSize: 10,
    fontWeight: '700',
  },
  defItem: {
    flexDirection: 'row',
    marginBottom: spacing[2],
  },
  defBullet: {
    fontSize: fontSize.md,
    marginRight: spacing[2],
    lineHeight: 20,
  },
  defText: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  defExample: {
    fontSize: fontSize.xs,
    fontStyle: 'italic',
    marginTop: 2,
  },
  favCard: {
    marginBottom: spacing[3],
  },
  favRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  favWord: {
    fontSize: fontSize.base,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  favDef: {
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  deleteFavBtn: {
    padding: spacing[2],
    marginLeft: spacing[2],
  },
});
