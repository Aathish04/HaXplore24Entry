import fsspec
from ipfspy.ipfsspec.asyn import AsyncIPFSFileSystem
from fsspec import register_implementation
import os

magic_numbers = {
    'png': bytes([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    'pdf': bytes([0x25, 0x50, 0x44, 0x46]),
    'wav': bytes([0x52, 0x49, 0x46, 0x46]),
    'jpg': bytes([0xFF, 0xD8, 0xFF, 0xE0]),
    'docx': bytes([0x50, 0x4B, 0x03, 0x04]),  # DOCX file format
    'xlsx': bytes([0x50, 0x4B, 0x03, 0x04]),  # XLSX file format
    'mp3': bytes([0x49, 0x44, 0x33]),         # MP3 audio format
    'mp4': bytes([0x66, 0x74, 0x79, 0x70]),    # MP4 video format
    'avi': bytes([0x52, 0x49, 0x46, 0x46]),    # AVI video format
    'html': bytes([0x3C, 0x21, 0x44, 0x4F])    # HTML file format
}


max_read_size = max(len(m) for m in magic_numbers.values()) 





def putFile(filepath):
    register_implementation(AsyncIPFSFileSystem.protocol, AsyncIPFSFileSystem)
    class fs:
        ipfs = fsspec.filesystem("ipfs")
        file = fsspec.filesystem("file")
    
    # fs.ipfs.change_gateway_type = 'public'
    outputdir = '/Elixir'
    cid = fs.ipfs.put(path=filepath, rpath=outputdir)
    fs.ipfs.close()
    return cid


def getFile(cid):
    register_implementation(AsyncIPFSFileSystem.protocol, AsyncIPFSFileSystem)
    class fs:
        ipfs = fsspec.filesystem("ipfs")
        file = fsspec.filesystem("file")
    # fs.ipfs.change_gateway_type = 'public'
    content = fs.ipfs.cat(cid)
    print(content)
    fs.ipfs.close()

    file_head = content[:max_read_size]

    
   
    for file_type, magic_number in magic_numbers.items():
        if file_head.startswith(magic_number):
            # print(f"It's a {file_type.upper()} File")
            file_path = os.path.join('data', 'file.'+file_type)
            break

    # Write the binary content to the file
    with open(file_path, 'wb') as file:
        file.write(content)
    return content

c= putFile('sample.jpg')
print(c)
print('Done!')


