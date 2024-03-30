# ngrok http --domain=frank-dinosaur-virtually.ngrok-free.app 80


from fastapi import FastAPI,Request
import json
app = FastAPI()

@app.get("/digilocker_request_result_webhook")
async def digilocker_request_result_webhook(request:Request):
    outcome=dict(request.query_params)

    return {"message": f"Received GET request with parameters: {str(outcome)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
