from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from database import supabase
from models import SubmissionCreate
from dependencies import get_current_admin, get_current_student
from datetime import datetime

router = APIRouter(prefix="/submissions", tags=["submissions"])

def send_submission_notification(student_name: str, task_id: str):
    # Future integration: send email via fastapi-mail or smtplib
    # For now, it's just a placeholder to demonstrate BackgroundTasks
    print(f"Notification: Student {student_name} submitted task {task_id} at {datetime.now()}")

@router.post("/")
async def submit_task(sub: SubmissionCreate, background_tasks: BackgroundTasks, student=Depends(get_current_student)):
    # Verify task exists
    task_res = supabase.table("tasks").select("*").eq("id", sub.task_id).execute()
    if not task_res.data:
        raise HTTPException(status_code=404, detail="Task not found")
        
    # Get student name
    student_res = supabase.table("students").select("name").eq("id", student["sub"]).execute()
    student_name = student_res.data[0]["name"] if student_res.data else "Unknown"
    
    new_sub = {
        "task_id": sub.task_id,
        "student_id": student["sub"],
        "student_name": student_name,
        "submission_content": sub.submission_content,
        "file_url": sub.file_url
    }
    
    res = supabase.table("submissions").insert(new_sub).execute()
    
    # Add background task for email notification
    background_tasks.add_task(send_submission_notification, student_name, sub.task_id)
    
    return {"message": "Task submitted successfully", "submission": res.data[0]}

from fastapi import UploadFile, File
import uuid

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), student=Depends(get_current_student)):
    try:
        file_ext = file.filename.split('.')[-1]
        file_name = f"{uuid.uuid4()}.{file_ext}"
        contents = await file.read()
        # Upload to Supabase Storage Bucket 'task_attachments'
        supabase.storage.from_("task_attachments").upload(
            path=file_name,
            file=contents,
            file_options={"content-type": file.content_type}
        )
        # Construct public URL
        public_url = supabase.storage.from_("task_attachments").get_public_url(file_name)
        return {"file_url": public_url}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@router.get("/task/{task_id}")
async def get_submissions_for_task(task_id: str, admin=Depends(get_current_admin)):
    # Only admins can see all submissions for a task
    res = supabase.table("submissions").select("*").eq("task_id", task_id).order('submitted_at', desc=True).execute()
    return res.data

@router.get("/me")
async def get_my_submissions(student=Depends(get_current_student)):
    res = supabase.table("submissions").select("*").eq("student_id", student["sub"]).order('submitted_at', desc=True).execute()
    return res.data

@router.get("/student/{student_id}")
async def get_submissions_by_student(student_id: str, admin=Depends(get_current_admin)):
    # Admin can see all submissions of a specific student
    res = supabase.table("submissions").select("*").eq("student_id", student_id).order('submitted_at', desc=True).execute()
    return res.data
