# CourseMate

## Project Overview

### Project Title

**CourseMate**

### Objective

CourseMate is a collaborative platform designed to help university students with course-related questions. It allows users to ask and answer questions, providing a space to share knowledge and earn recognition through points and badges. It aims to make learning more interactive and engaging.

### Target Audience

University students seeking help with course materials or topics and willing to share knowledge with peers.

## Tech Stack

### Backend

- **Framework**: Laravel

### Frontend

- **Framework/Library**: React

### Rendering Method

- **Client-Side Rendering (CSR)**

### UI Design

- **Tool**: Figma
- **Design Link**: [CourseMate Figma Design](https://www.figma.com/design/fKDPJjzPK2vsDutBGt5i9C/Project?node-id=0-1&t=Gq2vDuo5aOzYM2P0-1)

## Installation

### Requirements

- PHP >= 8.2.12
- Composer
- Node.js
- MySQL

### Backend (Laravel)

#### Clone the repository
```sh
git clone https://github.com/Tahsin-Tajware/CourseMate.git
```

#### Navigate to the project directory
```sh
cd CourseMate
```

#### Install dependencies
```sh
composer install
```

#### Create a database in phpMyAdmin
1. Open phpMyAdmin.
2. Create a new database named `jwt_db`.

#### Run database migrations
```sh
php artisan migrate
```

#### Start the Laravel development server
```sh
php artisan serve
```

#### Start the queue worker for background tasks
```sh
php artisan queue:work
```

---
### Frontend (React)

#### Navigate to the frontend directory
```sh
cd ./react
```

#### Install dependencies
```sh
npm install
```

#### Start the React development server
```sh
npm run dev
```

Frontend live link: [CourseMate Frontend](https://coursemate-frontend.vercel.app)

---

### Admin Panel

#### Navigate to the admin directory
```sh
cd ./admin
```

#### Install dependencies
```sh
npm install
```

#### Start the admin panel development server
```sh
npm run dev
```

Admin panel live link: [CourseMate Admin Panel](https://coursemate-admin-eight.vercel.app)

---

## Project Features

- **User Authentication** (Registration & Login)
- **Question & Answer System**
  - Ask & answer university/course-related questions
  - Option for anonymous posting
  - Search before posting
- **Earn Recognition**
  - Points for correct answers
  - Badges showcased in user profiles
- **Content Interaction**
  - Upvote useful answers
  - Report abusive comments (Admin moderation)
- **Content Management**
  - Edit questions & notify answerers
  - Update answers & notify questioners
  - Save discussions for future reference
- **Tagging System** (Questions tagged by university & course)

---

## API Endpoints

### Authentication
- `POST /register` → User registration
- `POST /login` → User login

### Questions
- `GET /questions` → Fetch all questions
- `POST /questions` → Create a new question
- `PUT /questions/{id}` → Update a question
- `DELETE /questions/{id}` → Delete a question

### Answers
- `GET /answers/{questionId}` → Fetch answers
- `POST /answers/{questionId}` → Post an answer
- `PUT /answers/{id}` → Update an answer
- `DELETE /answers/{id}` → Delete an answer

### Miscellaneous
- `POST /report` → Report abusive content
- `GET /profile` → Fetch user profile

---

## Milestones

### Milestone 1: Initial Setup & Basic Features
- Backend (Laravel) & Frontend (React) setup
- User authentication (Register/Login)
- API for questions
- Basic UI for login, registration & question posting

### Milestone 2: Advanced Features & Interactions
- Search & tagging for questions
- Anonymous posting
- Upvotes & reporting system
- Notifications for question/answer updates
- UI enhancements

### Milestone 3: Final Touches & Deployment
- Badge system for recognition
- Save questions for later
- Admin panel for reports
- Testing, bug fixes & final deployment

---

## Team Members

| **ID**      | **Name**                 | **Email**                    | **Role**           |
| ----------- | ------------------------ | ---------------------------- | ------------------ |
| 20220104006 | **Tahsin Tajware**       | tahsintajware12345@gmail.com | Frontend & Backend |
| 20220104014 | **Abdullah Al Tamim**    | abdullahaltamim001@gmail.com | Lead               |
| 20220104015 | **Nasidur Rahman Auloy** | nasidurrahman1606@gmail.com  | Frontend           |
| 20220104025 | **Sonod Sadman**         | sonodsadman@gmail.com        | Backend            |

---
