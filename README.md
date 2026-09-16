# 🚀 Leet'O Tracker AI

> **Turn your LeetCode grind into structured growth.**

Leet'O Tracker AI is a full-stack developer productivity platform designed to help programmers understand their LeetCode practice, track their progress, identify patterns in their problem-solving activity, and receive AI-powered guidance for revision and technical interview preparation.

The platform combines a **Next.js web application**, **MongoDB**, **LeetCode GraphQL**, **n8n automation**, **PostgreSQL**, **FastAPI**, **LangGraph**, and **Groq LLMs** into a single workflow.

🌐 **Live Application:** https://leetotracker.vercel.app/

---

# 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Core Features](#-core-features)
- [System Architecture](#-system-architecture)
- [Application Flow](#-application-flow)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Frontend](#-frontend)
- [Authentication](#-authentication)
- [Database Architecture](#-database-architecture)
- [LeetCode Integration](#-leetcode-integration)
- [Dashboard](#-dashboard)
- [Automation Pipeline](#-automation-pipeline)
- [AI Performance Reports](#-ai-performance-reports)
- [AI Mentor — leX](#-ai-mentor--lex)
- [FastAPI Backend](#-fastapi-backend)
- [LangGraph Architecture](#-langgraph-architecture)
- [AI Agents](#-ai-agents)
- [API Reference](#-api-reference)
- [Data Flow](#-data-flow)
- [Analytics](#-analytics)
- [Environment Variables](#-environment-variables)
- [Local Development](#-local-development)
- [n8n Setup](#-n8n-setup)
- [Running the AI Mentor](#-running-the-ai-mentor)
- [Security](#-security)
- [Current Implementation Notes](#-current-implementation-notes)
- [Known Limitations](#-known-limitations)
- [Future Improvements](#-future-improvements)
- [Interview Explanation](#-interview-explanation)
- [Authors](#-authors)
- [License](#-license)

---

# 🧠 Overview

Leet'O Tracker AI automates the feedback loop between **coding practice and improvement**.

Instead of simply counting solved problems, the platform attempts to answer questions such as:

- How many problems have I solved?
- What difficulty level am I practicing?
- How many attempts do I typically need?
- Which problems caused difficulty?
- Which topics am I practicing most?
- What areas should I revise?
- How should I prepare for technical interviews?
- Can my coding history be converted into an actionable study plan?

The platform consists of three major systems:

```text
                    LEET'O TRACKER AI
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
      WEB PLATFORM     AUTOMATION       AI MENTOR
          │                │                │
       Next.js            n8n           FastAPI
          │                │                │
       MongoDB        PostgreSQL       LangGraph
          │                │                │
          ▼                ▼                ▼
     LeetCode API       Groq LLM        Groq LLM
```

---

# 🎯 Problem Statement

Developers often solve LeetCode problems randomly without maintaining a structured feedback loop.

A typical workflow looks like:

```text
Solve Problem
     ↓
Move to Next Problem
     ↓
Repeat
     ↓
No structured analysis
```

This makes it difficult to understand:

- Which topics are actually being practiced
- Which difficulty levels are being attempted
- Where repeated mistakes occur
- Whether solving consistency is improving
- What should be revised next
- How current practice translates into interview preparation

Leet'O Tracker attempts to automate this process.

---

# 💡 Solution

Leet'O Tracker creates an automated pipeline:

```text
LeetCode Activity
       ↓
Data Collection
       ↓
Performance Analysis
       ↓
Topic & Difficulty Analysis
       ↓
AI Evaluation
       ↓
Revision Recommendations
       ↓
Email Report
       ↓
Interactive AI Mentor
```

The goal is to transform raw coding activity into structured feedback.

---

# ✨ Core Features

## 📊 Personal Dashboard

The dashboard provides an overview of:

- Total problems solved
- Easy problems
- Medium problems
- Hard problems
- Global ranking
- Current submission streak
- Recent solved problems
- Difficulty distribution

---

## 🔄 LeetCode Synchronization

Users can synchronize their LeetCode profile with the application.

The application retrieves data from the LeetCode GraphQL API and stores the processed statistics in MongoDB.

The synchronization system includes caching to avoid unnecessarily querying LeetCode when recently fetched statistics are still available.

---

## 📈 Performance Analytics

The automation pipeline analyzes:

- Total attempts
- Accepted submissions
- Wrong answers
- Time Limit Exceeded submissions
- Problem difficulty
- Problem topics
- Acceptance rate
- Problem-solving patterns

---

## 🤖 AI Performance Review

The system sends analyzed performance information to a Groq-hosted LLM.

The AI generates structured feedback containing:

- Performance Summary
- Strong Areas
- Improvement Areas
- To-Do Plan

The generated content is then converted into HTML and included in an email report.

---

## 📧 Automated Email Reports

n8n is used to automate the reporting workflow.

The pipeline can:

1. Retrieve users
2. Process their LeetCode activity
3. Analyze their submissions
4. Enrich problems with topic and difficulty information
5. Generate analytics
6. Send the analytics to an LLM
7. Format the AI response
8. Generate an HTML report
9. Send the report through email

---

## 🧠 leX — AI Mentor

Leet'O Tracker includes an interactive AI mentor called **leX**.

leX can operate in two main modes:

```text
                    leX
                     │
                Supervisor
                 /       \
                /         \
               ▼           ▼
         Interview       Revision
           Agent           Agent
```

### Interview Agent

Designed for:

- Technical DSA questions
- Interview-style questioning
- Answer evaluation
- Optimization hints
- Pattern-focused learning

### Revision Agent

Designed for:

- Revision planning
- Recent-problem analysis
- Topic-focused practice
- Short-term study plans
- DSA improvement guidance

---

# 🏗 System Architecture

The overall architecture is:

```text
                         USER
                           │
                           ▼
                    ┌─────────────┐
                    │   Next.js   │
                    │  Web App    │
                    └──────┬──────┘
                           │
             ┌─────────────┼──────────────┐
             │             │              │
             ▼             ▼              ▼
        Authentication  Dashboard      leX Chat
             │             │              │
             ▼             ▼              ▼
          MongoDB      LeetCode API    FastAPI
                           │              │
                           │              ▼
                           │          LangGraph
                           │              │
                           │       ┌──────┴──────┐
                           │       ▼             ▼
                           │   Interview      Revision
                           │     Agent          Agent
                           │       │             │
                           │       └──────┬──────┘
                           │              ▼
                           │          Groq LLM
                           │
                           ▼
                         n8n
                           │
                           ▼
                      PostgreSQL
                           │
                           ▼
                      Analytics
                           │
                           ▼
                       Groq LLM
                           │
                           ▼
                     Email Report
```

---

# 🔄 Application Flow

## 1. User Registration

```text
User
 │
 ▼
Signup Page
 │
 ▼
POST /api/auth/signup
 │
 ▼
Zod Validation
 │
 ▼
Normalize Email + Username
 │
 ▼
Check Existing User
 │
 ▼
bcrypt Password Hashing
 │
 ▼
MongoDB
 │
 ▼
Account Created
```

The signup endpoint validates the incoming request using Zod, normalizes the email and LeetCode username, hashes the password using bcrypt, and creates the user document.

---

# 🔐 Authentication Flow

Leet'O Tracker uses JWT-based authentication.

```text
Login Form
    │
    ▼
POST /api/auth/login
    │
    ▼
Validate Credentials
    │
    ▼
MongoDB User Lookup
    │
    ▼
bcrypt.compare()
    │
    ▼
Generate JWT
    │
    ▼
HTTP-only Cookie
    │
    ▼
Authenticated Session
```

The authentication token is stored in:

```text
auth_token
```

The cookie is configured as:

- HTTP-only
- Secure in production
- SameSite `lax`
- Seven-day lifetime

---

# 🛡 Route Protection

The application uses `proxy.ts` to protect routes.

Protected routes include:

```text
/dashboard
```

The proxy:

1. Reads the `auth_token` cookie.
2. Verifies the JWT.
3. Determines whether the user is authenticated.
4. Redirects unauthenticated users to `/login`.
5. Redirects authenticated users away from `/login` and `/signup`.

---

# 🗄 Database Architecture

Leet'O Tracker currently uses two database systems for different parts of the application.

```text
             ┌───────────────┐
             │    MongoDB    │
             └───────┬───────┘
                     │
              Web Application
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      Users       Auth Data    LeetCode Stats


             ┌───────────────┐
             │  PostgreSQL   │
             └───────┬───────┘
                     │
                  n8n
                     │
              Report Pipeline
```

---

# 🍃 MongoDB

MongoDB is used by the Next.js application and AI mentor.

The primary user document contains:

```text
User
│
├── _id
├── email
├── password
├── name
├── leetcodeUsername
├── leetcodeStats
│   ├── totalSolved
│   ├── easy
│   ├── medium
│   ├── hard
│   ├── ranking
│   ├── streak
│   ├── lastUpdated
│   └── recentProblems[]
│       ├── title
│       ├── titleSlug
│       ├── difficulty
│       └── solvedAt
├── createdAt
└── updatedAt
```

Mongoose is used as the MongoDB ODM.

---

# 🐘 PostgreSQL

The exported n8n workflow currently contains a PostgreSQL node named:

```text
PickUsers
```

which retrieves users from:

```text
public.users
```

The retrieved users are then processed individually by the workflow.

PostgreSQL is therefore part of the automation/reporting architecture.

---

# 🔗 LeetCode Integration

The project communicates with LeetCode using its GraphQL endpoint:

```text
https://leetcode.com/graphql
```

The Next.js application retrieves profile information, submission statistics, submission calendar data, and recent accepted submissions.

The n8n workflow separately queries recent submissions and individual problem information.

---

# 📡 LeetCode Profile Query

The application retrieves information such as:

```text
matchedUser
│
├── username
├── profile
│   └── ranking
├── submitStats
│   └── acSubmissionNum
└── submissionCalendar
```

It also retrieves:

```text
recentAcSubmissionList
│
├── title
├── titleSlug
└── timestamp
```

---

# 📊 Statistics Generated

The application processes the LeetCode response into:

```text
totalSolved
easy
medium
hard
ranking
streak
recentProblems
lastUpdated
```

These statistics are stored inside the user's MongoDB document.

---

# ⚡ Statistics Caching

The `/api/leetcode/stats` endpoint checks whether stored statistics were updated within the previous hour.

Conceptually:

```text
Request Statistics
       │
       ▼
Is cached data < 1 hour old?
       │
   ┌───┴───┐
   │       │
  YES      NO
   │       │
   ▼       ▼
Return   Query
Cache    LeetCode
           │
           ▼
        MongoDB
```

This reduces unnecessary external API requests.

---

# 🔄 Manual Synchronization

The dashboard provides a:

```text
SYNC LEETCODE
```

button.

The button calls:

```text
POST /api/leetcode/sync
```

The endpoint:

1. Authenticates the user.
2. Retrieves the user's LeetCode username.
3. Queries LeetCode.
4. Calculates statistics.
5. Calculates the current streak.
6. Retrieves recent problems.
7. Stores the updated statistics in MongoDB.

---

# 📊 Dashboard

The dashboard is implemented as a Next.js client component.

It displays:

```text
┌───────────────────────────────────────────┐
│              LEETOTRACKER                 │
├───────────────────────────────────────────┤
│                                           │
│  Current Streak   Global Rank  Total     │
│                                           │
├───────────────────────────────────────────┤
│                                           │
│        Logic / Difficulty Breakdown       │
│                                           │
│        Easy     █████████                 │
│        Medium   ███████                   │
│        Hard     ███                       │
│                                           │
├───────────────────────────────────────────┤
│                                           │
│              Recent Activity              │
│                                           │
└───────────────────────────────────────────┘
```

The UI is built with Tailwind CSS and uses a dark visual style with glass-like cards, gradients, progress indicators, and responsive layouts.

---

# 🤖 AI Mentor — leX

The AI mentor is implemented separately from the Next.js application.

```text
Next.js
   │
   │ POST /chat
   ▼
FastAPI
   │
   ▼
LangGraph
   │
   ▼
MongoDB
   │
   ▼
User LeetCode Statistics
   │
   ▼
Supervisor
   │
   ├──────────────┐
   ▼              ▼
Interview       Revision
Agent            Agent
   │              │
   └──────┬───────┘
          ▼
       Groq LLM
          │
          ▼
       Response
          │
          ▼
        leX UI
```

---

# 🧩 FastAPI Backend

The AI mentor backend is implemented using FastAPI.

Main endpoint:

```text
POST /chat
```

The request accepts:

```json
{
  "query": "Give me a revision plan",
  "history": []
}
```

The request also expects:

```text
X-User-ID
```

The current implementation uses the user's LeetCode username through this header to retrieve their statistics from MongoDB.

---

# 🧠 LangGraph Architecture

The LangGraph workflow contains four main nodes:

```text
search_db
    │
    ▼
supervisor
    │
    ├───────────────┐
    ▼               ▼
interview_agent   revision_agent
    │               │
    └───────┬───────┘
            ▼
           END
```

---

# 🔎 Search Database Node

The first node retrieves the user's information from MongoDB using the LeetCode username.

The retrieved `leetcodeStats` become the context available to the AI agents.

This allows the mentor to produce responses based on the user's actual coding activity.

---

# 🧭 Supervisor Node

The supervisor determines which agent should handle the user's request.

The current implementation uses keyword-based routing.

Examples:

```text
interview
mock
test
question
```

route toward:

```text
Interview Agent
```

while:

```text
revise
revision
plan
roadmap
guide
```

route toward:

```text
Revision Agent
```

If no matching intent is detected, the current implementation defaults to the interview agent.

---

# 👨‍💻 Interview Agent

The Interview Agent receives user history and LeetCode statistics.

It is instructed to:

- Act as a technical DSA mentor
- Ask technical DSA questions
- Focus on Arrays, BST, and DP
- Evaluate answers
- Provide optimization hints
- Focus on logic and problem-solving patterns

The intended interaction is:

```text
User
 │
 ▼
Technical Question
 │
 ▼
User Answer
 │
 ▼
AI Evaluation
 │
 ▼
Score + Feedback + Hint
```

---

# 📚 Revision Agent

The Revision Agent uses the user's recent solved problems as context.

It generates a short revision sprint consisting of:

```text
Day 1 → Concept
Day 2 → Implementation
Day 3 → Optimization
```

The goal is to transform recent coding activity into a focused revision workflow.

---

# 🧠 AI Models

The project currently uses Groq-hosted LLaMA models in two different parts of the system.

## n8n AI Reporting

The n8n workflow uses:

```text
llama-3.3-70b-versatile
```

for automated performance reports.

## FastAPI AI Mentor

The FastAPI AI mentor uses:

```text
llama-3.1-8b-instant
```

for interactive mentor responses.

---

# ⚙️ Automated Reporting Pipeline

The n8n workflow is the automation engine for performance reporting.

The exported workflow contains the following major nodes:

```text
PickUsers
    ↓
EachUser
    ↓
UserEmail
    ↓
ProblemList
    ↓
FormatList
    ↓
TOPIC & DIFFICULTY
    ↓
FORMATING
    ↓
RAW REPORT
    ↓
Basic LLM Chain
    ↓
AI CLEAN
    ↓
FMT REPORT
    ↓
EMAIL
```

---

# 👥 PickUsers

The workflow starts by retrieving users from PostgreSQL.

The users are then passed into the individual processing stage.

---

# 🔁 EachUser

The workflow processes users individually.

This makes it possible to generate an independent performance report for each user.

---

# 📥 ProblemList

The workflow sends a GraphQL request to LeetCode.

It retrieves recent submissions containing:

```text
title
titleSlug
timestamp
statusDisplay
```

---

# 🧮 FormatList

The `FormatList` node groups submissions by problem.

For each problem it calculates:

```text
attempts
wrong
tle
accepted
firstAttempt
lastAttempt
```

The workflow then determines whether a problem was a:

```text
Clean Solve
```

or:

```text
Struggled
```

---

# 🧩 Problem Enrichment

The workflow queries LeetCode for each problem's:

```text
difficulty
topicTags
```

This transforms a problem from:

```text
Two Sum
```

into richer information such as:

```text
Two Sum
│
├── Difficulty
└── Topics
    ├── Array
    └── Hash Table
```

---

# 📊 RAW REPORT

The workflow aggregates the processed data into:

```text
totalSolved
totalAttempts
totalAccepted
acceptanceRate
performanceLevel
difficultyCount
topicCount
```

---

# 📈 Acceptance Rate

The workflow calculates acceptance rate using:

```text
Acceptance Rate =
(Total Accepted / Total Attempts) × 100
```

The current workflow categorizes the result using:

```text
85%+ → Excellent
70%+ → Good
50%+ → Average
Below 50% → Needs Improvement
```

These categories are implemented directly in the exported workflow.

---

# 🤖 AI Report Generation

The analytics are passed to the Groq model.

The AI is instructed to generate four sections:

```text
Performance Summary
Strong Area
Improvement Area
To-Do Plan
```

The workflow also limits the response to a maximum of 250 words and two bullet points per section.

---

# 🧹 AI CLEAN

The AI response is initially formatted as Markdown.

The `AI CLEAN` node converts:

```text
## Heading
• Bullet
```

into HTML elements suitable for email rendering.

---

# 📧 Email Report

The final report is assembled into an HTML email containing:

```text
LEET 'O' TRACK
     │
     ├── Summary
     │
     ├── Problems Solved
     │
     ├── Difficulty Breakdown
     │
     ├── Acceptance Rate
     │
     ├── Topic Breakdown
     │
     ├── AI Review & Revision Plan
     │
     └── Problem Breakdown
```

The report is sent using the SMTP email node in n8n.

---

# 📡 API Reference

## Authentication

### `POST /api/auth/signup`

Creates a new account.

### Request

```json
{
  "email": "user@example.com",
  "password": "password",
  "name": "Developer",
  "leetcodeUsername": "leetcode_user"
}
```

---

### `POST /api/auth/login`

Authenticates an existing user.

### Request

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

A JWT is generated and stored in the `auth_token` HTTP-only cookie.

---

### `POST /api/auth/logout`

Clears the authentication cookie.

---

### `GET /api/auth/me`

Returns information about the authenticated user.

---

# LeetCode APIs

### `GET /api/leetcode/stats`

Retrieves the user's current LeetCode statistics.

The endpoint may return cached data when the stored statistics are less than one hour old.

---

### `POST /api/leetcode/sync`

Forces a synchronization with LeetCode and updates the stored statistics.

---

### `GET /api/check-username-unique`

Checks whether a LeetCode username is already associated with another account.

---

# AI Mentor API

### `POST /chat`

Implemented in the FastAPI service.

### Request

```json
{
  "query": "Give me a revision plan",
  "history": [
    {
      "role": "user",
      "content": "I am weak in dynamic programming."
    }
  ]
}
```

Required header:

```text
X-User-ID: leetcode_username
```

### Response

```json
{
  "response": "..."
}
```

---

# 🔄 Complete Data Flow

The complete platform can be understood as three independent but related flows.

## Flow 1 — Web Application

```text
User
 ↓
Next.js
 ↓
Authentication
 ↓
MongoDB
 ↓
LeetCode GraphQL
 ↓
Processed Statistics
 ↓
Dashboard
```

---

## Flow 2 — Automated Reports

```text
Users
 ↓
n8n
 ↓
LeetCode GraphQL
 ↓
Submission Analysis
 ↓
Difficulty + Topics
 ↓
Analytics
 ↓
Groq
 ↓
HTML Formatting
 ↓
SMTP
 ↓
Email
```

---

## Flow 3 — AI Mentor

```text
User
 ↓
leX Chat UI
 ↓
FastAPI
 ↓
MongoDB
 ↓
User Statistics
 ↓
LangGraph
 ↓
Supervisor
 ↓
Interview / Revision Agent
 ↓
Groq
 ↓
Response
 ↓
leX
```

---

# 📊 Analytics

The project currently works with several performance metrics.

## Total Solved

Number of unique problems represented in the processed data.

---

## Total Attempts

Number of submissions processed for the relevant problems.

---

## Accepted Submissions

Number of submissions with:

```text
statusDisplay = "Accepted"
```

---

## Wrong Answers

Number of submissions with:

```text
statusDisplay = "Wrong Answer"
```

---

## Time Limit Exceeded

Number of submissions with:

```text
statusDisplay = "Time Limit Exceeded"
```

---

## Struggle Score

For problems involving failed attempts, the workflow calculates:

```text
Struggle Score =
Attempts - Accepted
```

---

## Difficulty Distribution

Problems are categorized into:

```text
Easy
Medium
Hard
```

---

## Topic Distribution

The workflow counts how frequently different LeetCode topics appear across the processed problems.

Examples include:

```text
Array
Hash Table
Dynamic Programming
Stack
Tree
Graph
```

---

# 🔐 Security

The project includes several security-related practices.

## Password Hashing

Passwords are hashed using:

```text
bcryptjs
```

Plain-text passwords are not stored in MongoDB.

---

## JWT Authentication

JWTs are signed using a server-side secret.

The token contains:

```text
userId
email
```

---

## HTTP-only Authentication Cookie

The authentication token is stored in an HTTP-only cookie.

This prevents normal client-side JavaScript from directly reading the token.

---

## Input Validation

Zod schemas are used to validate authentication-related input.

The project validates:

```text
Email
Password
LeetCode Username
```

---

# 📁 Project Structure

The current source structure is approximately:

```text
LEET 'O' TRACKER/
│
├── FutureFlowChart.excalidraw
├── LeetoWorkflow.json
├── README.md
├── leetotracker_Online.html
│
├── WEB-APP/
│   │
│   ├── ai-mentor/
│   │   └── main.py
│   │
│   └── webapp/
│       │
│       ├── package.json
│       ├── next.config.ts
│       ├── tsconfig.json
│       ├── eslint.config.mjs
│       ├── postcss.config.mjs
│       │
│       └── src/
│           │
│           ├── app/
│           │   ├── api/
│           │   │   ├── auth/
│           │   │   │   ├── login/
│           │   │   │   ├── logout/
│           │   │   │   ├── me/
│           │   │   │   └── signup/
│           │   │   │
│           │   │   ├── check-username-unique/
│           │   │   │
│           │   │   └── leetcode/
│           │   │       ├── stats/
│           │   │       └── sync/
│           │   │
│           │   ├── dashboard/
│           │   │   └── page.tsx
│           │   │
│           │   ├── login/
│           │   │   ├── page.tsx
│           │   │   └── LoginClient.tsx
│           │   │
│           │   ├── signup/
│           │   │   └── page.tsx
│           │   │
│           │   ├── globals.css
│           │   ├── layout.tsx
│           │   └── page.tsx
│           │
│           ├── components/
│           │   ├── ChatWrapper.tsx
│           │   ├── LeetXChat.tsx
│           │   └── leetcodeRing.tsx
│           │
│           ├── lib/
│           │   ├── dbconnect.ts
│           │   └── jwt.ts
│           │
│           ├── models/
│           │   └── user.model.ts
│           │
│           ├── schemas/
│           │   ├── authSchema.ts
│           │   └── profileSchema.ts
│           │
│           └── proxy.ts
│
└── project_dump.txt
```

---

# 🧰 Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| Next.js | Full-stack React framework |
| React | UI development |
| TypeScript | Static typing |
| Tailwind CSS | Styling |
| Axios | HTTP requests |
| React Markdown | Rendering AI responses |
| Recharts | Data visualization |
| Heroicons | UI icons |

---

## Backend

| Technology | Purpose |
|---|---|
| FastAPI | AI mentor API |
| Python | AI backend |
| LangGraph | Agent orchestration |
| LangChain | LLM integration |
| Groq | LLM inference |
| LLaMA | AI models |

---

## Database

| Technology | Purpose |
|---|---|
| MongoDB | User and current LeetCode data |
| Mongoose | MongoDB ODM |
| PostgreSQL | n8n user/report workflow data |

---

## Automation

| Technology | Purpose |
|---|---|
| n8n | Workflow automation |
| SMTP | Email delivery |

---

## External API

| Service | Purpose |
|---|---|
| LeetCode GraphQL | Problem and user activity data |

---

# ⚙️ Environment Variables

The Next.js application requires environment configuration for services such as:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

The FastAPI AI mentor uses:

```env
MONGO_URI=your_mongodb_connection_string
DB_NAME=your_database_name
GROQ_API_KEY=your_groq_api_key
```

n8n credentials are configured through the n8n credential system for services such as:

```text
PostgreSQL
Groq
SMTP
```

Never commit real credentials or `.env` files to Git.

---

# 💻 Local Development

## 1. Clone the Repository

```bash
git clone <repository-url>
cd "LEET 'O' TRACKER"
```

---

# 2. Start the Next.js Application

```bash
cd WEB-APP/webapp
npm install
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

---

# 3. Start the FastAPI AI Mentor

Navigate to:

```bash
cd WEB-APP/ai-mentor
```

Create and activate a Python environment:

```bash
python -m venv venv
```

macOS/Linux:

```bash
source venv/bin/activate
```

Install the required dependencies for the AI mentor environment.

Then start FastAPI using an ASGI server such as Uvicorn.

The application exposes:

```text
POST /chat
```

on the configured local server.

---

# 4. Start MongoDB

The application requires a MongoDB database configured through:

```env
MONGODB_URI
```

The FastAPI mentor connects using:

```env
MONGO_URI
DB_NAME
```

---

# 5. Start n8n

Run n8n locally and import:

```text
LeetoWorkflow.json
```

Configure the required credentials for:

```text
PostgreSQL
Groq
SMTP
```

---

# 🧪 Useful Commands

From:

```text
WEB-APP/webapp
```

run:

```bash
npm run dev
```

for development.

Build the application:

```bash
npm run build
```

Start the production build:

```bash
npm start
```

Run linting:

```bash
npm run lint
```

---

# 🧭 Current Implementation Notes

This README intentionally describes the code that exists in the current project dump rather than assuming that every planned feature is already implemented.

There are several architectural areas that should be addressed as the project evolves.

---

## 1. Authentication Documentation

The current implementation uses:

```text
JWT
+
HTTP-only Cookie
+
jsonwebtoken
```

The current source code does not implement NextAuth.

---

## 2. n8n Registration Webhook

The signup page currently attempts to send a request to:

```text
http://localhost:5678/webhook/register-user
```

However, the exported `LeetoWorkflow.json` currently begins with a manual execution trigger rather than a `register-user` webhook trigger.

This should be reconciled before relying on the registration-to-n8n flow.

---

## 3. Weekly Report Definition

The current n8n workflow queries recent submissions using:

```text
recentSubmissionList
```

The exported workflow does not currently show explicit seven-day date filtering.

Therefore, the reporting period should be made explicit before describing the generated email as a strictly calculated weekly report.

---

## 4. Recent Problem Difficulty

The current `/api/leetcode/stats` implementation assigns:

```text
difficulty: "Medium"
```

to recent accepted problems because the recent-submission query does not return difficulty.

The source code itself notes that difficulty should be fetched separately.

This should be corrected so dashboard difficulty information is accurate.

---

## 5. Stats and Sync Consistency

The `/stats` and `/sync` endpoints currently construct recent problem information slightly differently.

A shared LeetCode data service would reduce duplication and ensure both endpoints produce the same data structure.

---

## 6. AI Mentor History

The current FastAPI implementation converts non-user history messages into `SystemMessage`.

A future revision should represent conversation history using the appropriate user/assistant message types.

---

## 7. AI Routing

The current supervisor uses keyword-based intent detection.

For example:

```text
"mock interview"
```

can be routed using interview-related keywords.

A future version could use a structured intent classifier or an LLM-based router.

---


# 🔮 Future Improvements

The project can evolve into a more complete developer analytics platform.

## 📊 Advanced Analytics

Possible additions:

```text
Weekly solved count
Monthly solved count
Acceptance trends
Topic mastery
Difficulty progression
Average attempts
Average time to solve
Repeated failure patterns
Consistency score
```

---

## 📚 Intelligent Revision Engine

Instead of only looking at recent problems:

```text
User History
     ↓
Topic Performance
     ↓
Failure Patterns
     ↓
Difficulty
     ↓
Recency
     ↓
Revision Priority
     ↓
Personalized Study Plan
```

---

## 🧠 Improved AI Routing

The supervisor could become:

```text
User Query
    ↓
Intent Classifier
    ↓
┌──────────┬───────────┬──────────────┐
│          │           │              │
▼          ▼           ▼              ▼
Interview  Revision    Analytics    General
Agent      Agent       Agent         Agent
```

---

## 📈 Historical Performance

A dedicated historical data model could allow:

```text
Week 1
   ↓
Week 2
   ↓
Week 3
   ↓
Week 4
```

and enable trend analysis rather than only current-state statistics.

---

## 🔔 Automated Notifications

The platform could eventually support:

- Weekly reports
- Inactivity reminders
- Revision reminders
- Interview preparation reminders
- Streak notifications
- Topic weakness alerts

---

## ☁️ Production Architecture

A more mature deployment could separate services:

```text
                     INTERNET
                         │
                         ▼
                    Next.js App
                         │
             ┌───────────┼───────────┐
             │           │           │
             ▼           ▼           ▼
          MongoDB     FastAPI       n8n
                         │           │
                         ▼           ▼
                     LangGraph   PostgreSQL
                         │
                         ▼
                       Groq
```

---

# 🧠 Project in One Diagram

```text
                          LEET'O TRACKER AI
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
          NEXT.JS                N8N              FASTAPI
          WEB APP             AUTOMATION          AI MENTOR
              │                   │                   │
              ▼                   ▼                   ▼
          JWT AUTH           PostgreSQL          LangGraph
              │                   │                   │
              ▼                   ▼             ┌─────┴─────┐
           MongoDB            LeetCode           │           │
              │               GraphQL            ▼           ▼
              │                   │          Interview    Revision
              ▼                   ▼            Agent        Agent
          Dashboard          Analytics           │           │
              │                   │               └─────┬─────┘
              │                   ▼                     │
              │                Groq                     ▼
              │                   │                   Groq
              │                   ▼                     │
              │             Email Report               │
              │                                         │
              └─────────────────────────────────────────┘
                             
                         Personalized
                           Developer
                           Feedback
```

---

# 👨‍💻 Authors

### Samrat Chauhan

Full-stack development, AI integration, automation, dashboard, authentication, and system architecture.

### Ronak Malik

Project development and collaboration.

---

# 📄 Project Status

Leet'O Tracker AI is an evolving project.

The current implementation contains:

```text
✅ Next.js Web Application
✅ User Registration
✅ User Login
✅ JWT Authentication
✅ HTTP-only Authentication Cookie
✅ MongoDB Integration
✅ LeetCode GraphQL Integration
✅ LeetCode Statistics
✅ Dashboard
✅ LeetCode Synchronization
✅ n8n Automation Workflow
✅ PostgreSQL Workflow Integration
✅ Groq AI Reporting
✅ Automated HTML Email Reports
✅ FastAPI AI Mentor
✅ LangGraph Agent Architecture
✅ Interview Agent
✅ Revision Agent
```

Several areas remain candidates for architectural refinement, including historical analytics, consistent LeetCode problem enrichment, explicit reporting periods, production API configuration, and more sophisticated AI routing.

---

# 🚀 Final Vision

Leet'O Tracker AI is designed around a simple idea:

```text
Don't just solve problems.

Understand how you solve them.
        ↓
Identify your weaknesses.
        ↓
Turn those weaknesses into a plan.
        ↓
Practice deliberately.
        ↓
Measure the improvement.
```

The long-term goal is to turn raw LeetCode activity into an intelligent, continuously improving **DSA development and interview preparation system**.

---

## Built with

```text
Next.js
TypeScript
React
Tailwind CSS
MongoDB
Mongoose
PostgreSQL
n8n
FastAPI
LangChain
LangGraph
Groq
LLaMA
LeetCode GraphQL
SMTP
```

**Leet'O Tracker AI — From solving problems to understanding your progress.**