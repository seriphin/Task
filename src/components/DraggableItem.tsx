import React from 'react';
import { Task } from '../types/types';
import TaskCard from './TaskCard';

interface DraggableItemProps {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  currentUser?: string;
}

export default function DraggableItem({
  task,
  onView,
  onEdit,
  onDragStart,
  onDragEnd,
  isDragging,
  currentUser,
}: DraggableItemProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(task);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="select-none group"
    >
      <TaskCard 
        task={task} 
        onView={onView}
        onEdit={onEdit} 
        isDragging={isDragging}
        currentUser={currentUser}
      />
    </div>
  );
}