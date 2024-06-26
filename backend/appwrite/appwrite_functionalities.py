from datetime import datetime
from appwrite.client import Client
from appwrite.exception import AppwriteException
from appwrite.services.users import Users
from appwrite.services.databases import Databases
from appwrite.id import ID
from Crypto.PublicKey import RSA
from appwrite.services.account import Account
from appwrite.permission import Permission
from appwrite.role import Role

Database_ID = "66071664001e1106b8bc"
Hospital_CollectionID = "6608044500387ef00454"
UserInformation_CollectionID= "66079e7c000cd257b449"
Doctor_CollectionID = "660804510032437783a5"

def initialize():
  client = Client()

  (client
    .set_endpoint('https://frank-dinosaur-virtually.ngrok-free.app/v1') # Your API Endpoint
    .set_project('6606f3f6002f1aec6db8') # Your project ID
    .set_key('ba15cffd1a26171498fa30a1cdfc866c70c743c536f42827be26240dff0adf84d43ef88e72452a3959e105fe8094a439e1f0131806b19bf5b4b258fd83cd67774c1bc649543d1538845b1e1b9f762e7ed52142659b9017347dc891870658f63382b17aa6ba6b9dfd8dd8c59fa6dc4ef067168f779034911fa22d3e8297650928') # Your secret API key
    .set_self_signed() # Use only on dev mode with a self-signed SSL cert
  )

  users = Users(client)
  databases = Databases(client)
  return {"Client":client, "Users":users, "Databases":databases}

def create_account(users,databases,MAadhar,Name,Gender,DOB,Email,Phone,Photograph,Password,Address,DigilockerRequestID,labels=["user"]):
  try:
    r = users.create(user_id=Phone, email = Email, phone = "+91"+ Phone, password = Password, name = Name)
    users.update_labels(user_id=Phone,labels=labels)
  except AppwriteException as e:
    print(e.message)
  key_pair = RSA.generate(2048)

  document = {
              "Gender":Gender,
              "Name":Name,
              "Address":Address,
              "MAadhaar":MAadhar,
              "Photograph":Photograph,
              "DigilockerRequestID":DigilockerRequestID,
              "DOB":str(datetime.strptime(DOB, '%d-%m-%Y').date()),
              "PublicKey":key_pair.publickey().exportKey().decode("utf-8"),
              "PrivateKey":key_pair.exportKey().decode("utf-8"),
              }
  try:
    result = databases.create_document(Database_ID, UserInformation_CollectionID, Phone, document,[
      Permission.update(Role.user(Phone)),Permission.read(Role.user(Phone))
      ])
    
    
  except AppwriteException as e:
    print(e.message)


def login(client,Email,Password,Phone):
  account = Account(client)
  try:
    r = account.create_email_password_session(Email,Password)
    print(r)
    databases = Databases(client)
    user_info = databases.get_document(database_id=Database_ID,
                           collection_id=UserInformation_CollectionID,
                           document_id=Phone)

    return user_info
  except AppwriteException as e:
      print(e.message)
      return -1
  
  
  
