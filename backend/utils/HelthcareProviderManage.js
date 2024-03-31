
const Database_ID = "66071664001e1106b8bc"
const Hospital_CollectionID = "6608044500387ef00454"
const UserInformation_CollectionID= "66079e7c000cd257b449"
const Doctor_CollectionID = "660804510032437783a5"

function DoctorLogin(Email, Password){
    {async () => { 

        try {
            const response = await account.createEmailPasswordSession(Email, Password);
            console.log("LOGIN SUCCESS!! USER SESSION", response);
            setUserID(response.userId);
            setSession(response.$id);

            const dbResponse = await databases.getDocument(Database_ID, Doctor_CollectionID, response.userId);
            // const dbResponse = await databases.listDocuments(DATABASE_ID,UserInformation_CollectionID)
            console.log("DATABASE SUCCESS!!", JSON.stringify(dbResponse));
            // setDatabaseData(dbResponse);

        } catch (error) {
            console.error('Error during login:', error);
            console.log("Deleting Session");
            await account.deleteSessions();
        }
    }

    
    }
}