import pytesseract
from pdf2image import convert_from_path
import cv2
import numpy as np
import os.path


# Path to the Tesseract executable (you might need to adjust this based on your installation)
pytesseract.pytesseract.tesseract_cmd = r'/opt/homebrew/bin/tesseract'



def ocr(text):
    # Perform OCR on the text
    return pytesseract.image_to_string(text)

def ocr_pdf(filename):
    pages = convert_from_path(filename)
    extracted_text = []
    for page in pages:
    # Step 2: Preprocess the image (deskew)
        preprocessed_image = deskew(np.array(page))

    # Step 3: Extract text using OCR
        text = ocr(preprocessed_image)
        extracted_text.append(text)

    content = ''
    for page in extracted_text:
        content = content + page +' '
    return content




def deskew(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.bitwise_not(gray)
    coords = np.column_stack(np.where(gray > 0))
    angle = cv2.minAreaRect(coords)[-1]
    
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle

    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

    return rotated



def performOCR(filename):
    extension = os.path.splitext(filename)[1]

    if extension == '.pdf':
        return ocr_pdf(filename)
    
    else:
        return ocr(filename)


# filename = 'sample.png'

# print(performOCR(filename))