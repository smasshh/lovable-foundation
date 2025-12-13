from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.db.models import User
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.auth import UserCreate, UserLogin, AuthResponse, UserResponse


class AuthService:
    """Service for handling authentication operations."""
    
    @staticmethod
    def signup(db: Session, user_data: UserCreate) -> AuthResponse:
        """Register a new user."""
        # Check if email already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user with hashed password
        new_user = User(
            name=user_data.name,
            email=user_data.email,
            password_hash=hash_password(user_data.password)
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Generate access token
        access_token = create_access_token(str(new_user.id))
        
        return AuthResponse(
            user=UserResponse(
                id=str(new_user.id),
                name=new_user.name,
                email=new_user.email
            ),
            accessToken=access_token
        )
    
    @staticmethod
    def login(db: Session, credentials: UserLogin) -> AuthResponse:
        """Authenticate user and return token."""
        # Find user by email
        user = db.query(User).filter(User.email == credentials.email).first()
        
        if not user or not verify_password(credentials.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Generate access token
        access_token = create_access_token(str(user.id))
        
        return AuthResponse(
            user=UserResponse(
                id=str(user.id),
                name=user.name,
                email=user.email
            ),
            accessToken=access_token
        )
    
    @staticmethod
    def get_current_user(user: User) -> UserResponse:
        """Get current authenticated user."""
        return UserResponse(
            id=str(user.id),
            name=user.name,
            email=user.email
        )
