# 🚭 YenQuit: Tobacco Cessation & Motivation Platform

**YenQuit** is a scientifically-backed digital health platform designed to assist users in quitting tobacco use and overcoming bad habits. By utilizing the clinically validated **5 A's (Ask, Advise, Assess, Assist, Arrange)** and **5 R's (Relevance, Risks, Rewards, Roadblocks, Repetition)** counseling models, the application provides personalized guidance, assessment, motivational tools, and structured planning resources.

## 🚀 Key Features

*   **Scientific Pathways**:
    *   **5 A’s Flow**: A structured path for users ready to quit, guiding them through assessment, advice, and assistance to set a quit date.
    *   **5 R’s Flow**: A motivational path for users not yet ready to quit, focusing on personal relevance and overcoming roadblocks.
*   **YenAI Assistant**: An AI-powered chatbot for real-time support, guidance, and answering user queries.
*   **Community Hub**: A real-time chat and community space for users to connect, share experiences, and support each other.
*   **Learning Hub**: A dedicated section for educational content and resources.
*   **Admin Dashboard**: Comprehensive tools for user management, content configuration, and detailed analytics/reports.
*   **Progress Tracking**: Visual trackers for smoke-free days, money saved, and health recovery milestones.

## 🛠️ Tech Stack

The project is structured as a full-stack application with a separate client and server:

*   **Frontend (Client)**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui.
*   **Backend (Server)**: Node.js, Express, PostgreSQL.
*   **Real-time**: Socket.io for community chat features.

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL

### Running the Application

This project consists of two main parts: the detailed Next.js **Client** and the Express **Server**. You will need to run both concurrently.

**1. Start the Server**
Navigate to the server directory, install dependencies, and start the backend:
```bash
cd server
npm install
npm start
```
The server typically runs on port 5000.

**2. Start the Client**
Open a new terminal, navigate to the client directory, and start the frontend:
```bash
cd client
npm install
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000).

## 🚢 Deploying to Production

For comprehensive hosting and deployment instructions (intended for IT/System Admins), please refer to the [HOST.md](./HOST.md) guide.

---
**Built with ❤️ for a healthier future.**
