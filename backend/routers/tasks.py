from fastapi import APIRouter, Depends, HTTPException
from database import supabase
from models import TaskCreate
from dependencies import get_current_admin, get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/")
async def create_task(task: TaskCreate, admin=Depends(get_current_admin)):
    new_task = {
        "title": task.title,
        "description": task.description,
        "allow_attachments": task.allow_attachments,
        "created_by": admin["sub"]
    }
    res = supabase.table("tasks").insert(new_task).execute()
    return {"message": "Task created successfully", "task": res.data[0]}

@router.get("/")
async def get_all_tasks(user=Depends(get_current_user)):
    res = supabase.table("tasks").select("*").order('created_at', desc=True).execute()
    return res.data

@router.delete("/{task_id}")
async def delete_task(task_id: str, admin=Depends(get_current_admin)):
    res = supabase.table("tasks").delete().eq("id", task_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}
