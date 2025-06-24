import React, { useState } from 'react';
import { Reply, MoreHorizontal, Edit, Trash2, User } from 'lucide-react';
import { Comment } from '../types/types';
import Button from './Button';
import FormFieldInput from './FormFieldInput';

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  currentUser?: string;
  level?: number;
}

export default function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  currentUser = 'John Doe',
  level = 0,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);

  const canModify = comment.author === currentUser;
  const maxLevel = 3; // Maximum nesting level
  const canReply = level < maxLevel;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleReplySubmit = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent.trim());
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const handleEditSubmit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(comment.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment.id);
    }
  };

  return (
    <div className={`${level > 0 ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium text-gray-900 text-sm">{comment.author}</span>
            <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
            {comment.updatedAt !== comment.createdAt && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
          </div>
          
          {canModify && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                icon={MoreHorizontal}
                onClick={() => setShowActions(!showActions)}
                className="p-1"
              />
              {showActions && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="w-3 h-3 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <div className="space-y-3">
            <FormFieldInput
              label=""
              type="textarea"
              value={editContent}
              onChange={setEditContent}
              rows={3}
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleEditSubmit}>
                Save
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">{comment.content}</p>
        )}

        {/* Comment Actions */}
        {!isEditing && (
          <div className="flex items-center space-x-4">
            {canReply && (
              <Button
                variant="ghost"
                size="sm"
                icon={Reply}
                onClick={() => setIsReplying(!isReplying)}
                className="text-xs"
              >
                Reply
              </Button>
            )}
          </div>
        )}

        {/* Reply Form */}
        {isReplying && (
          <div className="mt-4 space-y-3 border-t pt-4">
            <FormFieldInput
              label=""
              type="textarea"
              placeholder="Write a reply..."
              value={replyContent}
              onChange={setReplyContent}
              rows={2}
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleReplySubmit} disabled={!replyContent.trim()}>
                Reply
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsReplying(false);
                  setReplyContent('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              currentUser={currentUser}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}