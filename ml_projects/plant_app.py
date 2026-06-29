import streamlit as st
import cv2
import numpy as np
from PIL import Image

# Import custom modules
from constellation_bg import inject_constellation_bg
from plant_analyzer import analyze_leaf_health

# --- Streamlit Configurations ---
st.set_page_config(
    page_title="Plant Doctor & Fertilizer Advisor",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# Inject Constellation Effect Canvas background and glassmorphism styling
inject_constellation_bg()

# --- Page Header ---
st.title("🌱 Plant Doctor & Fertilizer Advisor")
st.markdown("Diagnose plant foliage issues immediately and receive expert organic & chemical fertilizer plans.")

# File Uploader
uploaded_file = st.file_uploader(
    "Upload a close-up picture of a plant leaf...",
    type=["jpg", "jpeg", "png", "bmp", "webp"]
)

if uploaded_file is not None:
    # Read file to OpenCV format
    file_bytes = np.asarray(bytearray(uploaded_file.read()), dtype=np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    
    # Process image
    with st.spinner("Analyzing foliar pixels and running color segmentation..."):
        analysis_result = analyze_leaf_health(image)
        
    if analysis_result["status"] == "error":
        st.error(analysis_result["message"])
    else:
        # Columns for visual layout
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### Original Leaf")
            st.image(cv2.cvtColor(image, cv2.COLOR_BGR2RGB), use_container_width=True)
            
        with col2:
            st.markdown("### Tissue Analysis")
            st.image(cv2.cvtColor(analysis_result["annotated_image"], cv2.COLOR_BGR2RGB), use_container_width=True)
            
        st.markdown("<hr>", unsafe_allow_html=True)
        
        # --- Diagnostic Stats Card (Custom HTML Injection) ---
        status_labels = {
            "healthy": "Healthy Foliage",
            "diseased": "Pathogen Infection",
            "nutrient_deficient": "Nutrient Deficit"
        }
        status_label = status_labels.get(analysis_result["status_type"], "Complete")
        
        diagnosis_html = f"""
        <div class="diagnosis-card status-{analysis_result['status_type']}">
            <div class="diagnosis-header">DIAGNOSIS REPORT</div>
            <div class="diagnosis-title">{analysis_result['diagnosis']}</div>
            <div class="diagnosis-row">
                <div class="diagnosis-badge status-{analysis_result['status_type']}-badge">{status_label}</div>
                <div class="diagnosis-confidence">Detection Confidence: <strong>{analysis_result['confidence']}%</strong></div>
            </div>
        </div>
        """
        st.markdown(diagnosis_html, unsafe_allow_html=True)
        
        # --- Leaf Tissue Details (Custom Analytics Progress Bar HTML) ---
        pcts = analysis_result["percentages"]
        tissue_html = f"""
        <div class="tissue-card">
            <div class="card-title">Leaf Tissue Surface Analysis</div>
            <div class="composition-bar">
                <div class="bar-segment green-seg" style="width: {pcts['healthy_green']}%" title="Healthy green: {pcts['healthy_green']}%"></div>
                <div class="bar-segment yellow-seg" style="width: {pcts['chlorosis_yellow']}%" title="Chlorosis yellow: {pcts['chlorosis_yellow']}%"></div>
                <div class="bar-segment brown-seg" style="width: {pcts['necrosis_brown']}%" title="Necrosis brown: {pcts['necrosis_brown']}%"></div>
                <div class="bar-segment white-seg" style="width: {pcts['mildew_white']}%" title="Mildew white: {pcts['mildew_white']}%"></div>
            </div>
            <div class="legend-grid">
                <div class="legend-item"><span class="dot green-dot"></span> Healthy Green ({pcts['healthy_green']}%)</div>
                <div class="legend-item"><span class="dot yellow-dot"></span> Chlorosis/Yellowing ({pcts['chlorosis_yellow']}%)</div>
                <div class="legend-item"><span class="dot brown-dot"></span> Necrosis/Spots ({pcts['necrosis_brown']}%)</div>
                <div class="legend-item"><span class="dot white-dot"></span> Powdery Mildew ({pcts['mildew_white']}%)</div>
            </div>
        </div>
        """
        st.markdown(tissue_html, unsafe_allow_html=True)
        
        st.markdown("<hr>", unsafe_allow_html=True)
        
        # --- Fertilizer Recommendation Card (Custom Grid Layout HTML) ---
        rec = analysis_result["fertilizer_recommendation"]
        fertilizer_html = f"""
        <div class="nutrient-card">
            <div class="nutrient-badge-wrapper">
                <div class="nutrient-badge">NPK Ratio: {rec['npk']}</div>
            </div>
            <div class="nutrient-card-title">{rec['title']}</div>
            <div class="nutrient-grid">
                <div class="nutrient-box">
                    <div class="box-header-row">
                        <span class="box-icon">🌿</span>
                        <span class="box-title">Organic Feed Options</span>
                    </div>
                    <div class="box-desc">{rec['organic']}</div>
                </div>
                <div class="nutrient-box">
                    <div class="box-header-row">
                        <span class="box-icon">🧪</span>
                        <span class="box-title">Chemical Feed Options</span>
                    </div>
                    <div class="box-desc">{rec['chemical']}</div>
                </div>
            </div>
            <div class="nutrient-details">
                <p><strong>📅 Suggested Application Cycle:</strong> {rec['schedule']}</p>
                <p><strong>💡 Dynamic Advisory Note:</strong> {rec['tips']}</p>
            </div>
        </div>
        """
        st.markdown(fertilizer_html, unsafe_allow_html=True)
        
        # --- Treatment Plan Card (only if diseased/deficient) ---
        if analysis_result["treatment_plan"] is not None:
            treat = analysis_result["treatment_plan"]
            treatment_html = f"""
            <div class="treatment-card">
                <div class="treatment-title">🛡️ Pathogen Remediation Protocol</div>
                <div class="treatment-grid">
                    <div class="treatment-box">
                        <div class="treatment-box-title">🧴 Organic Fungicide Controls</div>
                        <div class="treatment-box-desc">{treat['organic_cure']}</div>
                    </div>
                    <div class="treatment-box">
                        <div class="treatment-box-title">🔬 Chemical Synthetic Controls</div>
                        <div class="treatment-box-desc">{treat['chemical_cure']}</div>
                    </div>
                </div>
                <div class="cultural-details">
                    <strong>💧 Cultural Adjustments (Hydration & Airflow):</strong> {treat['cultural']}
                </div>
            </div>
            """
            st.markdown(treatment_html, unsafe_allow_html=True)

else:
    # --- Custom Home Welcome Layout (HTML Injection) ---
    welcome_html = """
    <div class="instruction-card">
        <div class="instruction-title">📋 Leaf Diagnosis Protocol</div>
        <ul class="instruction-list">
            <li>Place a single leaf flat on a clean, solid, neutral surface (white or dark surfaces are ideal).</li>
            <li>Ensure the image has direct, even lighting. Avoid intense glare or extreme angles.</li>
            <li>Align the camera parallel to the leaf face to fill at least 50% of the viewport.</li>
        </ul>
    </div>
    
    <div class="card-title" style="margin-top: 2.5rem; text-align: left;">Supported Diagnostics & Treatment Library</div>
    <div class="grid-container">
        <div class="support-card">
            <div class="support-title">🍂 Leaf Spot & Blight</div>
            <div class="support-desc">Fungal/bacterial infections manifesting as brown necrosis spots. Solved with low nitrogen, high potassium feeding to fortify tissue cell walls.</div>
        </div>
        <div class="support-card">
            <div class="support-title">🌾 Iron & Nitrogen Chlorosis</div>
            <div class="support-desc">Chlorophyll block causing pale yellow pigmentation. Addressed via foliar chelated sprays and high nitrogen organic emulsions.</div>
        </div>
        <div class="support-card">
            <div class="support-title">❄️ Powdery Mildew</div>
            <div class="support-desc">White fungal dusting covering the leaf blades. Managed using potassium bicarbonate compounds while checking nitrogen levels.</div>
        </div>
        <div class="support-card">
            <div class="support-title">🥬 Healthy Leaf Monitoring</div>
            <div class="support-desc">Standard baseline analysis for pristine plants. Provides standard balanced nutrient schedules for robust maintenance.</div>
        </div>
    </div>
    """
    st.markdown(welcome_html, unsafe_allow_html=True)

st.markdown("<hr>", unsafe_allow_html=True)
st.caption("Powered by HSV Color Range Segmentation Engine • Responsive HTML5 Canvas Background • AntiGravity CLI Core")
