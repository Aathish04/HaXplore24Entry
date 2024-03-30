import fsspec
from ipfspy.ipfsspec.asyn import AsyncIPFSFileSystem
from fsspec import register_implementation
import os

def putFile(filepath):
    register_implementation(AsyncIPFSFileSystem.protocol, AsyncIPFSFileSystem)
    class fs:
        ipfs = fsspec.filesystem("ipfs")
        file = fsspec.filesystem("file")
    
    outputdir = '/Elixir'
    cid = fs.ipfs.put(path=filepath, rpath=outputdir)
    fs.ipfs.close()
    return cid


def getFile(cid):
    register_implementation(AsyncIPFSFileSystem.protocol, AsyncIPFSFileSystem)
    class fs:
        ipfs = fsspec.filesystem("ipfs")
        file = fsspec.filesystem("file")

    content = fs.ipfs.cat(cid)
    print(content)
    fs.ipfs.close()

    file_path = os.path.join('C:/Users/alamu/Documents/HaXplore24Entry/backend/ipfs/data/', 'file.pdf')

    # Write the binary content to the file
    with open(file_path, 'wb') as file:
        file.write(content)
    return content

c= putFile('C:/Users/alamu/Documents/HaXplore24Entry/backend/ipfs/Jahnavi-Alamelu.pdf')
print(c)
print(getFile(c))


