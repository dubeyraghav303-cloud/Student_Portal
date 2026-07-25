from fastapi import APIRouter, Depends
from database import supabase
from dependencies import get_current_admin, get_current_user

router = APIRouter(prefix="/students", tags=["students"])

@router.get("/")
async def get_all_students(admin=Depends(get_current_admin)):
    admin_dept = admin.get("department", "")
    res = supabase.table("students").select("id, email, enrollment_number, name, department, branch, year, created_at").eq("department", admin_dept).order('created_at', desc=True).execute()
    return res.data

@router.get("/{student_id}")
async def get_student_details(student_id: str, user=Depends(get_current_user)):
    res = supabase.table("students").select("id, email, enrollment_number, name, department, branch, year, created_at").eq("id", student_id).execute()
    return res.data[0] if res.data else None

from fastapi import HTTPException

@router.delete("/{student_id}")
async def delete_student(student_id: str, admin=Depends(get_current_admin)):
    admin_dept = admin.get("department", "")
    # Verify student exists and belongs to the same department
    res = supabase.table("students").select("department").eq("id", student_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if res.data[0].get("department") != admin_dept:
        raise HTTPException(status_code=403, detail="Not authorized to delete student from another department")
        
    delete_res = supabase.table("students").delete().eq("id", student_id).execute()
    return {"message": "Student deleted successfully"}
