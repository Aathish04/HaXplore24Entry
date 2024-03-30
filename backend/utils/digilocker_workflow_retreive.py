import requests
import os

def get_document(request_id,docType,format,consent):
    url = f"https://dg-sandbox.setu.co/api/digilocker/{request_id}/document"

    payload = {
        "docType": docType,
        "format": format,
        "consent": consent
    }
    headers = {
        "x-client-id": os.environ["SETU_CLIENT_ID"],
        "x-client-secret": os.environ["SETU_CLIENT_SECRET"],
        "x-product-instance-id": os.environ["SETU_PRODUCT_ID"],
    }
    response = requests.request("post", url, json=payload, headers=headers)
    return response.json()

def list_documents_available():
    url = f"https://dg-sandbox.setu.co/api/digilocker/documents"

    headers = {
        "x-client-id": os.environ["SETU_CLIENT_ID"],
        "x-client-secret": os.environ["SETU_CLIENT_SECRET"],
        "x-product-instance-id": os.environ["SETU_PRODUCT_ID"],
    }
    response = requests.request("get", url, headers=headers)

    return response.json()

def get_aadhaar(request_id):
    url = f"https://dg-sandbox.setu.co/api/digilocker/{request_id}/aadhaar"

    headers = {
        "x-client-id": os.environ["SETU_CLIENT_ID"],
        "x-client-secret": os.environ["SETU_CLIENT_SECRET"],
        "x-product-instance-id": os.environ["SETU_PRODUCT_ID"],
    }
    response = requests.request("get", url, headers=headers)
    return response.json()


def get_status(request_id):
    url = f"https://dg-sandbox.setu.co/api/digilocker/{request_id}/status"

    headers = {
        "x-client-id": os.environ["SETU_CLIENT_ID"],
        "x-client-secret": os.environ["SETU_CLIENT_SECRET"],
        "x-product-instance-id": os.environ["SETU_PRODUCT_ID"],
    }
    response = requests.request("get", url, headers=headers)
    return response.json()


import json


# print(get_document(request_id="",docType="AADHAAR",format="pdf",consent="Y")
# print(json.dumps(get_status(request_id=""),indent=4))
print(json.dumps(get_aadhaar(request_id=""),indent=4))


# print(json.dumps(list_documents_available(),indent=4))