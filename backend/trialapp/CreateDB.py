from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.services.databases import Databases
from appwrite.id import ID

client = Client()

(client
.set_endpoint('http://172.27.240.1/v1') # Your API Endpoint
.set_project('6606f3f6002f1aec6db8') # Your project ID
.set_key('ba15cffd1a26171498fa30a1cdfc866c70c743c536f42827be26240dff0adf84d43ef88e72452a3959e105fe8094a439e1f0131806b19bf5b4b258fd83cd67774c1bc649543d1538845b1e1b9f762e7ed52142659b9017347dc891870658f63382b17aa6ba6b9dfd8dd8c59fa6dc4ef067168f779034911fa22d3e8297650928') # Your secret API key
.set_self_signed() # Use only on dev mode with a self-signed SSL cert
)

users = Users(client)
databases = Databases(client) 

Database_ID = "66071664001e1106b8bc"
Hospital_CollectionID = "6608044500387ef00454"
UserInformation_CollectionID= "66079e7c000cd257b449"
Doctor_CollectionID = "660804510032437783a5"

# Create attributes in the hospital collection 
r =databases.create_email_attribute(database_id=Database_ID,collection_id=Hospital_CollectionID,key="Email",required=False)
print(r)