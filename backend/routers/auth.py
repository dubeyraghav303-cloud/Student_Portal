from fastapi import APIRouter, HTTPException, status, Depends
from models import StudentRegister, AdminRegister, LoginRequest, ChangePasswordRequest
from database import supabase
from auth_utils import get_password_hash, verify_password, create_access_token
from dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register/student")
async def register_student(student: StudentRegister):
    # Check if exists
    res = supabase.table("students").select("*").eq("email", student.email).execute()
    if res.data:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    res = supabase.table("students").select("*").eq("enrollment_number", student.enrollment_number).execute()
    if res.data:
        raise HTTPException(status_code=400, detail="Enrollment number already registered")
        
    hashed_pw = get_password_hash(student.password)
    new_student = {
        "email": student.email,
        "enrollment_number": student.enrollment_number,
        "password_hash": hashed_pw,
        "name": student.name,
        "department": student.department,
        "branch": student.branch,
        "year": student.year
    }
    
    data = supabase.table("students").insert(new_student).execute()
    return {"message": "Student registered successfully", "data": data.data[0]}

@router.post("/login/student")
async def login_student(req: LoginRequest):
    # Determine if identifier is email or enrollment_number
    if "@" in req.identifier:
        res = supabase.table("students").select("*").eq("email", req.identifier).execute()
    else:
        res = supabase.table("students").select("*").eq("enrollment_number", req.identifier).execute()
        
    if not res.data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    user = res.data[0]
    if not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    access_token = create_access_token(data={"sub": user["id"], "role": "student", "department": user["department"]})
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user["id"], "name": user["name"], "role": "student", "department": user["department"]}}

import os

@router.post("/register/admin")
async def register_admin(admin: AdminRegister, registration_secret: str):
    # Security check: Ensure only authorized personnel can create an admin account
    expected_secret = os.getenv("ADMIN_REGISTRATION_SECRET", "supersecret123")
    if registration_secret != expected_secret:
        raise HTTPException(status_code=403, detail="Invalid registration secret")

    res = supabase.table("admins").select("*").eq("email", admin.email).execute()
    if res.data:
        raise HTTPException(status_code=400, detail="Admin email already registered")
        
    hashed_pw = get_password_hash(admin.password)
    new_admin = {
        "email": admin.email,
        "enrollment_number": admin.enrollment_number,
        "password_hash": hashed_pw,
        "name": admin.name,
        "department": admin.department,
    }
    
    data = supabase.table("admins").insert(new_admin).execute()
    return {"message": "Admin registered successfully", "data": data.data[0]}

@router.post("/login/admin")
async def login_admin(req: LoginRequest):
    if "@" in req.identifier:
        res = supabase.table("admins").select("*").eq("email", req.identifier).execute()
    else:
        res = supabase.table("admins").select("*").eq("enrollment_number", req.identifier).execute()
        
    if not res.data:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
        
    user = res.data[0]
    if not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
        
    access_token = create_access_token(data={"sub": user["id"], "role": "admin", "department": user["department"]})
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user["id"], "name": user["name"], "role": "admin", "department": user["department"]}}

@router.post("/change-password")
async def change_password(req: ChangePasswordRequest, user=Depends(get_current_user)):
    table = "students" if user["role"] == "student" else "admins"
    res = supabase.table(table).select("*").eq("id", user["sub"]).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    current_user = res.data[0]
    if not verify_password(req.old_password, current_user["password_hash"]):
        raise HTTPException(status_code=400, detail="Incorrect old password")
        
    hashed_new = get_password_hash(req.new_password)
    supabase.table(table).update({"password_hash": hashed_new}).eq("id", user["sub"]).execute()
    return {"message": "Password updated successfully"}
