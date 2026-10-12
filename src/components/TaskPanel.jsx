import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { 
  CheckCircle, 
  Circle, 
  Plus, 
  Trash2, 
  Pin, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  ListTodo,
  Sparkles,
  Edit2,
  Check
} from 'lucide-react';

const SUBJECT_OPTIONS = ['HCI', 'Computer Science', 'Design', 'Math', 'Reading', 'General'];
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

export function TaskPanel({ isCollapsible = true, defaultCollapsed = false }) {
  const { 
    tasks, 
    activeTaskId, 
    setActiveTaskId, 
    addTask, 
    toggleTaskCompletion, 
    deleteTask, 
    editTask,
    hciDemoState
  } = useStudy();

  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [isAdding, setIsAdding] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('HCI');
  const [priorityInput, setPriorityInput] = useState('Medium');

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    addTask(titleInput.trim(), subjectInput, priorityInput);
    setTitleInput('');
    setIsAdding(false);
  };

  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = (taskId) => {
    if (editTitle.trim()) {
      editTask(taskId, editTitle.trim());
    }
    setEditingTaskId(null);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const isHighlighted = hciDemoState.highlightElementId === 'task-panel';

  return (
    <div 
      id="task-panel-container"
      className={`rounded-3xl glass-card border border-white/10 p-5 transition-all shadow-xl ${
        isHighlighted ? 'hci-highlight ring-4 ring-amber-400' : ''
      }`}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
            <ListTodo className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Study Tasks</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-stone-300 font-mono-numbers">
                {tasks.filter(t => !t.completed).length} open
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Create new task"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {isCollapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
              aria-label="Toggle task list collapse"
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="mt-4 space-y-3 animate-fadeIn">
          {/* Quick Filter Tabs */}
          <div className="flex items-center justify-between text-[11px] pb-2 border-b border-white/10">
            <div className="flex items-center gap-1">
              {['all', 'active', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors ${
                    filter === f ? 'bg-white/15 text-white' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <span className="text-stone-400 text-[10px]">Click pin to target</span>
          </div>

          {/* Add Task Form */}
          {isAdding && (
            <form onSubmit={handleCreateTask} className="p-3 rounded-2xl bg-white/5 border border-white/15 space-y-2.5 animate-fadeIn">
              <input
                type="text"
                placeholder="What are you studying? (e.g. Read HCI chapter 3)"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                autoFocus
                className="w-full p-2.5 rounded-xl bg-stone-900/80 border border-white/15 text-white text-xs placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
              />
              <div className="flex items-center justify-between gap-2">
                <select
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  className="bg-stone-900 text-stone-200 text-[11px] rounded-lg px-2 py-1.5 border border-white/10"
                >
                  {SUBJECT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                  value={priorityInput}
                  onChange={(e) => setPriorityInput(e.target.value)}
                  className="bg-stone-900 text-stone-200 text-[11px] rounded-lg px-2 py-1.5 border border-white/10"
                >
                  {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p} Priority</option>)}
                </select>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 text-[11px] text-stone-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] shadow"
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Task List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filteredTasks.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-400">
                <span>No {filter !== 'all' ? filter : ''} tasks found. Ready to add your first study goal?</span>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const isTarget = activeTaskId === task.id;
                const isEditing = editingTaskId === task.id;

                return (
                  <div
                    key={task.id}
                    className={`group p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                      isTarget
                        ? 'bg-amber-500/15 border-amber-500/40 shadow-md'
                        : task.completed
                        ? 'bg-white/5 border-white/5 opacity-60'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Checkbox (Shneiderman: Easy reversal of actions!) */}
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className="p-1 text-stone-400 hover:text-amber-400 transition-colors shrink-0"
                      title={task.completed ? 'Mark incomplete (Reversal of action)' : 'Mark completed'}
                      aria-label="Toggle task completed"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    {/* Task Title or Edit Input */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full text-xs bg-stone-900 text-white rounded px-2 py-1 border border-white/20"
                            autoFocus
                          />
                          <button
                            onClick={() => saveEdit(task.id)}
                            className="p-1 rounded bg-emerald-500/20 text-emerald-300"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 truncate">
                          <span className={`text-xs truncate ${task.completed ? 'line-through text-stone-500' : 'text-stone-200'}`}>
                            {task.title}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-stone-400 uppercase font-semibold">
                          {task.subject}
                        </span>
                        <span className="text-stone-600">•</span>
                        <span className={`text-[10px] ${
                          task.priority === 'High' ? 'text-rose-400' : task.priority === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Pin Button */}
                      <button
                        onClick={() => setActiveTaskId(isTarget ? null : task.id)}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          isTarget
                            ? 'bg-amber-400 text-stone-950 font-bold'
                            : 'text-stone-400 hover:text-white hover:bg-white/10'
                        }`}
                        title={isTarget ? 'Active target for timer' : 'Set as target task for timer'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Button */}
                      {!isEditing && (
                        <button
                          onClick={() => startEdit(task)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 text-xs transition-colors"
                          title="Edit Task"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-white/10 text-xs transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
