import React from 'react';
import { Calendar, User, Flag, Tag, Edit, MessageCircle } from 'lucide-react';
import { Task, Priority } from '../types/types';
import Button from './Button';

interface TaskCardProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  isDragging?: boolean;
  currentUser?: string;
}

export default function TaskCard({ 
  task, 
  onView, 
  onEdit, 
  isDragging = false,
  currentUser = 'John Doe'
}: TaskCardProps) {
  const priorityColors: Record<Priority, string> = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200',
  };

  const priorityIcons: Record<Priority, string> = {
    low: '🟢',
    medium: '🟡',
    high: '🟠',
    urgent: '🔴',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const canEdit = task.createdBy === currentUser;
  const totalComments = task.comments.reduce((count, comment) => count + 1 + comment.replies.length, 0);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onView(task);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 transform rotate-2' : ''
      } ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}
      onClick={handleCardClick}
    >
      {/* Header with Priority and Edit Button */}
      <div className="flex items-start justify-between mb-2">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
          <span className="mr-1">{priorityIcons[task.priority]}</span>
          {task.priority}
        </span>
        {canEdit && (
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={handleEditClick}
            className="p-1 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
          {task.tags.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
              +{task.tags.length - 2} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-3">
          {task.dueDate && (
            <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : ''}`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
          {task.assignee && (
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{task.assignee}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {totalComments > 0 && (
            <div className="flex items-center space-x-1 text-blue-600">
              <MessageCircle className="w-3 h-3" />
              <span>{totalComments}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Flag className="w-3 h-3" />
            <span className="capitalize">{task.status.replace('-', ' ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}