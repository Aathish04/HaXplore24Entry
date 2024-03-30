# ngrok http --domain=frank-dinosaur-virtually.ngrok-free.app 80


from fastapi import FastAPI,Request
import json
# from . import utils.digilocker_workflow_retreive import get_aadhaar
from utils.digilocker_workflow_retreive import get_aadhaar
from fastapi.responses import HTMLResponse
app = FastAPI()

@app.get("/digilocker_request_result_webhook")
async def digilocker_request_result_webhook(request:Request):
    outcome=dict(request.query_params)
    f = open("C:/Users/alamu/Documents/HaXplore24Entry/backend/registration.html","r")
    html_content = f.read()
    f.close()
    return HTMLResponse(content=html_content,status_code=200)
    # return {"message": f"Received GET request with parameters: {str(outcome)}"}

@app.post("/create_account")
async def create_account(request:Request):
    s=await request.json()
    print(s)
    DigilockerRequestID = s["id"]
    Phone = s["phone"]
    Email = s["email"]
    aadhar_json = get_aadhaar(DigilockerRequestID)
    print(aadhar_json)
    with open("sample.json","w") as f:
        json.dump(aadhar_json,f)
    return s

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
