# Investo

## Assignment Overview

This assignment is to create Investo, a web application designed to help users visualize and analyze stock market data. 

![image](https://github.com/user-attachments/assets/044bec5b-d479-4569-869d-29740d843ae4)
 ---

 ![image](https://github.com/user-attachments/assets/91966e69-883f-4272-8b72-4507f1426473)

 ---

 ![image](https://github.com/user-attachments/assets/4aeccadb-c645-4ab7-8835-f7bccc5118ef)


## Project Requirements

This is a stock analysis web application with the following features:
- Interactive stock price visualization
- Historical data analysis

## Technologies Used

- **Frontend**: React.js with Vite and TailwindCSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites

The application is containerized for easy setup. You'll need:
- Docker
- Docker Compose

### Installation & Setup

1. Clone my repository:
   ```sh
   git clone https://github.com/nk1044/invsto.git
   cd invsto
   ```

2. Build and start all services:
   ```sh
   docker-compose up --build
   ```

3. The application will be available at:
   ```
   http://localhost:5173
   ```

## Project Structure

```
invsto/
├── frontend/          # React application
├── backend/           # FastAPI server
├── database/          # PostgreSQL data volume
├── docker-compose.yml # Container orchestration
└── README.md          # This documentation
```
