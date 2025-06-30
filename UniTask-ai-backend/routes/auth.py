from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import User
from schemas import UserCreate, UserOut, TokenOut
from auth_utils import hash_pwd, verify_pwd, create_token
from database import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserOut, status_code=201)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    if (await db.scalar(select(User).where(User.email == user.email))):
        raise HTTPException(400, "Email already registered")
    new_user = User(email=user.email,
                    hashed_password=hash_pwd(user.password),
                    role=user.role)
    db.add(new_user)
    await db.commit(); await db.refresh(new_user)
    return new_user

@router.post("/login", response_model=TokenOut)
async def login(user: UserCreate, db: AsyncSession = Depends(get_db)):
    db_user: User = await db.scalar(select(User).where(User.email == user.email))
    if not db_user or not verify_pwd(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid creds")
    token = create_token(db_user.id, db_user.role)
    return {"token": token, "role": db_user.role}