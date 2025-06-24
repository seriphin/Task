import React, { useState } from 'react';
import { Task, Comment, CreateCommentData, Priority } from '../types/types';
import { Calendar, User, Flag, Tag, Edit, Trash2, MessageCircle, Send } from 'lucide-react';
import Button from '../components/Button';
import FormFieldInput from '../components/FormFieldInput';
import CommentItem from '../components/CommentItem';

interface TaskViewProps {
  task: Task;
  onBack: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  currentUser?: string;
}

export default function TaskView({
  task,
  onBack,
  onEdit,
  onDelete,
  onUpdateTask,
  currentUser = 'John Doe',
}: TaskViewProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const canEdit = task.createdBy === currentUser;
  const totalComments = task.comments.reduce((count, comment) => count + 1 + comment.replies.length, 0);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    
    const comment: Comment = {
      id: Date.now().toString(),
      taskId: task.id,
      content: newComment.trim(),
      author: currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
    };

    const updatedTask = {
      ...task,
      comments: [...task.comments, comment],
      updatedAt: new Date().toISOString(),
    };

    onUpdateTask(task.id, updatedTask);
    setNewComment('');
    setIsSubmittingComment(false);
  };

  const handleReply = (parentId: string, content: string) => {
    const reply: Comment = {
      id: Date.now().toString(),
      taskId: task.id,
      content,
      author: currentUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      parentId,
      replies: [],
    };

    const addReplyToComment = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, reply],
          };
        }
        if (comment.replies.length > 0) {
          return {
            ...comment,
            replies: addReplyToComment(comment.replies),
          };
        }
        return comment;
      });
    };

    const updatedComments = addReplyToComment(task.comments);
    const updatedTask = {
      ...task,
      comments: updatedComments,
      updatedAt: new Date().toISOString(),
    };

    onUpdateTask(task.id, updatedTask);
  };

  const handleEditComment = (commentId: string, content: string) => {
    const updateComment = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            content,
            updatedAt: new Date().toISOString(),
          };
        }
        if (comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateComment(comment.replies),
          };
        }
        return comment;
      });
    };

    const updatedComments = updateComment(task.comments);
    const updatedTask = {
      ...task,
      comments: updatedComments,
      updatedAt: new Date().toISOString(),
    };

    onUpdateTask(task.id, updatedTask);
  };

  const handleDeleteComment = (commentId: string) => {
    const removeComment = (comments: Comment[]): Comment[] => {
      return comments.filter(comment => {
        if (comment.id === commentId) {
          return false;
        }
        if (comment.replies.length > 0) {
          comment.replies = removeComment(comment.replies);
        }
        return true;
      });
    };

    const updatedComments = removeComment(task.comments);
    const updatedTask = {
      ...task,
      comments: updatedComments,
      updatedAt: new Date().toISOString(),
    };

    onUpdateTask(task.id, updatedTask);
  };

  const handleDeleteTask = () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      onDelete(task.id);
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Task Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[task.priority]}`}>
                  <span className="mr-2">{priorityIcons[task.priority]}</span>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  task.status === 'done' ? 'bg-green-100 text-green-800' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  task.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  <Flag className="w-4 h-4 mr-1" />
                  {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
              {task.description && (
                <p className="text-gray-700 text-base leading-relaxed mb-4">{task.description}</p>
              )}
            </div>
            
            {canEdit && (
              <div className="flex space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit}
                  onClick={() => onEdit(task)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={handleDeleteTask}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Task Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {task.dueDate && (
              <div className={`flex items-center space-x-2 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                <Calendar className="w-4 h-4" />
                <div>
                  <span className="text-sm font-medium">Due Date</span>
                  <p className="text-sm">{formatDate(task.dueDate)}</p>
                </div>
              </div>
            )}
            {task.assignee && (
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-4 h-4" />
                <div>
                  <span className="text-sm font-medium">Assignee</span>
                  <p className="text-sm">{task.assignee}</p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2 text-gray-600">
              <MessageCircle className="w-4 h-4" />
              <div>
                <span className="text-sm font-medium">Comments</span>
                <p className="text-sm">{totalComments} comment{totalComments !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {task.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Task Timestamps */}
          <div className="text-xs text-gray-500 border-t pt-4">
            <p>Created: {formatDate(task.createdAt)} by {task.createdBy}</p>
            {task.updatedAt !== task.createdAt && (
              <p>Last updated: {formatDate(task.updatedAt)}</p>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Comments ({totalComments})
            </h2>
          </div>

          {/* Add Comment Form */}
          <div className="mb-6 border-b pb-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 space-y-3">
                <FormFieldInput
                  label=""
                  type="textarea"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={setNewComment}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isSubmittingComment}
                    icon={Send}
                    size="sm"
                  >
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {task.comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              task.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                  currentUser={currentUser}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}