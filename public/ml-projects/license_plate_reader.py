import cv2
import numpy as np
import pytesseract
import sys
import os
import re


def preprocess_image(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    bfilter = cv2.bilateralFilter(gray, 11, 17, 17)
    edged = cv2.Canny(bfilter, 30, 200)
    return gray, edged


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
    return plate, (x, y, w, h)


def clean_plate_text(text):
    text = re.sub(r'[^A-Za-z0-9]', '', text)
    return text


def read_license_plate(image_path, display=False):
    if not os.path.exists(image_path):
        print(f"Error: Image not found at {image_path}")
        return None

    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Could not read image from {image_path}")
        return None

    original = img.copy()
    gray, edged = preprocess_image(img)
    plate_contour = find_plate_contour(edged)

    if plate_contour is None:
        print("No license plate contour detected.")
        return None

    plate_img, (x, y, w, h) = extract_plate(img, plate_contour)

    gray_plate = cv2.cvtColor(plate_img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray_plate, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    custom_config = r'--oem 3 --psm 8 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    raw_text = pytesseract.image_to_string(thresh, config=custom_config)
    plate_text = clean_plate_text(raw_text)

    cv2.rectangle(original, (x, y), (x + w, y + h), (0, 255, 0), 3)
    cv2.putText(original, plate_text, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

    output_path = os.path.splitext(image_path)[0] + "_output.jpg"
    cv2.imwrite(output_path, original)
    print(f"Annotated image saved to: {output_path}")

    if display:
        cv2.imshow("License Plate", original)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

    return plate_text


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python license_plate_reader.py <image_path> [--display]")
        sys.exit(1)

    image_path = sys.argv[1]
    show = "--display" in sys.argv

    result = read_license_plate(image_path, display=show)

    if result:
        print(f"\nDetected License Plate: {result}")
    else:
        print("Could not detect license plate.")
