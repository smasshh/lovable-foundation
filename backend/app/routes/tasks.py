from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import User
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services.task_service import TaskService
from app.dependencies.auth import get_current_user

router = APIRouter(tags=["Tasks"])


@router.get("/tasks", response_model=List[TaskResponse])
def get_all_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all tasks for the authenticated user.
    """
    return TaskService.get_user_tasks(db, current_user)


@router.get("/projects/{project_id}/tasks", response_model=List[TaskResponse])
def get_project_tasks(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all tasks for a specific project.
    """
    return TaskService.get_project_tasks(db, current_user, project_id)


@router.post("/projects/{project_id}/tasks", response_model=TaskResponse)
def create_task(
    project_id: str,
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new task in a project.
    """
    return TaskService.create_task(db, current_user, project_id, task_data)


@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: str,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a task owned by the authenticated user.
    """
    return TaskService.update_task(db, current_user, task_id, task_data)


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a task owned by the authenticated user.
    """
    return TaskService.delete_task(db, current_user, task_id)
