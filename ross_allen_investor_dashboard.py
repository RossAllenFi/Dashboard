
import streamlit as st
import pandas as pd
import datetime

# Set page config with Ross Allen branding
st.set_page_config(page_title="Ross Allen Investor Dashboard", page_icon="💼", layout="wide")

# Custom CSS for styling
st.markdown("""
<style>
    .main {
        background-color: #f5f8fb;
    }
    .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
    h1 {
        color: #2A416D;
    }
    .stMetric {
        background-color: #e2e8f0;
        border-radius: 8px;
        padding: 0.75rem;
    }
</style>
""", unsafe_allow_html=True)

# Ross Allen Logo (user can add later as image file)
st.title("Ross Allen Financial LLC | Investor Dashboard")

# Load and display June 2025 summary metrics (from Connects report)
st.header("📊 June 2025 Portfolio Summary")

col1, col2, col3, col4 = st.columns(4)
col1.metric("Loans Originated", "1,590")
col2.metric("New Business Volume", "$6.42M")
col3.metric("Ending Balance", "$8.57M")
col4.metric("Reserve Contribution", "$620K")

st.markdown("---")

# Revenue Breakdown
st.subheader("💰 Monthly Revenue Breakdown")
col5, col6, col7 = st.columns(3)
col5.metric("Connects Fee", "$214,500")
col6.metric("Program Manager Fee", "-$36,205")
col7.metric("Interest Income", "$26,560")

# Reserve Coverage
st.subheader("🛡️ Reserve vs Risk Overview")
col8, col9 = st.columns(2)
col8.metric("Reserve % of New Business", "9.7%")
col9.metric("Total Reserve Balance", "$620K")

st.markdown("---")

# Participation Summary
st.subheader("🔁 Loan Participation / Sale")
st.write("June participation to TVACU: **$6.66M** at **98.75%** of principal on 6/30/2025.")
st.write("Remaining balance after participation: **$2.58M**")

# Footer
st.markdown("----")
st.caption("Ross Allen Financial LLC • Investor Access Portal • July 2025")
