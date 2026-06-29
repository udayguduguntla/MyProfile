import cv2
import numpy as np

def analyze_leaf_health(img):
    """
    Analyzes a plant leaf image using HSV segmentation.
    Returns:
        dict: A dictionary containing diagnosis, percentages of healthy vs diseased regions,
              annotated image, crop overlay, and specific fertilizer recommendations.
    """
    # Resize image for standard and fast pixel area calculations
    img_resized = cv2.resize(img, (600, 600))
    hsv = cv2.cvtColor(img_resized, cv2.COLOR_BGR2HSV)
    
    # 1. Segment Colors in HSV space
    # Green (Healthy foliage)
    lower_green = np.array([35, 25, 25])
    upper_green = np.array([85, 255, 255])
    mask_green = cv2.inRange(hsv, lower_green, upper_green)
    
    # Yellow/Pale (Chlorosis, nutrient deficiency, mosaic)
    lower_yellow = np.array([18, 30, 40])
    upper_yellow = np.array([34, 255, 255])
    mask_yellow = cv2.inRange(hsv, lower_yellow, upper_yellow)
    
    # Brown/Dark Spots (Blight, necrosis, fungal spots)
    lower_brown1 = np.array([0, 25, 20])
    upper_brown1 = np.array([17, 255, 160])
    mask_brown1 = cv2.inRange(hsv, lower_brown1, upper_brown1)
    
    lower_brown2 = np.array([170, 25, 20])
    upper_brown2 = np.array([180, 255, 160])
    mask_brown2 = cv2.inRange(hsv, lower_brown2, upper_brown2)
    mask_brown = cv2.bitwise_or(mask_brown1, mask_brown2)
    
    # White/Light Gray (Powdery Mildew / Mold)
    lower_white = np.array([0, 0, 160])
    upper_white = np.array([180, 30, 255])
    mask_white = cv2.inRange(hsv, lower_white, upper_white)
    
    # 2. Area Calculations
    total_pixels = 600 * 600
    green_area = np.sum(mask_green > 0)
    yellow_area = np.sum(mask_yellow > 0)
    brown_area = np.sum(mask_brown > 0)
    white_area = np.sum(mask_white > 0)
    
    leaf_area = green_area + yellow_area + brown_area + white_area
    leaf_percentage = (leaf_area / total_pixels) * 100
    
    # If the user uploads a non-leaf image (very few pixels match leaf colors)
    if leaf_percentage < 5.0:
        return {
            "status": "error",
            "message": "No significant plant foliage detected. Please upload a clear, close-up image of a plant leaf against a neutral background."
        }
        
    # Calculate relative percentages of the leaf area
    green_pct = (green_area / leaf_area) * 100
    yellow_pct = (yellow_area / leaf_area) * 100
    brown_pct = (brown_area / leaf_area) * 100
    white_pct = (white_area / leaf_area) * 100
    
    # 3. Create visual segmentation overlay
    # Create copies for drawing
    overlay = img_resized.copy()
    
    # Apply visual overlays (BGR format):
    # Green - keep original or highlight slightly
    # Yellow (Chlorosis) -> Highlight yellow
    overlay[mask_yellow > 0] = [0, 230, 255] # bright gold
    # Brown (Necrosis/Spots) -> Highlight bright red
    overlay[mask_brown > 0] = [0, 0, 255] # bright red
    # White (Mildew) -> Highlight magenta
    overlay[mask_white > 0] = [255, 0, 255] # magenta
    
    annotated = img_resized.copy()
    cv2.addWeighted(overlay, 0.45, annotated, 0.55, 0, annotated)
    
    # 4. Diagnostics & Recommendations
    diagnosis = "Healthy Leaf"
    confidence = green_pct
    status = "healthy"
    
    fertilizer_rec = {
        "title": "Standard Nutrient Maintenance Plan",
        "npk": "10-10-10 (Balanced)",
        "organic": "Fish emulsion, kelp meal, or well-cured leaf compost.",
        "chemical": "Balanced slow-release synthetic granular fertilizer.",
        "schedule": "Apply once every 4 to 6 weeks during the active spring/summer growing season.",
        "tips": "Maintain standard deep watering schedules. Ensure adequate soil aeration."
    }
    
    treatment_plan = None
    
    # Fungal Leaf Spots/Blight (Brown Necrosis)
    if brown_pct >= 2.0 and brown_pct >= max(yellow_pct * 0.8, white_pct):
        status = "diseased"
        diagnosis = "Fungal Leaf Spot / Early Blight"
        confidence = min(98.0, 60.0 + (brown_pct * 3.5))
        
        fertilizer_rec = {
            "title": "Root Recover & Stress Relief Feed",
            "npk": "5-10-10 (Low Nitrogen, High Phosphorus/Potassium)",
            "organic": "Bone meal (phosphorus source) and greensand (potassium). Avoid fresh manure (high nitrogen).",
            "chemical": "Low-nitrogen starter or recovery fertilizer.",
            "schedule": "Apply immediately after pruning diseased tissues, then repeat in 4 weeks.",
            "tips": "DO NOT over-apply nitrogen. Excessive nitrogen creates lush, soft foliage that fungal spores easily penetrate. High potassium strengthens cell walls."
        }
        
        treatment_plan = {
            "organic_cure": "Liquid copper fungicide spray or 1% Neem Oil solution. Spray thoroughly including undersides of leaves.",
            "chemical_cure": "Chlorothalonil or Mancozeb-based broad-spectrum fungicides.",
            "cultural": "Prune and destroy infected lower leaves. Keep foliage dry: water only at the soil level using drip lines or a watering can."
        }
        
    # Chlorosis (Nutrient Deficiency / Nitrogen-Iron deficit)
    elif yellow_pct >= 6.0 and yellow_pct >= max(brown_pct * 0.8, white_pct):
        status = "nutrient_deficient"
        diagnosis = "Foliar Chlorosis (Nitrogen or Iron Deficiency)"
        confidence = min(98.0, 55.0 + (yellow_pct * 2.8))
        
        fertilizer_rec = {
            "title": "Chlorophyll Restoration & Vigorous Growth Plan",
            "npk": "12-4-8 or 15-5-10 (High Nitrogen & Micronutrients)",
            "organic": "Blood meal, alfalfa meal, or liquid fish emulsion foliar spray.",
            "chemical": "High-nitrogen urea-based liquid fertilizer with chelated trace elements.",
            "schedule": "Apply high-nitrogen root fertilizer. If iron deficiency is suspected, use a Chelated Iron foliar spray immediately.",
            "tips": "Foliar feeding bypasses soil pH locks, showing greening within 48-72 hours. Check soil pH; high pH (>7.2) locks up iron, requiring sulfur amendment."
        }
        
        treatment_plan = {
            "organic_cure": "Apply Epsom Salts (Magnesium Sulfate) - dissolve 1 tbsp in a gallon of water and spray leaves to correct magnesium chlorosis.",
            "chemical_cure": "Chelated Iron foliar spray + soil drench.",
            "cultural": "Improve soil drainage. Overwatering logs root systems, preventing nutrient absorption and causing yellowing."
        }
        
    # Powdery Mildew (White fungal spots)
    elif white_pct >= 2.0 and white_pct >= max(brown_pct, yellow_pct):
        status = "diseased"
        diagnosis = "Powdery Mildew (Fungal Coating)"
        confidence = min(98.0, 60.0 + (white_pct * 4.5))
        
        fertilizer_rec = {
            "title": "Immunity Support & Secondary Nutrient Feed",
            "npk": "10-10-10 (Balanced slow-release)",
            "organic": "Compost tea to introduce beneficial microbes, supplemented with kelp extract to boost plant immunity.",
            "chemical": "Balanced multi-nutrient release fertilizer.",
            "schedule": "Apply standard dose. Avoid heavy nitrogen feeding.",
            "tips": "Powdery mildew feeds on succulent new growth triggered by excessive nitrogen. Keep N levels moderate while treating the fungus."
        }
        
        treatment_plan = {
            "organic_cure": "Potassium bicarbonate spray (3 tbsp per gallon of water) or a diluted milk-water spray (40% milk, 60% water) in direct sunlight.",
            "chemical_cure": "Myclobutanil or sulfur-based contact fungicides.",
            "cultural": "Thin out branches to improve wind airflow and sunlight penetration. Avoid shading, as mildew thrives in dry, shaded environments."
        }

    return {
        "status": "success",
        "diagnosis": diagnosis,
        "status_type": status,
        "confidence": round(confidence, 1),
        "percentages": {
            "healthy_green": round(green_pct, 1),
            "chlorosis_yellow": round(yellow_pct, 1),
            "necrosis_brown": round(brown_pct, 1),
            "mildew_white": round(white_pct, 1)
        },
        "annotated_image": annotated,
        "raw_percentage": round(leaf_percentage, 1),
        "fertilizer_recommendation": fertilizer_rec,
        "treatment_plan": treatment_plan
    }
