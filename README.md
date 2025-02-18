# CourseMate

## Team Members

| **ID**      | **Name**                 | **Email**                    | **Role**           |
| ----------- | ------------------------ | ---------------------------- | ------------------ |
| 20220104006 | **Tahsin Tajware**       | tahsintajware12345@gmail.com | Frontend & Backend |
| 20220104014 | **Abdullah Al Tamim**    | abdullahaltamim001@gmail.com | Lead               |
| 20220104015 | **Nasidur Rahman Auloy** | nasidurrahman1606@gmail.com  | Frontend           |
| 20220104025 | **Sonod Sadman**         | sonodsadman@gmail.com        | Backend            |

## Project Overview

### Project Title

**CourseMate**

### Objective

CourseMate is a collaborative platform designed to help university students with course-related questions. It allows users to ask and answer questions, providing a space to share knowledge and earn recognition through points and badges. It aims to make learning more interactive and engaging.

### Target Audience

University students seeking help with course materials or topics and willing to share knowledge with peers.

## Tech Stack

### Backend

-   **Framework**: Laravel

### Frontend

-   **Framework/Library**: React

### Rendering Method

-   **Client-Side Rendering (CSR)**

### **UI Design**

-   **Tool**: Figma
-   **Design Link**: [CourseMate Figma Design](https://www.figma.com/design/fKDPJjzPK2vsDutBGt5i9C/Project?node-id=0-1&t=Gq2vDuo5aOzYM2P0-1)

    ```bash
    https://www.figma.com/design/fKDPJjzPK2vsDutBGt5i9C/Project?node-id=0-1&t=Gq2vDuo5aOzYM2P0-1
    ```

## Project Features

1. **User Authentication**

    - Registration & Login.

2. **Question & Answer System**

    - Ask questions related to your university or course.
    - Option to post questions anonymously.
    - Search for similar questions before posting.

3. **Earn Recognition**

    - Earn points for answering questions correctly.
    - Points lead to badges that can be showcased in user profiles.

4. **Content Interaction**

    - Upvote answers that solve your problem.
    - Report abusive comments (handled by Admin).

5. **Content Management**

    - Update previously asked questions; notify answerers.
    - Update answers; notify questioners.
    - Save questions/discussions for future reference.

6. **Tagging System**
    - Questions tagged based on university and course number.

## API Endpoints

### Authentication

-   **POST /register**: User registration.
-   **POST /login**: User login.

### Questions

-   **GET /questions**: Fetch all questions.
-   **POST /questions**: Create a new question.
-   **PUT /questions/{id}**: Update a question.
-   **DELETE /questions/{id}**: Delete a question.

### Answers

-   **GET /answers/{questionId}**: Fetch answers for a question.
-   **POST /answers/{questionId}**: Post an answer.
-   **PUT /answers/{id}**: Update an answer.
-   **DELETE /answers/{id}**: Delete an answer.

### Miscellaneous

-   **POST /report**: Report an abusive comment.
-   **GET /profile**: Fetch user profile details.

## Milestones

### Milestone 1: Initial Setup and Basic Features

-   Set up Laravel backend and React frontend.
-   Implement user authentication (registration and login).
-   Create API endpoints for questions.
-   Basic UI for login, registration, and question posting.

### Milestone 2: Advanced Features and Interactions

-   Implement question tagging and searching.
-   Add anonymous posting feature.
-   Enable upvoting and reporting.
-   Notification system for updates (question and answer).
-   UI for question and answer interactions.

### Milestone 3: Final Touches and Deployment

-   Implement badge system for user recognition.
-   Enable saving questions/discussions.
-   Admin panel for managing reports.
-   Complete testing and bug fixes.
-   Deployment to a hosting platform.
