from dotenv import load_dotenv
import requests
load_dotenv()
import os

print(os.environ["SETU_PRODUCT_ID"])
url = "https://dg-sandbox.setu.co/api/digilocker"

payload = {"redirectUrl": "https://commonly-liberal-porpoise.ngrok-free.app/digilocker_request_result_webhook"}
headers = {
	"x-client-id": os.environ["SETU_CLIENT_ID"],
	"x-client-secret": os.environ["SETU_CLIENT_SECRET"],
	"x-product-instance-id": os.environ["SETU_PRODUCT_ID"],
}

response = requests.request("post", url, json=payload, headers=headers)

print(response.text)