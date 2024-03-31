# ngrok http --domain=frank-dinosaur-virtually.ngrok-free.app 80

# from appwrite_functionalities import *
from fastapi import FastAPI,Request
import json
# from . import utils.digilocker_workflow_retreive import get_aadhaar
import backend.appwrite.appwrite_functionalities as appwrite_functionalities
from backend.utils.digilocker import get_aadhaar,get_digilocker_flow_url
# import utils.digilocker_workflow_retreive.get_aadhaar import get_aadhaar
from fastapi.responses import HTMLResponse
app = FastAPI()

@app.get("/digilocker_request_result_webhook")
async def digilocker_request_result_webhook(request:Request):
    outcome=dict(request.query_params)
    with open("backend/registration.html","r") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content,status_code=200)
    # return {"message": f"Received GET request with parameters: {str(outcome)}"}

@app.post("/create_account")
async def create_account(request:Request):
    s=await request.json()
    print(s)
    DigilockerRequestID = s["id"]
    Phone = s["phone"]
    Email = s["email"]
    Password = s["password"]
    aadhar_json = get_aadhaar(DigilockerRequestID)
    print(aadhar_json)
    Address = str(aadhar_json["aadhaar"]["address"])
    DateOfBirth = aadhar_json["aadhaar"]["dateOfBirth"]
    Name = aadhar_json["aadhaar"]["name"]
    Photograph = aadhar_json["aadhaar"]["photo"]
    MAadhar = aadhar_json["aadhaar"]["maskedNumber"]
    Gender = aadhar_json["aadhaar"]["gender"]

    d = appwrite_functionalities.initialize()
    users = d["Users"]
    databases = d["Databases"]
    appwrite_functionalities.create_account(users,databases,MAadhar,Name,Gender,DateOfBirth,Email,Phone,Photograph,Password,Address,DigilockerRequestID,labels=["user"])
    return s

@app.post("/login")
async def login(request:Request):
    s = await request.json()
    Email = s["email"]
    Password = s["password"]
    d = appwrite_functionalities.initialize()
    client = d["Client"]
    r = appwrite_functionalities.login(client,Email,Password)
    if r == -1:
        print("Failed Login")
    else:
        return r["$id"] #session ID

@app.get("/init_digilocker_flow")
async def init_digilocker_flow(request:Request):
    return get_digilocker_flow_url()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
