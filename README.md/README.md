# Dorm Ledger – Frontend

This repository contains the frontend for the Dorm Ledger system.

## Pages
- Splash Screen → Auto redirects to Login
- Login Page → Student / Admin login
- Student Dashboard
- Admin Dashboard

## Current Status
- Frontend UI and navigation completed
- Backend integration pending
- ML model completed separately

## Backend Integration Required
The frontend expects the following backend APIs:

### Authentication
- POST /auth/login (student & admin)

### Attendance (In/Out)
- POST /attendance/inout
- GET /attendance/history
- GET /attendance/live

### Meal Availability
- POST /meals/submit
- GET /meals/today
- GET /meals/stats

### Complaints
- POST /complaints
- GET /complaints/student
- GET /complaints/admin
- PUT /complaints/:id/status

### Fees
- GET /fees/:studentId
- POST /fees/pay

### Notices
- POST /notices
- GET /notices/student
- GET /notices/admin

## Notes
- Frontend currently uses mock logic / localStorage
- Backend will replace this with real APIs
