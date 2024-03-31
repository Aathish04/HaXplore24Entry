# ngrok http --domain=frank-dinosaur-virtually.ngrok-free.app 80

from fastapi import FastAPI,Request
import backend.appwrite.appwrite_functionalities as appwrite_functionalities
from backend.utils.digilocker import get_aadhaar,get_digilocker_flow_url
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from datetime import date
import ocr
from ipfs import ipfs
app = FastAPI()

app.mount("/static", StaticFiles(directory="backend/static"), name="static")
templates = Jinja2Templates(directory="backend/static/templates")

app.mount("/doctor", StaticFiles(directory="backend/static/doctor_dashboard"), name="doctor")

@app.get("/digilocker_request_result_webhook")
async def digilocker_request_result_webhook(request:Request):
    return templates.TemplateResponse(
            request=request, name="registration.html"
        )

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


@app.post("/evaluate_vitals")
async def evaluate_vitals(request:Request):
    s = await request.json()
    video_binary = s["video"]
    f = open("file.mp4","w")
    f.write(video_binary)
    f.close()

@app.post("/perform_ocr")
async def perform_ocr(request:Request):
    #json format from frontend : {user_id:userid,record_type:prescription/report,type:pdf/jpg,binary:}
    s = await request.json()
    print(s)
    return {"s":s}
    date = str(date.today())
    userid = s["user_id"]
    record_type = s["record_type"]
    type = s["type"]
    binary = s["binary"]
    if type == "pdf":
        path = "/tmp/" + userid+"_"+record_type+"_"+date+"/.pdf"
    else:
        path = "/tmp/" + userid+"_"+record_type+"_"+date+"/.jpg"

    f = open(path,"w")
    f.write(binary)
    f.close()
    text_in_file = ocr.performOCR(path)
    f = open(path,"w")
    f.write(text_in_file)
    f.close()
    cid = ipfs.putFile(path)
    # add to user document in appwrite
    d = appwrite_functionalities.initialize()
    databases = d["Databases"]
    existing_document = databases.get_document(database_id = '66071664001e1106b8bc',
                                               collection_id = '66079e7c000cd257b449',
                                               document_id = userid)

    result = databases.update_document(
        database_id = '66071664001e1106b8bc',
        collection_id = '66079e7c000cd257b449',
        document_id = userid,
        data = {}, # optional
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


