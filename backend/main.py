from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, tasks, submissions, students

app = FastAPI(title="Club Management Portal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict this to the Next.js frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(submissions.router)
app.include_router(students.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Club Management Portal API"}
