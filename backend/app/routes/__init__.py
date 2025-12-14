# Routes module
from .auth import router as auth_router
from .tasks import router as tasks_router
from .projects import router as projects_router

__all__ = ["auth_router", "tasks_router", "projects_router"]
