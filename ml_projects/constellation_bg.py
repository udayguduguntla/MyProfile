import base64
import os
import streamlit as st

def inject_constellation_bg():
    """
    Reads constellation.js, base64 encodes it, and injects it along with custom CSS styles
    to achieve an elite dark-gradient glassmorphic look in the Streamlit application.
    Overhauls layout widgets to feel like a premium react dashboard rather than a standard script.
    """
    # Read javascript file
    js_path = os.path.join(os.path.dirname(__file__), "constellation.js")
    if os.path.exists(js_path):
        with open(js_path, "r", encoding="utf-8") as f:
            js_code = f.read()
    else:
        # Fallback empty string if not found
        js_code = ""

    # Base64 encode the javascript to make it safe for embedding in HTML event handler
    b64_js = base64.b64encode(js_code.encode("utf-8")).decode("utf-8")

    # Custom styling to build a premium interface
    custom_style = """
    <style>
    /* Import modern premium font */
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');

    /* Font resets */
    html, body, [data-testid="stAppViewContainer"], .stApp, h1, h2, h3, p, span, label, button, input {
        font-family: 'Outfit', sans-serif !important;
    }
    
    code, pre {
        font-family: 'Space Grotesk', monospace !important;
    }

    /* Base body configurations */
    body {
        background: linear-gradient(135deg, #070B19 0%, #0F172A 100%) !important;
        margin: 0;
        overflow-x: hidden;
    }
    
    .stApp, [data-testid="stAppViewContainer"] {
        background: transparent !important;
    }

    /* Floating header bar with settings menu - transparent for blending */
    header[data-testid="stHeader"] {
        background-color: rgba(7, 11, 25, 0.2) !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
        z-index: 99 !important;
    }
    
    /* Make the settings icon and buttons blend with our neon highlights */
    header[data-testid="stHeader"] button, header[data-testid="stHeader"] svg {
        color: #38BDF8 !important;
        fill: #38BDF8 !important;
    }

    /* Restructure the Streamlit main content container into a gorgeous floating card */
    [data-testid="block-container"] {
        max-width: 850px !important;
        background: rgba(13, 20, 38, 0.45) !important;
        backdrop-filter: blur(24px) !important;
        -webkit-backdrop-filter: blur(24px) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 28px !important;
        padding: 3.5rem 3rem !important;
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7) !important;
        margin-top: 3.5rem !important;
        margin-bottom: 3.5rem !important;
        transition: border-color 0.5s ease;
    }

    [data-testid="block-container"]:hover {
        border-color: rgba(56, 189, 248, 0.25) !important;
    }

    /* Modern Title with cyber gradient & drop glow */
    h1 {
        font-family: 'Space Grotesk', sans-serif !important;
        background: linear-gradient(90deg, #38BDF8 0%, #A855F7 50%, #EC4899 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700 !important;
        letter-spacing: -1px !important;
        font-size: 2.75rem !important;
        text-align: center !important;
        margin-bottom: 0.5rem !important;
        filter: drop-shadow(0 2px 10px rgba(56, 189, 248, 0.15)) !important;
    }

    /* Subtitle styling */
    .stMarkdown p {
        color: #94A3B8 !important;
        text-align: center !important;
        font-size: 1.1rem !important;
        font-weight: 300 !important;
        margin-bottom: 2rem !important;
    }

    /* Hide only the bottom developer attribution footer */
    footer {
        visibility: hidden !important;
        display: none !important;
    }

    /* Style columns into clean cards */
    [data-testid="column"] {
        background-color: rgba(15, 23, 42, 0.3) !important;
        border: 1px solid rgba(255, 255, 255, 0.04) !important;
        border-radius: 20px !important;
        padding: 1.5rem !important;
        backdrop-filter: blur(10px) !important;
        box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 10px 30px rgba(0, 0, 0, 0.1) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    [data-testid="column"]:hover {
        transform: translateY(-2px);
        border-color: rgba(255, 255, 255, 0.08) !important;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2) !important;
    }
    
    [data-testid="column"] h3 {
        font-family: 'Space Grotesk', sans-serif !important;
        color: #F8FAFC !important;
        font-size: 1.2rem !important;
        font-weight: 600 !important;
        letter-spacing: 0.5px;
        margin-bottom: 1rem !important;
        border-left: 3px solid #38BDF8;
        padding-left: 8px;
    }

    /* Premium upload dropzone styling */
    [data-testid="stFileUploader"] {
        background-color: rgba(15, 23, 42, 0.4) !important;
        border: 2px dashed rgba(56, 189, 248, 0.3) !important;
        border-radius: 20px !important;
        padding: 2rem !important;
        backdrop-filter: blur(12px) !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    }

    [data-testid="stFileUploader"]:hover {
        border-color: rgba(168, 85, 247, 0.7) !important;
        box-shadow: 0 0 25px rgba(168, 85, 247, 0.15) !important;
        transform: scale(1.01);
    }

    /* Customize Streamlit uploader elements */
    [data-testid="stFileUploader"] svg {
        fill: #38BDF8 !important;
        transform: scale(1.2);
        transition: transform 0.3s ease;
    }
    [data-testid="stFileUploader"]:hover svg {
        transform: scale(1.3) translateY(-2px);
    }
    
    [data-testid="stFileUploader"] section {
        background: transparent !important;
        border: none !important;
    }
    
    [data-testid="stFileUploader"] button {
        background: linear-gradient(135deg, #38BDF8 0%, #3B82F6 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
        padding: 0.5rem 1.5rem !important;
        box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3) !important;
        transition: all 0.2s ease !important;
    }
    [data-testid="stFileUploader"] button:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(56, 189, 248, 0.5) !important;
    }

    /* Style standard images cleanly */
    [data-testid="stImage"] {
        border-radius: 14px !important;
        overflow: hidden !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3) !important;
    }

    /* Clean divider line */
    hr {
        border: 0 !important;
        height: 1px !important;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent) !important;
        margin: 2.5rem 0 !important;
    }

    /* Hide default Streamlit alerts, since we'll use bespoke glass cards */
    div[data-testid="stNotification"] {
        background-color: rgba(15, 23, 42, 0.65) !important;
        border: 1px solid rgba(56, 189, 248, 0.25) !important;
        border-radius: 16px !important;
        backdrop-filter: blur(10px) !important;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2) !important;
    }

    /* =========================================================================
       CUSTOM HTML APP COMPONENTS (Glassmorphism & Neon Dashboard Accents)
       ========================================================================= */

    /* Diagnosis Wrapper Card */
    .diagnosis-card {
        background: rgba(15, 23, 42, 0.45);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 20px;
        padding: 1.75rem;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        margin-bottom: 1.5rem;
        position: relative;
        overflow: hidden;
    }
    
    .diagnosis-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
    }
    
    .diagnosis-card.status-healthy::before {
        background: linear-gradient(90deg, #10B981, #059669);
    }
    .diagnosis-card.status-diseased::before {
        background: linear-gradient(90deg, #EF4444, #B91C1C);
    }
    .diagnosis-card.status-deficient::before {
        background: linear-gradient(90deg, #F59E0B, #D97706);
    }
    
    .diagnosis-header {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 1.5px;
        color: #64748B;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
    }
    
    .diagnosis-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.85rem;
        font-weight: 700;
        color: #F8FAFC;
        margin-bottom: 1rem;
        line-height: 1.2;
    }
    
    .diagnosis-row {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        flex-wrap: wrap;
    }
    
    .diagnosis-badge {
        padding: 0.4rem 1rem;
        border-radius: 30px;
        font-size: 0.85rem;
        font-weight: 600;
        letter-spacing: 0.5px;
    }
    
    .status-healthy-badge {
        background: rgba(16, 185, 129, 0.15);
        color: #34D399;
        border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .status-diseased-badge {
        background: rgba(239, 68, 68, 0.15);
        color: #F87171;
        border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .status-deficient-badge {
        background: rgba(245, 158, 11, 0.15);
        color: #FBBF24;
        border: 1px solid rgba(245, 158, 11, 0.3);
    }
    
    .diagnosis-confidence {
        font-size: 0.95rem;
        color: #94A3B8;
    }
    .diagnosis-confidence strong {
        color: #F8FAFC;
        font-size: 1.1rem;
    }

    /* Tissue Composition Card */
    .tissue-card {
        background: rgba(15, 23, 42, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        padding: 1.75rem;
        margin-bottom: 1.5rem;
    }
    
    .card-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.2rem;
        font-weight: 600;
        color: #F8FAFC;
        margin-bottom: 1.25rem;
        letter-spacing: 0.25px;
    }
    
    /* Segmented Analytics progress bar */
    .composition-bar {
        height: 18px;
        border-radius: 30px;
        overflow: hidden;
        display: flex;
        background: rgba(255, 255, 255, 0.04);
        margin-bottom: 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .bar-segment {
        height: 100%;
        transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .green-seg { background: linear-gradient(90deg, #10B981, #059669); }
    .yellow-seg { background: linear-gradient(90deg, #FBBF24, #D97706); }
    .brown-seg { background: linear-gradient(90deg, #EF4444, #DC2626); }
    .white-seg { background: linear-gradient(90deg, #C084FC, #A855F7); }
    
    /* Legend Grid */
    .legend-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 1rem;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        font-size: 0.9rem;
        color: #94A3B8;
    }
    
    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin-right: 8px;
        display: inline-block;
    }
    
    .green-dot { background-color: #10B981; box-shadow: 0 0 6px rgba(16, 185, 129, 0.4); }
    .yellow-dot { background-color: #FBBF24; box-shadow: 0 0 6px rgba(251, 191, 36, 0.4); }
    .brown-dot { background-color: #EF4444; box-shadow: 0 0 6px rgba(239, 68, 68, 0.4); }
    .white-dot { background-color: #C084FC; box-shadow: 0 0 6px rgba(192, 132, 252, 0.4); }

    /* Fertilizer Recommendation Card */
    .nutrient-card {
        background: rgba(15, 23, 42, 0.45);
        border: 1px solid rgba(56, 189, 248, 0.2);
        border-radius: 20px;
        padding: 2rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
    }
    
    .nutrient-badge-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .nutrient-badge {
        font-family: 'Space Grotesk', sans-serif;
        background: linear-gradient(135deg, #38BDF8 0%, #3B82F6 100%);
        color: white;
        padding: 0.4rem 1rem;
        border-radius: 8px;
        font-weight: 700;
        font-size: 0.9rem;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3);
    }
    
    .nutrient-card-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: #F8FAFC;
        margin-bottom: 1.5rem;
    }
    
    .nutrient-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
        margin-bottom: 1.5rem;
    }
    
    @media (max-width: 600px) {
        .nutrient-grid {
            grid-template-columns: 1fr;
        }
    }
    
    .nutrient-box {
        background: rgba(15, 23, 42, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 14px;
        padding: 1.25rem;
        transition: transform 0.2s ease;
    }
    
    .nutrient-box:hover {
        transform: translateY(-2px);
        border-color: rgba(56, 189, 248, 0.2);
    }
    
    .box-header-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 0.5rem;
    }
    
    .box-icon {
        font-size: 1.25rem;
    }
    
    .box-title {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600;
        color: #F1F5F9;
        font-size: 1.05rem;
    }
    
    .box-desc {
        font-size: 0.9rem;
        color: #94A3B8;
        line-height: 1.5;
    }
    
    .nutrient-details {
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        padding-top: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .nutrient-details p {
        color: #94A3B8 !important;
        font-size: 0.95rem !important;
        line-height: 1.5 !important;
        text-align: left !important;
        margin-bottom: 0 !important;
    }
    
    .nutrient-details p strong {
        color: #E2E8F0;
    }

    /* Pathogen / Fungicide Card */
    .treatment-card {
        background: rgba(15, 23, 42, 0.4);
        border: 1px solid rgba(239, 68, 68, 0.2);
        border-radius: 20px;
        padding: 2rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    }
    
    .treatment-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.4rem;
        font-weight: 700;
        color: #F8FAFC;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .treatment-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
        margin-bottom: 1.5rem;
    }
    
    @media (max-width: 600px) {
        .treatment-grid {
            grid-template-columns: 1fr;
        }
    }
    
    .treatment-box {
        background: rgba(15, 23, 42, 0.45);
        border: 1px solid rgba(255, 255, 255, 0.04);
        border-radius: 14px;
        padding: 1.25rem;
        transition: transform 0.2s ease;
    }
    
    .treatment-box:hover {
        transform: translateY(-2px);
        border-color: rgba(239, 68, 68, 0.2);
    }
    
    .treatment-box-title {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 600;
        color: #F1F5F9;
        font-size: 1.05rem;
        margin-bottom: 0.5rem;
    }
    
    .treatment-box-desc {
        font-size: 0.9rem;
        color: #94A3B8;
        line-height: 1.5;
    }
    
    .cultural-details {
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        padding-top: 1.25rem;
        font-size: 0.95rem;
        color: #94A3B8;
        line-height: 1.5;
    }
    
    .cultural-details strong {
        color: #E2E8F0;
    }

    /* Welcome/Tip Cards on home page */
    .instruction-card {
        background: rgba(15, 23, 42, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.04);
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    .instruction-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.15rem;
        font-weight: 600;
        color: #F8FAFC;
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .instruction-list {
        margin: 0;
        padding-left: 1.2rem;
        color: #94A3B8;
        font-size: 0.95rem;
        line-height: 1.6;
    }
    
    .instruction-list li {
        margin-bottom: 0.5rem;
    }
    
    .grid-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }
    
    @media (max-width: 600px) {
        .grid-container {
            grid-template-columns: 1fr;
        }
    }
    
    .support-card {
        background: rgba(15, 23, 42, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.03);
        border-radius: 16px;
        padding: 1.25rem;
        transition: transform 0.2s ease;
    }
    .support-card:hover {
        transform: translateY(-2px);
        border-color: rgba(255, 255, 255, 0.06);
    }
    
    .support-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 1.05rem;
        font-weight: 600;
        color: #F1F5F9;
        margin-bottom: 0.5rem;
    }
    
    .support-desc {
        font-size: 0.88rem;
        color: #94A3B8;
        line-height: 1.5;
    }
    </style>
    """

    # Combined injection: Custom CSS styling + safe 1px tracking image to trigger our onload script loader in parent window.
    st.markdown(custom_style, unsafe_allow_html=True)
    
    script_injection = f"""
    <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
         onload="
            if (!window.constellationScriptLoaded) {{
                window.constellationScriptLoaded = true;
                const script = document.createElement('script');
                script.textContent = atob('{b64_js}');
                document.body.appendChild(script);
            }}
         " style="display:none; width:0; height:0;">
    """
    st.markdown(script_injection, unsafe_allow_html=True)
