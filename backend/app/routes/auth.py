from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import User
from app.schemas.auth import UserCreate, UserLogin, AuthResponse, UserResponse
from app.services.auth_service import AuthService
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=AuthResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    Returns user data and access token.
    """
    return AuthService.signup(db, user_data)


@router.post("/login", response_model=AuthResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user with email and password.
    Returns user data and access token.
    """
    return AuthService.login(db, credentials)


@router.post("/logout")
def logout():
    """
    Logout endpoint (token invalidation is handled client-side).
    For a production app, you might want to blacklist tokens here.
    """
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information.
    Requires valid Bearer token.
    """
    return AuthService.get_current_user(current_user)
