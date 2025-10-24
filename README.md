# CekSaku

## Project Overview

CekSaku is a backend application built with Node.js, Express.js, TypeScript, and MongoDB. It provides functionalities for managing and analyzing personal financial data.

## Key Features & Benefits

- **User Authentication:** Secure user registration and login using bcrypt.
- **Data Management:** API endpoints for managing income and expense data.
- **Financial Reporting:** Generation of financial reports, including total income, expenses, and savings rate.
- **Analytics:** Insights into spending habits and financial health.
- **Cloudinary Integration:** Image upload and management using Cloudinary.
- **Google AI Integration:** Integration with Google's AI models for generating insights.

## Prerequisites & Dependencies

Before you begin, ensure you have the following installed:

- **Node.js:**  Version 18 or higher
- **npm:** Node Package Manager
- **MongoDB:** A running MongoDB instance (local or cloud)

## Installation & Setup Instructions

1. **Clone the Repository:**

   ```bash
   git clone <repository_url>
   cd CekSaku/backend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the `backend/` directory with the following variables:

   ```
   MONGO_URI=<Your MongoDB Connection String>
   PORT=<Port Number, e.g., 5000>
   JWT_SECRET=<Your JWT Secret Key>
   CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
   CLOUDINARY_API_KEY=<Your Cloudinary API Key>
   CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
   GOOGLE_AI_API_KEY=<Your Google AI API Key>
   RESEND_API_KEY=<Your Resend API Key>
   FRONTEND_URL=<Your Frontend URL>
   ```

   **Note:**  Replace the placeholders with your actual values.

4. **Database Setup:**

   Ensure your MongoDB instance is running and accessible. The `MONGO_URI` in your `.env` file should point to your MongoDB database.

5. **Start the Development Server:**

   ```bash
   npm run dev
   ```

   This will start the development server using `ts-node-dev`.

6. **Build for Production:**

   ```bash
   npm run build
   ```

7. **Start the Production Server:**

    ```bash
    npm start
    ```

## Usage Examples & API Documentation

Refer to the individual controller files in the `backend/src/controllers/` directory for specific API endpoint usage.

**Example: Getting Analytics Data**

```javascript
// analytics.controller.ts

import { Request, Response } from "express";

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    // Logic to fetch and process analytics data
    const data = { /* Your analytics data */ };
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch analytics data" });
  }
};
```

## Configuration Options

The application can be configured using environment variables.  Key variables include:

| Variable               | Description                                                                 | Default Value |
| ---------------------- | --------------------------------------------------------------------------- | ------------- |
| `MONGO_URI`            | MongoDB connection string.                                                 |               |
| `PORT`                 | Port number the server will listen on.                                      | `5000`        |
| `JWT_SECRET`           | Secret key used for signing JSON Web Tokens.                               |               |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary cloud name.                                                      |               |
| `CLOUDINARY_API_KEY`   | Cloudinary API key.                                                        |               |
| `CLOUDINARY_API_SECRET`| Cloudinary API secret.                                                     |               |
| `GOOGLE_AI_API_KEY`    | Google AI API key.                                                         |               |
| `RESEND_API_KEY`       | Resend API key for sending emails.                                      |               |
| `FRONTEND_URL`         | The URL of your frontend application. Needed for CORS and redirects. |               |

## Contributing Guidelines

We welcome contributions to CekSaku! To contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Implement your changes and write tests.
4.  Submit a pull request with a clear description of your changes.

## License Information

License not specified.  All rights reserved.

## Acknowledgments

- This project uses libraries and tools developed by the open-source community.
- Special thanks to the contributors of Express.js, TypeScript, MongoDB, and other dependencies.
