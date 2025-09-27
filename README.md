# Proof-My-Resume

**An intelligent resume optimization tool powered by AI and natural language processing.**

## 🚀 Overview

**Proof-My-Resume** is a web application that analyzes and enhances resumes to increase their chances of passing Applicant Tracking Systems (ATS). By leveraging AI and NLP, it assesses resumes against job descriptions, providing actionable insights and recommendations for improvement.

## 🧩 Features

- **ATS Compatibility Analysis**: Evaluates how well a resume aligns with ATS algorithms.
- **Keyword Optimization**: Identifies missing keywords and suggests additions to match job descriptions.
- **End-to-End Authentication**: Authentication flow uses JWT tokens for secure and encrypted authentication. 
- **Formatting Recommendations**: Advises on formatting changes to improve readability and ATS parsing.
- **Real-Time Feedback**: Provides instant suggestions as users upload their resumes.
- **Multi-Format Support**: Accepts resumes in various formats, including PDF and DOCX.

## ⚙️ Tech Stack

- **Frontend**: NextJS 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, Prisma, OpenAI
- **AI/NLP**: OpenAI GPT-5 mini
- **Database**: Postgres, NeonDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Parsing**: pdf-parse, mammoth.js
- **Storage**: AWS S3 Bucket
  
## 🛠️ Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/MeetDesaii/Proof-My-Resume.git
   cd Proof-My-Resume

2. **Install Dependencies**

   For the client:

   ```bash
   cd client
   npm install
   ```

   For the server:

   ```bash
   cd server
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in both the `client` directory with the following variables:

   ```env
    DATABASE_URL="your-database-connection-string"
    NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```
   
   Create a `.env` file in both the `server` directory with the following variables:
  
   ```env
    DATABASE_URL="your-database-connection-string"
    NODE_ENV=development
    PORT=4000
    
    
    JWT_SECRET="your-super-secret-jwt-key-change-this"
    OPENAI_API_KEY="openAIk-key"
    
    FRONTEND_URL="http://localhost:3000"
    
    # AWS S3 (for file storage)
    AWS_ACCESS_KEY_ID=""
    AWS_SECRET_ACCESS_KEY=""
    AWS_REGION=""
    AWS_S3_BUCKET=""
   ```

4. **Run the Application**

   In the `server` directory:

   ```bash
   npm run dev
   ```

   In the `client` directory:

   ```bash
   npm run dev
   ```

   The application should now be running at [http://localhost:3000](http://localhost:3000).
