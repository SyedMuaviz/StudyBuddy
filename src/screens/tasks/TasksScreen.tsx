/**
 * TasksScreen.tsx
 * Complete Task Management for university students.
 * Features:
 * - Full CRUD: Create, Read, Update, Delete, Toggle Completion
 * - Filters: All, Pending, Completed, High Priority
 * - Due dates with overdue indicator
 * - Smart Subject Auto-Suggestion (Innovation Feature candidate)
 * - Offline-first persistence via AsyncStorage
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Task, Priority } from '../../types';
import { getTasks, saveTasks } from '../../services/storageService';
import { toDateString, toRelativeLabel, isOverdue } from '../../utils/dateUtils';
import { fontSize, spacing, radius } from '../../theme';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import EmptyState from '../../components/EmptyState';

type FilterType = 'all' | 'pending' | 'completed' | 'high';

const COMMON_SUBJECTS = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Engineering',
  'Economics',
  'Literature',
  'Psychology',
];

/**
 * Smart Subject Detector: Auto-suggests a subject tag based on keyword analysis.
 * Offline-first, runs on-device without external API calls.
 */
function detectSubject(title: string): string | null {
  const t = title.toLowerCase();
  if (/algo|code|react|python|java|debug|program|software|lab|git/i.test(t))
    return 'Computer Science';
  if (/math|calc|algebra|integral|matrix|theorem|proof/i.test(t)) return 'Mathematics';
  if (/physic|circuit|newton|optic|quantum|mechanic/i.test(t)) return 'Physics';
  if (/essay|read|chapter|write|paper|novel|literature/i.test(t)) return 'Literature';
  if (/econ|finance|market|micro|macro|accounting/i.test(t)) return 'Economics';
  return null;
}

export default function TasksScreen() {
  const { colors, isDark } = useTheme();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState(toDateString());
  const [dueTime, setDueTime] = useState('18:00');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Load tasks on mount
  useEffect(() => {
    getTasks().then((loaded) => setTasks(loaded));
  }, []);

  const persistTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    saveTasks(newTasks);
  }, []);

  // Filtered task list
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filter === 'pending') return !t.isCompleted;
      if (filter === 'completed') return t.isCompleted;
      if (filter === 'high') return t.priority === 'high' && !t.isCompleted;
      return true;
    });
  }, [tasks, filter]);

  // Toggle completion
  const handleToggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
    persistTasks(updated);
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    const doDelete = () => {
      persistTasks(tasks.filter((t) => t.id !== id));
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this task?')) {
        doDelete();
      }
    } else {
      Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  // Open modal for add
  const handleOpenAdd = () => {
    setEditingTask(null);
    setTitle('');
    setSubject('Computer Science');
    setPriority('medium');
    setDueDate(toDateString());
    setDueTime('18:00');
    setReminderEnabled(true);
    setFormError(null);
    setIsModalVisible(true);
  };

  // Open modal for edit
  const handleOpenEdit = (t: Task) => {
    setEditingTask(t);
    setTitle(t.title);
    setSubject(t.subject);
    setPriority(t.priority);
    setDueDate(t.dueDate ?? toDateString());
    setDueTime(t.dueTime ?? '18:00');
    setReminderEnabled(t.reminderEnabled);
    setFormError(null);
    setIsModalVisible(true);
  };

  // Title change with Smart Subject Auto-Suggestion
  const handleTitleChange = (text: string) => {
    setTitle(text);
    if (formError) setFormError(null);

    // Auto-suggest subject tag if user hasn't explicitly customized yet
    const detected = detectSubject(text);
    if (detected && !editingTask) {
      setSubject(detected);
    }
  };

  // Save task
  const handleSave = () => {
    if (!title.trim()) {
      setFormError('Task title is required');
      return;
    }

    if (editingTask) {
      // Edit existing
      const updated = tasks.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              title: title.trim(),
              subject: subject.trim() || 'General',
              priority,
              dueDate: dueDate.trim() || null,
              dueTime: dueTime.trim() || null,
              reminderEnabled,
            }
          : t,
      );
      persistTasks(updated);
    } else {
      // Create new
      const newTask: Task = {
        id: 'task-' + Date.now(),
        title: title.trim(),
        subject: subject.trim() || 'General',
        priority,
        dueDate: dueDate.trim() || null,
        dueTime: dueTime.trim() || null,
        isCompleted: false,
        reminderEnabled,
        notificationId: null,
        createdAt: new Date().toISOString(),
      };
      persistTasks([newTask, ...tasks]);
    }

    setIsModalVisible(false);
  };

  const getPriorityColor = (p: Priority) => {
    if (p === 'high') return colors.error;
    if (p === 'medium') return colors.warning;
    return colors.success;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>My Tasks</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {tasks.filter((t) => !t.isCompleted).length} pending •{' '}
            {tasks.filter((t) => t.isCompleted).length} completed
          </Text>
        </View>

        <Button title="+ Add Task" onPress={handleOpenAdd} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['all', 'pending', 'completed', 'high'] as FilterType[]).map((f) => {
          const isActive = filter === f;
          const label = f === 'high' ? 'High Priority' : f.charAt(0).toUpperCase() + f.slice(1);
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? colors.primary : colors.surfaceSecondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: isActive ? colors.textOnPrimary : colors.textSecondary },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="📝"
            title="No Tasks Found"
            message={
              filter === 'all'
                ? "You're all caught up! Tap '+ Add Task' to plan your study workload."
                : `No ${filter} tasks right now.`
            }
          />
        }
        renderItem={({ item }) => {
          const overdue = !item.isCompleted && isOverdue(item.dueDate);
          const priorityColor = getPriorityColor(item.priority);

          return (
            <Card style={styles.taskCard}>
              <View style={styles.taskCardRow}>
                {/* Complete Checkbox */}
                <TouchableOpacity
                  onPress={() => handleToggleTask(item.id)}
                  style={[
                    styles.checkbox,
                    {
                      borderColor: item.isCompleted ? colors.success : colors.border,
                      backgroundColor: item.isCompleted ? colors.success : 'transparent',
                    },
                  ]}
                >
                  {item.isCompleted ? <Text style={styles.checkMark}>✓</Text> : null}
                </TouchableOpacity>

                {/* Task Details */}
                <View style={{ flex: 1, marginHorizontal: spacing[3] }}>
                  <Text
                    style={[
                      styles.itemTitle,
                      {
                        color: item.isCompleted ? colors.textDisabled : colors.textPrimary,
                        textDecorationLine: item.isCompleted ? 'line-through' : 'none',
                      },
                    ]}
                  >
                    {item.title}
                  </Text>

                  <View style={styles.metaRow}>
                    {/* Subject badge */}
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: isDark ? colors.surfaceSecondary : '#EEF2FF',
                        },
                      ]}
                    >
                      <Text style={[styles.badgeText, { color: colors.primary }]}>
                        {item.subject}
                      </Text>
                    </View>

                    {/* Priority badge */}
                    <View style={[styles.badge, { backgroundColor: priorityColor + '20' }]}>
                      <Text style={[styles.badgeText, { color: priorityColor }]}>
                        {item.priority.toUpperCase()}
                      </Text>
                    </View>

                    {/* Due Date */}
                    {item.dueDate ? (
                      <Text
                        style={[
                          styles.dueText,
                          { color: overdue ? colors.error : colors.textSecondary },
                        ]}
                      >
                        {overdue ? '⚠️ Overdue: ' : 'Due: '}
                        {toRelativeLabel(item.dueDate)}
                        {item.dueTime ? ` at ${item.dueTime}` : ''}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsColumn}>
                  <TouchableOpacity onPress={() => handleOpenEdit(item)} style={styles.actionIcon}>
                    <Text style={{ fontSize: 16 }}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteTask(item.id)}
                    style={styles.actionIcon}
                  >
                    <Text style={{ fontSize: 16 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          );
        }}
      />

      {/* Add / Edit Task Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.surface }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                {editingTask ? 'Edit Task' : 'New Study Task'}
              </Text>

              <Input
                label="Task Title *"
                placeholder="e.g. Complete Machine Learning Lab"
                value={title}
                onChangeText={handleTitleChange}
                error={formError}
              />

              <Input
                label="Subject / Course"
                placeholder="e.g. Computer Science"
                value={subject}
                onChangeText={setSubject}
              />

              {/* Quick Subject Chips */}
              <View style={styles.chipRow}>
                {COMMON_SUBJECTS.slice(0, 4).map((sub) => (
                  <TouchableOpacity
                    key={sub}
                    onPress={() => setSubject(sub)}
                    style={[
                      styles.smallChip,
                      {
                        backgroundColor: subject === sub ? colors.primary : colors.surfaceSecondary,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: fontSize.xs,
                        color: subject === sub ? colors.textOnPrimary : colors.textSecondary,
                      }}
                    >
                      {sub}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Priority Selector */}
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                Priority Level
              </Text>
              <View style={styles.priorityRow}>
                {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                  const isSelected = priority === p;
                  const pColor = getPriorityColor(p);
                  return (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setPriority(p)}
                      style={[
                        styles.priorityBtn,
                        {
                          borderColor: isSelected ? pColor : colors.border,
                          backgroundColor: isSelected ? pColor + '15' : 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          { color: isSelected ? pColor : colors.textSecondary },
                        ]}
                      >
                        {p.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Due Date & Time */}
              <View style={styles.rowInputs}>
                <View style={{ flex: 1, marginRight: spacing[2] }}>
                  <Input
                    label="Due Date (YYYY-MM-DD)"
                    placeholder="2026-12-31"
                    value={dueDate}
                    onChangeText={setDueDate}
                  />
                </View>
                <View style={{ width: 120 }}>
                  <Input
                    label="Due Time"
                    placeholder="18:00"
                    value={dueTime}
                    onChangeText={setDueTime}
                  />
                </View>
              </View>

              {/* Reminder Toggle */}
              <TouchableOpacity
                onPress={() => setReminderEnabled(!reminderEnabled)}
                style={styles.reminderRow}
              >
                <Text style={{ fontSize: 20, marginRight: spacing[2] }}>
                  {reminderEnabled ? '🔔' : '🔕'}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.reminderTitle, { color: colors.textPrimary }]}>
                    Push Notification Reminder
                  </Text>
                  <Text style={[styles.reminderSub, { color: colors.textSecondary }]}>
                    Notify me when deadline is approaching
                  </Text>
                </View>
                <Text
                  style={{
                    color: reminderEnabled ? colors.primary : colors.textDisabled,
                    fontWeight: '700',
                  }}
                >
                  {reminderEnabled ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>

              {/* Modal Actions */}
              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={() => setIsModalVisible(false)}
                  style={{ flex: 1, marginRight: spacing[2] }}
                />
                <Button
                  title={editingTask ? 'Update Task' : 'Save Task'}
                  onPress={handleSave}
                  style={{ flex: 1 }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing[5],
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  filterChip: {
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    borderRadius: radius.full,
  },
  filterChipText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[10],
  },
  taskCard: {
    marginBottom: spacing[3],
  },
  taskCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  itemTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  badge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  dueText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
  },
  actionsColumn: {
    justifyContent: 'space-around',
    gap: spacing[2],
  },
  actionIcon: {
    padding: spacing[1],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: spacing[4],
  },
  modalBox: {
    borderRadius: radius.xl,
    padding: spacing[5],
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    marginBottom: spacing[4],
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[1],
    marginTop: -spacing[2],
    marginBottom: spacing[4],
  },
  smallChip: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
  },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    marginBottom: spacing[2],
  },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: spacing[2],
    borderWidth: 1.5,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing[3],
    padding: spacing[3],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reminderTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  reminderSub: {
    fontSize: fontSize.xs,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: spacing[4],
  },
});
