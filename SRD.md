# Software Requirements Document

Project: Medical Movement Analysis System
Version: 1.0
Phase: Phase 1 MVP

---

# 1. Objective

Develop a mobile-based system that allows users to:

1. Register and login
2. Record joint movement video
3. Upload video
4. Receive AI-based movement analysis
5. View analysis history

Live streaming is excluded from Phase 1.

---

# 2. Scope

Included:

* Mobile app (React Native + Expo)
* Backend API (Node.js)
* PostgreSQL database
* Cloud video storage
* AI microservice integration

Excluded:

* Real-time streaming
* Admin dashboard
* Hospital-grade integrations

---

# 3. User Roles

Patient:

* Register / Login
* Manage profile
* Record and upload video
* View results

Doctor role optional in Phase 1.

---

# 4. Functional Requirements

## 4.1 Authentication

FR-1: User must register with name, email, password
FR-2: Email must be unique
FR-3: Password must be hashed
FR-4: Login must return JWT

---

## 4.2 Profile

FR-5: User must store age, gender, affected limb
FR-6: User must update profile

---

## 4.3 Video Recording

FR-7: User must record 5 to 15 second video
FR-8: User must preview video before upload

---

## 4.4 Video Upload

FR-9: Video must upload to backend
FR-10: Video must be stored in cloud storage
FR-11: Video URL must be saved in database

---

## 4.5 AI Integration

FR-12: Backend must call AI endpoint after upload
FR-13: AI response must include:

* min_angle
* max_angle
* movement_score
* raw_json

FR-14: Analysis result must be stored in database

---

## 4.6 Results

FR-15: User must view:

* Minimum angle
* Maximum angle
* Range of motion
* Movement score

FR-16: User must access analysis history

---

# 5. Non Functional Requirements

Performance:

* AI response under 30 seconds
* API response under 500 ms (excluding AI)
* Max video size 50 MB

Security:

* HTTPS mandatory
* JWT authentication
* Password hashing with bcrypt
* Role-based access
* No public access to medical results

Scalability:

* Dockerized backend and AI service
* Independent AI microservice

Reliability:

* AI failure must return error safely
* Uploaded videos must not be lost

---

# 6. System Components

Mobile App:

* React Native + Expo
* Camera module
* API integration

Backend:

* Node.js + Express
* Multer for upload
* Cloudinary integration
* JWT auth

Database:

* PostgreSQL

AI Service:

* Python FastAPI
* POST /analyze endpoint

---

# 7. Data Model (Core Tables)

Users

* id
* name
* email
* password_hash
* role
* created_at

Videos

* id
* user_id
* cloud_url
* created_at

Analysis

* id
* video_id
* min_angle
* max_angle
* movement_score
* raw_json
* created_at

---

# 8. Acceptance Criteria

Phase 1 is complete when:

1. User registration and login works
2. Video recording and upload works
3. AI service returns result
4. Analysis is stored
5. Results are viewable
6. History screen works

---

Author: Shaurya Bansal
Email: shauryaagrawal2718@gmail.com
Phone No: 8962327289
Date: 28/02/2026
