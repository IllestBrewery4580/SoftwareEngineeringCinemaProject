# Software Engineering Cinema E-Booking Project

## Overview
This project is a web-based cinema application built using **Django** (backend) and **React** (frontend). Users can register, log in, search for movies, browse movies, book tickets, and log out. The project also demonstrates secure session handling, user authentication, and a responsive UI.

---

## Project Structure


---

## Features

- **User Registration & OTP Verification**: Secure registration with email verification.
- **Login / Logout**: Session management with logout functionality.
- **Movie Listings & Bookings**: Browse movies and make bookings.
- **Responsive UI**: Clean, user-friendly interface.
- **Secure Backend**: User data and passwords are stored securely, logout invalidates session.

---

## Installation & Setup

### Backend (Django)
1. Navigate to the backend folder:
   ```bash
   cd Backend
2. Create and activate a virtual environment:
   python3 -m venv venv
   source venv/bin/activate     # macOS/Linux
3. Install dependencies:
   pip install -r requirements.txt
4. Apply migrations:
   python manage.py migrate
5. Run server:
   python manage.py runserver

---
Frontend (React)
1. Navigate to the Frontend folder:
   cd Frontend
2. Install dependencies:
   npm install
3. Start the development server:
   npm start
The frontend runs on http://localhost:3001 and communicates with the backend at http://localhost:8000.

---

Usage:
1. Open the frontend in a browser.
2. Register a new user or log in.
3. Browse available movies and make bookings.
4. Use the Logout button to end you session.

---

Notes:
- Ensure both backend and frontend servers are running simultaneously.
- The logout functionality has been implemented using an API call to the backend that ends the session and redirects to the login page.
- API endpoints:
-   GET /accounts/logout/ -> Logs out the current user.
-   POST /accounts/register/ -> Registers a new user.
-   POST /accounts/login/ -> Authenticates a user.

---

Team:
- Mallika Suyal (Team Leader, Frontend primary member, & Backend secondary member)
- Susan Awad
- Isabel Beck
- My Phuong Ly
- Sai
