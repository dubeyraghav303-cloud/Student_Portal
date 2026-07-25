from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class StudentRegister(BaseModel):
    email: EmailStr
    enrollment_number: str
    password: str
    name: str
    branch: Optional[str] = None
    year: Optional[int] = None

class AdminRegister(BaseModel):
    email: EmailStr
    enrollment_number: str
    password: str
    name: str

class LoginRequest(BaseModel):
    # Could be email or enrollment number
    identifier: str
    password: str

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    allow_attachments: bool = False

class SubmissionCreate(BaseModel):
    task_id: str
    submission_content: str
    file_url: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
