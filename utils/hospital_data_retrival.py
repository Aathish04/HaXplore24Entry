import requests
import json


reqUrl = "https://apinhpr.abdm.gov.in/v4/hfr/facility/search/searchFacility?pageNo=0&pageSize=20"

headersList = {
 "Accept": "application/json, text/plain, */*",
 "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
 "Connection": "keep-alive",
 "Content-Type": "application/json",
 "Origin": "https://nhpr.abdm.gov.in",
 "Referer": "https://nhpr.abdm.gov.in/",
 "Sec-Fetch-Dest": "empty",
 "Sec-Fetch-Mode": "cors",
 "Sec-Fetch-Site": "same-site",
 "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
 "sec-ch-ua": '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
 "sec-ch-ua-mobile": "?0",
 "sec-ch-ua-platform": "macOS" 
}

payload = json.dumps({
#   "state": "35",
#   "dist": "603",
#   "searchBy": "FAC_NAME",
#   "searchInput": "",
#   "daysOfOperation": "Mon,Tue,Wed,Thu,Fri,Sat,Sun",
#   "ownerShip": [
#     "G",
#     "P",
#     "PP"
#   ],
#   "abdm": true,
#   "onlineBooking": true,
#   "additionalService": [
#     "Blood Bank",
#     "Pharmacy",
#     "Diagnostic Laboratory",
#     "Imaging Center",
#     "Cath. Laboratory",
#     "Dialysis Center"
#   ],
  "orderBy": "asc"
})

response = requests.request("POST", reqUrl, data=payload,  headers=headersList)

print(response.json())