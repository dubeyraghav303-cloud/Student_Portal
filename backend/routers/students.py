from fastapi import APIRouter, Depends
from database import supabase
from dependencies import get_current_admin, get_current_user

router = APIRouter(prefix="/students", tags=["students"])

@router.get("/")
async def get_all_students(admin=Depends(get_current_admin)):
    # Admins can fetch all student details
    res = supabase.table("students").select("id, email, enrollment_number, name, branch, year, created_at").order('created_at', desc=True).execute()
    return res.data

@router.get("/{student_id}")
async def get_student_details(student_id: str, user=Depends(get_current_user)):
    res = supabase.table("students").select("id, email, enrollment_number, name, branch, year, created_at").eq("id", student_id).execute()
    return res.data[0] if res.data else None
