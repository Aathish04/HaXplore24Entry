import asyncio 
from notificationapi_python_server_sdk import notificationapi
from dotenv import load_dotenv
load_dotenv()
import os
async def send_notification():
    notificationapi.init(
        os.environ["NOTIFICATIONAPI_CLIENT_ID"],
        os.environ["NOTIFICATIONAPI_CLIENT_SECRET"]
    )

    await notificationapi.send({
        "notificationId": "new_comment",
        "user": {
          "id": "aathish2110240@ssn.edu.in",
          "email": "aathish2110240@ssn.edu.in",
          "number": "" # Replace with your phone number
        },
        "mergeTags": {
          "comment": "Build something great :)",
          "commentId": "commentId-1234-abcd-wxyz"
        }
    })

asyncio.run(send_notification())