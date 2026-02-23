# 🚀 Leet'O Tracker

Leet'O Tracker is an automated LeetCode performance analytics system built using **n8n**, **PostgreSQL**, currently a basic **html page** and an **AI-powered reporting engine**.

It collects user problem data, stores historical performance reports, compares progress over time, and generates structured recent activity review emails automatically.

---

## 📌 What It Does

- Registers users via a web interface  
- Tracks problem-solving metrics  
- Stores historical performance data  
- Compares current vs previous reports  
- Detects improvement, regression, or no change  
- Generates AI-based recent performance reviews  
- Sends automated email reports  

---

## 🏗 System Architecture
Frontend (HTML Registration)
↓
n8n Webhook Automation
↓
PostgreSQL (users + user_reports)
↓
Report Comparison Engine(not stable and live yet)
↓
AI Performance Review (LLM)
↓
Email Delivery

---

## 🛠 Tech Stack

- **Automation:** n8n  
- **Database:** PostgreSQL  
- **AI Model:** Groq LLM (via n8n LLM Chain)  
- **Frontend:** HTML/CSS/JS 
- **Workflow Orchestration:** Node-based automation  

---

## 🗄 Database Design

### users
- id (Primary Key)
- username
- email
- created_at

### user_reports
- id (Primary Key)
- user_id (Foreign Key)
- report_date
- raw_report (JSONB)
- created_at

---

## 🧠 Core Logic

- Calculates:
  - Total Solved
  - Attempts
  - Acceptance Rate
  - Difficulty & Topic breakdown
- Compares against previous report
- Detects:
  - Improvement
  - Regression
  - No Change
  - First Report
- Stores every report for historical tracking

---

## 📂 Project Structure
leet-o-tracker/
│
├── leetotracker_Online.html # User registration page
├── LeetoWorkflow.json # n8n workflow export
├── userDataBase.json # DB reference
├── FinalFlowChart.excalidraw # System diagram
├── workflow-images/ # Workflow screenshots
├── output-images/ # Sample outputs
└── README.md
---

## 🚀 Running Locally

1. Start PostgreSQL
2. Import database schema
3. Run n8n
4. Import `LeetoWorkflow.json`
5. Configure:
   - PostgreSQL credentials
   - SMTP email credentials
   - Groq API key
6. Execute workflow

---

## 🎯 Purpose

Built as a workflow-driven analytics system demonstrating:

- Automation design
- Database persistence
- Multi-user processing
- Report comparison logic
- AI integration into backend systems

---

## 👨‍💻 Authors

Samrat Chauhan - GitHub(samrat-chauhan24),
Ronak Malik - GitHub(Ronak-Malik)