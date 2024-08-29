import subprocess
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from worker import main

app = FastAPI()


class UserRequest(BaseModel):
    user_id: str


@app.get("/")
async def test():
    return "hi"


@app.post("/worker/shifts")
async def get_shifts(user_request: UserRequest):
    user_id = user_request.user_id
    await main("shifts", user_id, False, False)
    return JSONResponse(
        content={"message": f"Scraped shifts for {user_id}"}, status_code=200
    )


@app.post("/worker/payslips")
async def get_payslips(user_request: UserRequest):
    user_id = user_request.user_id
    await main("payslips", user_id, False, False)
    return JSONResponse(
        content={"message": f"Successfully scraped payslips for {user_id}"},
        status_code=200,
    )


@app.post("/worker/all")
async def get_all(user_request: UserRequest):
    user_id = user_request.user_id
    await main("all", user_id, False, False)
    return JSONResponse(
        content={"message": f"Successfully scraped all for {user_id}"}, status_code=200
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8888, log_level="debug")
