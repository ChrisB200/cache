from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from worker import main

import httpx

app = FastAPI()

origins = [
    "http://localhost",           # For local testing
    "http://127.0.0.1:8888", # Localhost with port
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserRequest(BaseModel):
    user_id: str


@app.get("/")
async def test():
    return "hi"


@app.post("/worker/shifts")
async def get_shifts(user_request: UserRequest, background_tasks: BackgroundTasks):
    user_id = user_request.user_id
    background_tasks.add_task(main, "shifts", user_id, False)
    return JSONResponse(
        content={"message": f"Started scraping shifts for {user_id}"},
        status_code=200,
    )


@app.post("/worker/payslips")
async def get_payslips(user_request: UserRequest, background_tasks: BackgroundTasks):
    user_id = user_request.user_id
    background_tasks.add_task(main, "payslips", user_id, False)
    return JSONResponse(
        content={"message": f"Started scraping payslips for {user_id}"},
        status_code=200,
    )


@app.post("/worker/all")
async def get_all(user_request: UserRequest, background_tasks: BackgroundTasks):
    user_id = user_request.user_id
    background_tasks.add_task(main, "all", user_id, False)
    return JSONResponse(
        content={"message": f"Started scraping all for {user_id}"},
        status_code=200,
    )

# NEED TO ADD CALLBACK ROUTE

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8888, log_level="debug")
