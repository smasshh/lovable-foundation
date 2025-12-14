from typing import List
from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.db.models import Task, Project, User
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse


class TaskService:
    """Service class for task operations."""
    
    @staticmethod
    def get_user_tasks(db: Session, user: User) -> List[TaskResponse]:
        """Get all tasks for a user."""
        tasks = db.query(Task).filter(
            Task.user_id == user.id
        ).order_by(Task.created_at.desc()).all()
        
        return [
            TaskResponse(
                id=str(task.id),
                user_id=str(task.user_id),
                project_id=str(task.project_id),
                title=task.title,
                description=task.description,
                status=task.status,
                priority=task.priority,
                due_date=task.due_date.isoformat() if task.due_date else None,
                created_at=task.created_at.isoformat(),
                updated_at=task.updated_at.isoformat()
            )
            for task in tasks
        ]
    
    @staticmethod
    def get_project_tasks(db: Session, user: User, project_id: str) -> List[TaskResponse]:
        """Get all tasks for a specific project."""
        try:
            project_uuid = UUID(project_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid project ID format"
            )
        
        # Verify project ownership
        project = db.query(Project).filter(
            Project.id == project_uuid,
            Project.user_id == user.id
        ).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        tasks = db.query(Task).filter(
            Task.project_id == project_uuid,
            Task.user_id == user.id
        ).order_by(Task.created_at.desc()).all()
        
        return [
            TaskResponse(
                id=str(task.id),
                user_id=str(task.user_id),
                project_id=str(task.project_id),
                title=task.title,
                description=task.description,
                status=task.status,
                priority=task.priority,
                due_date=task.due_date.isoformat() if task.due_date else None,
                created_at=task.created_at.isoformat(),
                updated_at=task.updated_at.isoformat()
            )
            for task in tasks
        ]
    
    @staticmethod
    def create_task(db: Session, user: User, project_id: str, task_data: TaskCreate) -> TaskResponse:
        """Create a new task."""
        try:
            project_uuid = UUID(project_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid project ID format"
            )
        
        # Verify project ownership
        project = db.query(Project).filter(
            Project.id == project_uuid,
            Project.user_id == user.id
        ).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        # Parse due_date if provided
        due_date = None
        if task_data.due_date:
            try:
                due_date = datetime.fromisoformat(task_data.due_date.replace('Z', '+00:00'))
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid due date format"
                )
        
        task = Task(
            user_id=user.id,
            project_id=project_uuid,
            title=task_data.title,
            description=task_data.description,
            status=task_data.status or "todo",
            priority=task_data.priority or "medium",
            due_date=due_date
        )
        
        db.add(task)
        db.commit()
        db.refresh(task)
        
        return TaskResponse(
            id=str(task.id),
            user_id=str(task.user_id),
            project_id=str(task.project_id),
            title=task.title,
            description=task.description,
            status=task.status,
            priority=task.priority,
            due_date=task.due_date.isoformat() if task.due_date else None,
            created_at=task.created_at.isoformat(),
            updated_at=task.updated_at.isoformat()
        )
    
    @staticmethod
    def update_task(db: Session, user: User, task_id: str, task_data: TaskUpdate) -> TaskResponse:
        """Update a task."""
        try:
            task_uuid = UUID(task_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid task ID format"
            )
        
        task = db.query(Task).filter(
            Task.id == task_uuid,
            Task.user_id == user.id
        ).first()
        
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
        if task_data.priority is not None:
            task.priority = task_data.priority
        if task_data.due_date is not None:
            try:
                task.due_date = datetime.fromisoformat(task_data.due_date.replace('Z', '+00:00'))
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid due date format"
                )
        
        db.commit()
        db.refresh(task)
        
        return TaskResponse(
            id=str(task.id),
            user_id=str(task.user_id),
            project_id=str(task.project_id),
            title=task.title,
            description=task.description,
            status=task.status,
            priority=task.priority,
            due_date=task.due_date.isoformat() if task.due_date else None,
            created_at=task.created_at.isoformat(),
            updated_at=task.updated_at.isoformat()
        )
    
    @staticmethod
    def delete_task(db: Session, user: User, task_id: str) -> dict:
        """Delete a task."""
        try:
            task_uuid = UUID(task_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid task ID format"
            )
        
        task = db.query(Task).filter(
            Task.id == task_uuid,
            Task.user_id == user.id
        ).first()
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        
        db.delete(task)
        db.commit()
        
        return {"message": "Task deleted successfully"}
