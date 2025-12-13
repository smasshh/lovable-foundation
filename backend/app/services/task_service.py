from typing import List
from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.models import Task, User
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse


class TaskService:
    """Service for handling task operations."""
    
    @staticmethod
    def get_user_tasks(db: Session, user: User) -> List[TaskResponse]:
        """Get all tasks for the authenticated user."""
        tasks = db.query(Task).filter(Task.user_id == user.id).order_by(Task.created_at.desc()).all()
        return [
            TaskResponse(
                id=str(task.id),
                user_id=str(task.user_id),
                title=task.title,
                description=task.description,
                status=task.status,
                created_at=task.created_at.isoformat()
            )
            for task in tasks
        ]
    
    @staticmethod
    def create_task(db: Session, user: User, task_data: TaskCreate) -> TaskResponse:
        """Create a new task for the authenticated user."""
        new_task = Task(
            user_id=user.id,
            title=task_data.title,
            description=task_data.description,
            status=task_data.status or "todo"
        )
        
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        
        return TaskResponse(
            id=str(new_task.id),
            user_id=str(new_task.user_id),
            title=new_task.title,
            description=new_task.description,
            status=new_task.status,
            created_at=new_task.created_at.isoformat()
        )
    
    @staticmethod
    def update_task(db: Session, user: User, task_id: str, task_data: TaskUpdate) -> TaskResponse:
        """Update a task (user-scoped)."""
        try:
            task_uuid = UUID(task_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid task ID format"
            )
        
        # Get task and verify ownership
        task = db.query(Task).filter(Task.id == task_uuid, Task.user_id == user.id).first()
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        # Update fields if provided
        if task_data.title is not None:
            task.title = task_data.title
        if task_data.description is not None:
            task.description = task_data.description
        if task_data.status is not None:
            task.status = task_data.status
        
        db.commit()
        db.refresh(task)
        
        return TaskResponse(
            id=str(task.id),
            user_id=str(task.user_id),
            title=task.title,
            description=task.description,
            status=task.status,
            created_at=task.created_at.isoformat()
        )
    
    @staticmethod
    def delete_task(db: Session, user: User, task_id: str) -> dict:
        """Delete a task (user-scoped)."""
        try:
            task_uuid = UUID(task_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid task ID format"
            )
        
        # Get task and verify ownership
        task = db.query(Task).filter(Task.id == task_uuid, Task.user_id == user.id).first()
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        db.delete(task)
        db.commit()
        
        return {"message": "Task deleted successfully"}
