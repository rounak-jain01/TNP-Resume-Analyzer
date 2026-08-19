# TNP Resume Analyzer

> An AI-powered Resume & Job Description Analyzer for college placement and recruitment workflows.

## 🚀 Live Application

- **Frontend:** https://tnp-resume-analyzer.vercel.app
- **Backend API:** https://tnp-resume-analyzer.onrender.com
- **API Documentation:** https://tnp-resume-analyzer.onrender.com/docs
- **GitHub:** https://github.com/rounak-jain01/TNP-Resume-Analyzer

---

## 📌 Overview

**TNP Resume Analyzer** is an AI-powered recruitment and placement assistance platform that analyzes resumes against Job Descriptions (JDs).

The system uses LLM-based parsing to extract structured information from resumes and JDs, then applies a structured matching algorithm to evaluate candidates.

The platform is designed primarily for college Training & Placement (T&P) departments, faculty coordinators, and students.

### Student Workflow

Students can upload:

- Resume
- Job Description

The system provides:

- Resume summary
- Company name
- Job role
- Skill matching
- Must-have skill match percentage
- Nice-to-have skill match percentage
- Overall compatibility score
- Eligibility status
- Eligibility reasons
- Skill-gap suggestions

### Faculty Workflow

Faculty members can:

- Upload Job Descriptions
- Create candidate batches
- Upload multiple resumes
- Analyze candidates against a JD
- View candidate rankings
- View detailed analysis
- View batch-level insights
- Identify common skill gaps

---

# ✨ Key Features

## 🤖 AI-Powered Resume Parsing

The system extracts structured information from uploaded resumes using an LLM.

Extracted information includes:

- Candidate name
- Summary
- Skills
- Education
- CGPA
- Branch
- Projects
- Certifications

## 📄 AI-Powered JD Analysis

The Job Description is analyzed to extract:

- Company name
- Role title
- Must-have skills
- Nice-to-have skills
- Soft skills
- Eligibility criteria

## 🎯 Resume-JD Matching

The system compares candidate skills against JD requirements.

### Must-Have Skills

Mandatory requirements are given higher importance.

### Nice-to-Have Skills

Additional skills provide extra matching value.

### Overall Score

The current scoring model is:

```text
Overall Score =
(Must-Have Match × 70%)
+
(Nice-to-Have Match × 30%)
```

---

# 🎓 Eligibility Analysis

The system checks candidate eligibility using information extracted from the resume and JD.

Currently supported criteria include:

- CGPA
- Branch / Degree

Eligibility can result in:

```text
PASS
FAIL
UNKNOWN
```

Example:

```text
JD Minimum CGPA: 7.0
Candidate CGPA: 6.5

Result: FAIL
```

---

# 📊 Faculty Batch Analysis

Faculty can upload multiple resumes against a single JD.

Maximum batch size:

```text
30 resumes
```

The system generates analysis results for each candidate and allows candidates to be ranked according to their overall score.

### Score Distribution

Candidates are categorized as:

```text
Strong Fit     >= 75
Medium Fit     50–74.99
Weak Fit       < 50
```

### Eligibility Funnel

```text
Eligible
Ineligible
Unknown
```

### Skill Gap Analysis

The system identifies mandatory skills that are most frequently missing across candidates.

---

# 🔐 Privacy-First File Processing

A key design decision is that **original Resume and JD files are not permanently stored**.

### Processing Flow

```text
PDF / DOCX
    |
    v
Temporary File
    |
    v
Text Extraction
    |
    v
LLM Analysis
    |
    v
Structured Data
    |
    v
Database
    |
    v
Temporary File Deleted
```

### Stored in Database

Structured information such as:

- Candidate name
- Skills
- Education
- CGPA
- Branch
- Projects
- Certificates
- JD skills
- Eligibility criteria
- Analysis results
- Scores
- Suggestions

### Not Permanently Stored

- Original Resume PDF/DOCX
- Original JD PDF/DOCX
- Raw Resume Text
- Raw JD Text

Temporary files are deleted after processing.

---

# 🏗️ System Architecture

```text
                         +---------------------+
                         |        User         |
                         | Student / Faculty   |
                         +----------+----------+
                                    |
                                    v
                         +---------------------+
                         |    React + Vite     |
                         |      Frontend       |
                         |       Vercel        |
                         +----------+----------+
                                    |
                                    | REST API
                                    v
                         +---------------------+
                         |   FastAPI Backend   |
                         |       Render        |
                         +----------+----------+
                                    |
                    +---------------+---------------+
                    |               |               |
                    v               v               v
              +-----------+   +-----------+   +-------------+
              |   Gemini  |   | PostgreSQL|   | Extraction  |
              |    LLM    |   |  Supabase |   |   Service   |
              +-----------+   +-----------+   +-------------+
```

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | UI development |
| Vite | Frontend build tool |
| React Router | Client-side routing |
| Axios | API communication |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| Recharts | Data visualization |

## Backend

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| FastAPI | REST API framework |
| SQLAlchemy | ORM |
| Alembic | Database migrations |
| Pydantic | Data validation |
| Psycopg2 | PostgreSQL connectivity |
| JWT | Authentication |
| LLM | Resume/JD analysis |

## Database & Infrastructure

| Technology | Purpose |
|---|---|
| PostgreSQL | Relational database |
| Supabase | Hosted PostgreSQL |
| Render | Backend deployment |
| Vercel | Frontend deployment |
| GitHub | Version control |

---

# 📂 Project Structure

```text
TNP-Resume-Analyzer/
|
+-- backend/
|   |
|   +-- app/
|   |   |
|   |   +-- api/
|   |   |   +-- routes/
|   |   |       +-- auth.py
|   |   |       +-- admin.py
|   |   |       +-- faculty.py
|   |   |       +-- student.py
|   |   |
|   |   +-- models/
|   |   |   +-- user.py
|   |   |   +-- resume.py
|   |   |   +-- jd.py
|   |   |   +-- batch.py
|   |   |   +-- analysis_result.py
|   |   |
|   |   +-- schemas/
|   |   +-- services/
|   |   |   +-- llm_service.py
|   |   |   +-- resume_service.py
|   |   |   +-- jd_service.py
|   |   |   +-- matching_service.py
|   |   |   +-- batch_service.py
|   |   |   +-- extraction_service.py
|   |   |   +-- file_service.py
|   |   |   +-- skill_normalizer.py
|   |   |   +-- analysis_result_service.py
|   |   |
|   |   +-- db/
|   |   +-- main.py
|   |
|   +-- alembic/
|   |   +-- versions/
|   |
|   +-- requirements.txt
|
+-- frontend/
    |
    +-- src/
    |   +-- api/
    |   +-- components/
    |   +-- context/
    |   +-- pages/
    |
    +-- public/
    +-- package.json
    +-- vite.config.js
```

---

# 🔄 Application Workflow

## Student Flow

```text
Student Login
      |
      v
Upload Resume
      |
      v
Upload JD
      |
      v
Extract Text
      |
      v
LLM Parsing
      |
      +--------------+
      |              |
      v              v
Resume Data       JD Data
      |              |
      +------+-------+
             |
             v
       Matching Engine
             |
             v
       Eligibility Check
             |
             v
        Overall Score
             |
             v
         Suggestions
             |
             v
           Result
```

## Faculty Flow

```text
Faculty Login
      |
      v
Upload JD
      |
      v
Create Batch
      |
      v
Upload Resumes
      |
      v
Parse Each Resume
      |
      v
Match Resume <-> JD
      |
      v
Generate Analysis
      |
      v
Rank Candidates
      |
      v
Batch Insights
```

---

# 🔐 Authentication & Authorization

The application uses JWT-based authentication and role-based authorization.

Supported roles:

```text
Student
Faculty
Admin
```

Protected route groups include:

```text
/student/*  -> Student
/faculty/*  -> Faculty
/admin/*    -> Admin
```

---

# 🔌 API Endpoints

## Authentication

```text
POST /auth/signup
POST /auth/login
```

## Student

```text
POST /student/analyze
```

## Faculty

### JD

```text
POST /faculty/jd/upload
```

### Batch

```text
POST   /faculty/batch/upload
GET    /faculty/batches
DELETE /faculty/batch/{batch_id}
POST   /faculty/batch/{batch_id}/add-resumes
```

### Results

```text
GET /faculty/batch/{batch_id}/results
GET /faculty/batch/{batch_id}/insights
```

## Health Checks

```text
GET /health
GET /health/db
```

---

# ⚙️ Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/rounak-jain01/TNP-Resume-Analyzer.git
cd TNP-Resume-Analyzer
```

---

# 🐍 Backend Setup

```bash
cd backend
```

Create virtual environment:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Backend Environment Variables

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL=your_postgresql_connection_string
SECRET_KEY=your_secret_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GEMINI_API_KEY=your_gemini_api_key
```

Never commit `.env` files or API keys to GitHub.

---

# 🗄️ Database Setup

Run migrations:

```bash
alembic upgrade head
```

Start backend:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

---

# ⚛️ Frontend Setup

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🏭 Production Build

Build frontend:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

---

# ☁️ Deployment

## Frontend — Vercel

Configuration:

```text
Framework: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Production environment variable:

```env
VITE_API_BASE_URL=https://tnp-resume-analyzer.onrender.com
```

## Backend — Render

Build Command:

```bash
pip install -r requirements.txt
```

Start Command:

```bash
alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Database — Supabase

Production database uses PostgreSQL hosted on Supabase.

The backend receives the database connection through:

```env
DATABASE_URL=...
```

For hosted deployment, use the appropriate Supabase connection pooler URL when required by the hosting environment.

---

# 🔄 Database Migrations

Create a migration:

```bash
alembic revision -m "migration message"
```

Apply migrations:

```bash
alembic upgrade head
```

Rollback one migration:

```bash
alembic downgrade -1
```

---

# 🛡️ File Storage Architecture

Uploaded documents are processed temporarily.

```text
uploads/
└── temp/
    ├── temporary_resume.pdf
    └── temporary_jd.docx
```

After extraction and analysis:

```text
Temporary file
      |
      v
Processed
      |
      v
Deleted
```

Permanent document directories are intentionally not used.

---

# 🧠 Matching Engine

## Skill Normalization

Resume and JD skills are normalized before comparison.

```text
Resume Skills
      |
      v
Normalization
      |
      v
JD Skills
      |
      v
Normalization
      |
      v
Set Comparison
```

## Must-Have Match

```text
Matched Must-Have Skills
------------------------- × 100
Total Must-Have Skills
```

## Nice-to-Have Match

```text
Matched Nice-to-Have Skills
---------------------------- × 100
Total Nice-to-Have Skills
```

## Overall Score

```text
Must-Have Match × 0.70
+
Nice-to-Have Match × 0.30
```

---

# 🧩 Duplicate Resume Handling

The system includes duplicate candidate detection.

Candidate identity is inferred using:

- Candidate name
- Skill similarity

Normalized skill sets are compared to determine whether an uploaded resume is likely to belong to an existing candidate.

When an existing candidate is detected, the existing resume record can be updated as a new version instead of creating unnecessary duplicate records.

---

# 📊 Example Analysis Result

```json
{
  "overall_score": 82.5,
  "must_have_match_pct": 90.0,
  "nice_to_have_match_pct": 65.0,
  "matched_skills": [
    "python",
    "sql",
    "machine learning"
  ],
  "missing_must_have_skills": [
    "docker"
  ],
  "missing_nice_to_have_skills": [
    "aws"
  ],
  "eligibility_status": "pass",
  "suggestions": "Consider also learning AWS."
}
```

---

# 🚨 File Validation

Supported file types:

```text
PDF
DOCX
```

Maximum file size:

```text
5 MB
```

Invalid file types and oversized uploads are rejected before processing.

---

# 🔒 Security Considerations

The application includes:

- JWT authentication
- Role-based authorization
- CORS configuration
- File type validation
- File size validation
- Temporary file processing
- Environment-based secrets
- Database migrations
- Protected routes

Never commit:

```text
.env
API keys
Database passwords
JWT secrets
```

---

# 🧪 Testing Checklist

## Authentication

- [ ] Student signup
- [ ] Student login
- [ ] Faculty login
- [ ] Admin authentication
- [ ] Invalid credentials rejected

## Student

- [ ] Resume upload
- [ ] JD upload
- [ ] Resume parsing
- [ ] JD parsing
- [ ] Matching
- [ ] Eligibility
- [ ] Suggestions

## Faculty

- [ ] JD upload
- [ ] Batch creation
- [ ] Multiple resume upload
- [ ] Candidate ranking
- [ ] Batch results
- [ ] Batch insights
- [ ] Add resumes
- [ ] Delete batch

## Privacy

- [ ] Resume temporary file deleted
- [ ] JD temporary file deleted
- [ ] Raw resume text not stored
- [ ] Raw JD text not stored
- [ ] Original PDF/DOCX not permanently stored

## Production

- [ ] Backend deployed
- [ ] Swagger working
- [ ] Database connected
- [ ] Alembic migrations applied
- [ ] Frontend deployed
- [ ] CORS configured
- [ ] Frontend → Backend communication working

---

# 🔮 Future Enhancements

Potential future improvements:

- Advanced semantic skill matching
- More eligibility criteria
- Resume improvement recommendations
- Email notifications
- Exportable analysis reports
- Advanced candidate filtering
- Recruiter dashboard
- Placement statistics
- Multi-JD candidate comparison
- AI-powered interview preparation
- Improved scoring models
- More advanced analytics
- Background processing for large batches

---

# 👨‍💻 Author

**Rounak Jain**

B.Tech — Computer Science Engineering  
Artificial Intelligence & Data Science

---

# 📜 License

This project is intended for educational, academic, and placement-related use.

---

# 🔗 Project Links

| Resource | Link |
|---|---|
| 🌐 Frontend | https://tnp-resume-analyzer.vercel.app |
| ⚙️ Backend | https://tnp-resume-analyzer.onrender.com |
| 📚 API Docs | https://tnp-resume-analyzer.onrender.com/docs |
| 💻 GitHub | https://github.com/rounak-jain01/TNP-Resume-Analyzer |

---

# 🏁 Project Status

**🟢 Production Ready**

```text
Frontend       → Vercel       ✅
Backend        → Render       ✅
Database       → Supabase     ✅
AI Analysis    → LLM          ✅
Migrations     → Alembic      ✅
Authentication → JWT          ✅
CORS           → Configured   ✅
File Privacy   → Temporary    ✅
Student Flow   → Working      ✅
Faculty Flow   → Working      ✅
```

---

> **TNP Resume Analyzer** — AI-assisted screening for smarter, faster placement decisions.
