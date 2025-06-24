import React, { useState, useCallback } from 'react';
import { Task, TaskStatus, Column, CreateTaskData, Priority, Comment } from '../types/types';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import FormFieldInput from '../components/FormFieldInput';
import Button from '../components/Button';
import DraggableItem from '../components/DraggableItem';
import TaskView from './TaskView';
import { Plus, Save, X } from 'lucide-react';

// Mock data with comments
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design user interface mockups',
    description: 'Create high-fidelity mockups for the new dashboard using Figma',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-12-20',
    assignee: 'Sarah Johnson',
    tags: ['design', 'ui/ux'],
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
    createdBy: 'John Doe',
    comments: [
      {
        id: 'c1',
        taskId: '1',
        content: 'I think we should focus on mobile-first design for this mockup.',
        author: 'Sarah Johnson',
        createdAt: '2024-12-15T11:00:00Z',
        updatedAt: '2024-12-15T11:00:00Z',
        replies: [
          {
            id: 'c1-r1',
            taskId: '1',
            content: 'Absolutely agree! Mobile usage is increasing rapidly.',
            author: 'John Doe',
            createdAt: '2024-12-15T11:30:00Z',
            updatedAt: '2024-12-15T11:30:00Z',
            parentId: 'c1',
            replies: [],
          }
        ],
      }
    ],
  },
  {
    id: '2',
    title: 'Implement authentication system',
    description: 'Set up JWT-based authentication with refresh tokens',
    status: 'in-progress',
    priority: 'urgent',
    dueDate: '2024-12-18',
    assignee: 'Mike Chen',
    tags: ['backend', 'security'],
    createdAt: '2024-12-14T09:00:00Z',
    updatedAt: '2024-12-15T14:30:00Z',
    createdBy: 'Mike Chen',
    comments: [],
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST endpoints with examples and response schemas',
    status: 'review',
    priority: 'medium',
    dueDate: '2024-12-22',
    assignee: 'Alex Rivera',
    tags: ['documentation', 'api'],
    createdAt: '2024-12-13T11:00:00Z',
    updatedAt: '2024-12-15T16:00:00Z',
    createdBy: 'Alex Rivera',
    comments: [
      {
        id: 'c3',
        taskId: '3',
        content: 'Should we include code examples in multiple languages?',
        author: 'John Doe',
        createdAt: '2024-12-15T12:00:00Z',
        updatedAt: '2024-12-15T12:00:00Z',
        replies: [],
      }
    ],
  },
  {
    id: '4',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: 'done',
    priority: 'high',
    assignee: 'Jennifer Lee',
    tags: ['devops', 'automation'],
    createdAt: '2024-12-10T08:00:00Z',
    updatedAt: '2024-12-14T17:00:00Z',
    createdBy: 'Jennifer Lee',
    comments: [],
  },
  {
    id: '5',
    title: 'Optimize database queries',
    description: 'Improve performance of slow-running queries in the user management module',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-12-25',
    assignee: 'David Park',
    tags: ['database', 'performance'],
    createdAt: '2024-12-15T13:00:00Z',
    updatedAt: '2024-12-15T13:00:00Z',
    createdBy: 'David Park',
    comments: [],
  },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [currentUser] = useState('John Doe');
  
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignee: '',
    tags: [],
  });

  const columns: Column[] = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100', tasks: [] },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100', tasks: [] },
    { id: 'review', title: 'Review', color: 'bg-yellow-100', tasks: [] },
    { id: 'done', title: 'Done', color: 'bg-green-100', tasks: [] },
  ];

  // Filter tasks based on search query
  const filteredTasks = searchQuery
    ? tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : tasks;

  // Group tasks by status
  const tasksByStatus = columns.map(column => ({
    ...column,
    tasks: filteredTasks.filter(task => task.status === column.id),
  }));

  const handleCreateTask = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignee: '',
      tags: [],
    });
    setEditingTask(null);
    setIsCreateModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || '',
      assignee: task.assignee || '',
      tags: task.tags,
    });
    setEditingTask(task);
    setIsCreateModalOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
  };

  const handleBackToDashboard = () => {
    setViewingTask(null);
  };

  const handleSaveTask = () => {
    if (!formData.title.trim()) return;

    const now = new Date().toISOString();
    
    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(task =>
        task.id === editingTask.id
          ? {
              ...task,
              ...formData,
              updatedAt: now,
            }
          : task
      ));
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        status: 'todo',
        createdAt: now,
        updatedAt: now,
        createdBy: currentUser,
        comments: [],
      };
      setTasks(prev => [...prev, newTask]);
    }

    setIsCreateModalOpen(false);
    setEditingTask(null);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
    
    // Update viewing task if it's the same task
    if (viewingTask && viewingTask.id === taskId) {
      setViewingTask({ ...viewingTask, ...updates });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleDragStart = useCallback((task: Task) => {
    setDraggedTask(task);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedTask(null);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    
    if (draggedTask && draggedTask.id === taskId) {
      setTasks(prev => prev.map(task =>
        task.id === taskId
          ? { ...task, status, updatedAt: new Date().toISOString() }
          : task
      ));
    }
    setDraggedTask(null);
  };

  const handleTagInput = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, tags }));
  };

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  // Show task view if viewing a task
  if (viewingTask) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          onCreateTask={handleCreateTask} 
          onSearch={setSearchQuery}
          onBack={handleBackToDashboard}
          showBackButton={true}
          title={viewingTask.title}
        />
        <TaskView
          task={viewingTask}
          onBack={handleBackToDashboard}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onUpdateTask={handleUpdateTask}
          currentUser={currentUser}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onCreateTask={handleCreateTask} onSearch={setSearchQuery} />
      
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Dashboard</h2>
          <p className="text-gray-600">Track and manage your team's tasks efficiently</p>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tasksByStatus.map((column) => (
            <div
              key={column.id}
              className={`${column.color} rounded-lg p-4 min-h-[500px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 flex items-center">
                  {column.title}
                  <span className="ml-2 bg-white/70 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {column.tasks.length}
                  </span>
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Plus}
                  onClick={handleCreateTask}
                  className="p-1 hover:bg-white/50"
                />
              </div>

              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <DraggableItem
                    key={task.id}
                    task={task}
                    onView={handleViewTask}
                    onEdit={handleEditTask}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedTask?.id === task.id}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        size="lg"
      >
        <div className="space-y-4">
          <FormFieldInput
            label="Title"
            value={formData.title}
            onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
            placeholder="Enter task title"
            required
          />

          <FormFieldInput
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            placeholder="Describe the task..."
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldInput
              label="Priority"
              type="select"
              value={formData.priority}
              onChange={(value) => setFormData(prev => ({ ...prev, priority: value as Priority }))}
              options={priorityOptions}
            />

            <FormFieldInput
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(value) => setFormData(prev => ({ ...prev, dueDate: value }))}
            />
          </div>

          <FormFieldInput
            label="Assignee"
            value={formData.assignee}
            onChange={(value) => setFormData(prev => ({ ...prev, assignee: value }))}
            placeholder="Enter assignee name"
          />

          <FormFieldInput
            label="Tags"
            value={formData.tags.join(', ')}
            onChange={handleTagInput}
            placeholder="Enter tags separated by commas"
          />

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              icon={X}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTask}
              icon={Save}
              disabled={!formData.title.trim()}
            >
              {editingTask ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}