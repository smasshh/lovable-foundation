from typing import List
from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.db.models import Project, User
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse


class ProjectService:
    """Service class for project operations."""
    
    @staticmethod
    def get_user_projects(db: Session, user: User) -> List[ProjectResponse]:
        """Get all projects for a user."""
        projects = db.query(Project).filter(
            Project.user_id == user.id
        ).order_by(Project.created_at.desc()).all()
        
        return [
            ProjectResponse(
                id=str(project.id),
                user_id=str(project.user_id),
                name=project.name,
                description=project.description,
                color=project.color,
                task_count=len(project.tasks) if project.tasks else 0,
                created_at=project.created_at.isoformat()
            )
            for project in projects
        ]
    
    @staticmethod
    def get_project_by_id(db: Session, user: User, project_id: str) -> ProjectResponse:
        """Get a project by ID."""
        try:
            project_uuid = UUID(project_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid project ID format"
            )
        
        project = db.query(Project).filter(
            Project.id == project_uuid,
            Project.user_id == user.id
        ).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        return ProjectResponse(
            id=str(project.id),
            user_id=str(project.user_id),
            name=project.name,
            description=project.description,
            color=project.color,
            task_count=len(project.tasks) if project.tasks else 0,
            created_at=project.created_at.isoformat()
        )
    
    @staticmethod
    def create_project(db: Session, user: User, project_data: ProjectCreate) -> ProjectResponse:
        """Create a new project."""
        project = Project(
            user_id=user.id,
            name=project_data.name,
            description=project_data.description,
            color=project_data.color or "#3B82F6"
        )
        
        db.add(project)
        db.commit()
        db.refresh(project)
        
        return ProjectResponse(
            id=str(project.id),
            user_id=str(project.user_id),
            name=project.name,
            description=project.description,
            color=project.color,
            task_count=0,
            created_at=project.created_at.isoformat()
        )
    
    @staticmethod
    def update_project(db: Session, user: User, project_id: str, project_data: ProjectUpdate) -> ProjectResponse:
        """Update a project."""
        try:
            project_uuid = UUID(project_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid project ID format"
            )
        
        project = db.query(Project).filter(
            Project.id == project_uuid,
            Project.user_id == user.id
        ).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        # Update fields if provided
        if project_data.name is not None:
            project.name = project_data.name
        if project_data.description is not None:
            project.description = project_data.description
        if project_data.color is not None:
            project.color = project_data.color
        
        db.commit()
        db.refresh(project)
        
        return ProjectResponse(
            id=str(project.id),
            user_id=str(project.user_id),
            name=project.name,
            description=project.description,
            color=project.color,
            task_count=len(project.tasks) if project.tasks else 0,
            created_at=project.created_at.isoformat()
        )
    
    @staticmethod
    def delete_project(db: Session, user: User, project_id: str) -> dict:
        """Delete a project."""
        try:
            project_uuid = UUID(project_id)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid project ID format"
            )
        
        project = db.query(Project).filter(
            Project.id == project_uuid,
            Project.user_id == user.id
        ).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        
        db.delete(project)
        db.commit()
        
        return {"message": "Project deleted successfully"}
