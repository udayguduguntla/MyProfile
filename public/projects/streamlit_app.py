import streamlit as st
import cv2
import numpy as np
import pytesseract
import re
import tempfile
import os
from PIL import Image


def preprocess_image(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    bfilter = cv2.bilateralFilter(gray, 11, 17, 17)
    edged = cv2.Canny(bfilter, 30, 200)
    return edged


def find_plate_contour(edged):
    contours, _ = cv2.findContours(edged, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:10]
    for contour in contours:
        perimeter = cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, 0.02 * perimeter, True)
        if len(approx) == 4:
            return approx
    return None


def extract_plate(img, plate_contour):
    x, y, w, h = cv2.boundingRect(plate_contour)
    plate = img[y:y + h, x:x + w]
    return plate, x, y, w, h


def clean_plate_text(text):
    return re.sub(r'[^A-Za-z0-9]', '', text)


def read_license_plate(img):
    original = img.copy()
    edged = preprocess_image(img)
    plate_contour = find_plate_contour(edged)

    if plate_contour is None:
        return None, None, None

    plate_img, x, y, w, h = extract_plate(img, plate_contour)
    gray_plate = cv2.cvtColor(plate_img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray_plate, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    custom_config = r'--oem 3 --psm 8 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    raw_text = pytesseract.image_to_string(thresh, config=custom_config)
    plate_text = clean_plate_text(raw_text)

    cv2.rectangle(original, (x, y), (x + w, y + h), (0, 255, 0), 3)
    cv2.putText(original, plate_text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    return plate_text, original, plate_img


st.set_page_config(page_title="License Plate Reader", layout="centered")

st.title("🚗 License Plate Reader")
st.markdown("Upload an image of a vehicle to detect and read its license plate.")

uploaded = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png", "bmp", "webp"])

if uploaded:
    file_bytes = np.asarray(bytearray(uploaded.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    col1, col2 = st.columns(2)
    with col1:
        st.image(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), caption="Original Image", use_container_width=True)

    with st.spinner("Detecting license plate..."):
        plate_text, annotated, plate_crop = read_license_plate(img)

    with col2:
        if annotated is not None:
            st.image(cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB), caption="Detected Plate", use_container_width=True)
        else:
            st.image(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), caption="No plate detected", use_container_width=True)

    if plate_text:
        st.success(f"**License Plate:** `{plate_text}`")
        if plate_crop is not None:
            st.image(cv2.cvtColor(plate_crop, cv2.COLOR_BGR2RGB), caption="Cropped Plate", width=300)
    else:
        st.error("Could not detect a license plate. Try a different image.")

st.markdown("---")
st.caption("Built with OpenCV + Tesseract OCR")
