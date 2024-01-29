# Exercise Tracker API

This is a simple Exercise Tracker API built using Express.js and MongoDB. It allows users to track their exercises and view their exercise logs. This is my solution to a challenge from freeCodeCamp's Back End Development and APIs certification.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/exercise-tracker-api.git
   ```

2. Install dependencies:

   ```bash
   cd exercise-tracker-api
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:

   ```env
   MONGO_URI=your_mongo_db_connection_string
   PORT=3000
   ```

   Replace `your_mongo_db_connection_string` with your MongoDB connection string.

4. Start the server:

   ```bash
   npm start
   ```

## Usage

Visit [http://localhost:3000](http://localhost:3000) to access the API.

## Endpoints

- **GET /api/users**
  - Returns a list of all users.

- **POST /api/users**
  - Create a new user.

- **POST /api/users/:_id/exercises**
  - Add a new exercise for a specific user.

- **GET /api/users/:_id/logs**
  - Retrieve the exercise log for a specific user.
