# TanishaReads - The Writer's Library

TanishaReads is a full-stack digital library application designed to showcase literary works. It provides a clean, public-facing interface for readers to discover and browse books, and a secure, feature-rich administrative panel for content management. Built with the MERN stack (MongoDB, Express.js, React, Node.js), it uses Cloudinary for media storage and is designed to be a scalable and performant platform for writers to share their creations.

## Key Features

* **Admin Dashboard:** A private, secure dashboard for administrators to manage the entire library's content.
* **Full Book Management (CRUD):** Administrators can upload new books with cover images and PDF files, view book details, update metadata, and delete entries from the library.
* **Content Status Control:** Books can be managed with different statuses like 'Published', 'Draft', or 'Archived', and their public visibility can be toggled on or off.
* **Public Library View:** A beautifully designed, responsive interface for visitors to browse, filter by genre, and read published books.
* **Integrated PDF Reader:** Users can read books directly on the website through an embedded PDF viewer with a fullscreen option.
* **Secure Admin Authentication:** The admin panel is protected by a JWT-based authentication system.
* **User Feedback System:** A dedicated page allows users to submit feedback, which is then sent directly to an administrator's email via Nodemailer.

## Technical Details

* **Frontend:**
    * **Framework:** Built with React.js and Vite for a fast development experience.
    * **Styling:** Styled using Tailwind CSS and DaisyUI for a modern, responsive, and customizable UI.
    * **State Management:** Utilized Redux Toolkit for global state management and Redux Persist to maintain the admin session across browser reloads.
    * **Routing:** Client-side routing is handled by React Router DOM.
    * **Utilities:** Axios for API communication, React Toastify for notifications, and Lucide React for icons.
* **Backend:**
    * **Framework:** Developed with Node.js and Express.js for a robust and efficient server.
    * **Database:** MongoDB is used as the database, with Mongoose as the Object Data Modeling (ODM) library.
    * **API & Authentication:** A RESTful API is secured using JSON Web Tokens (JWT) for admin-only endpoints.
    * **File Handling:** Media uploads (images, PDFs) are managed with Multer and stored on Cloudinary.
    * **Security:** Enhanced with Helmet for protection against common web vulnerabilities and express-rate-limit to prevent brute-force attacks.

## Snapshots :

<table>
  <tr>
    <td><img src="./public/home.png" alt="Home Page" width="100%"/></td>
    <td><img src="./public/book_details.png" alt="Book Details Page" width="100%"/></td>
  </tr>
  <tr>
    <td><img src="./public/admin_dashboard.png" alt="Admin Dashboard" width="100%"/></td>
    <td><img src="./public/admin_login.png" alt="Admin Login Page" width="100%"/></td>
  </tr>
  <tr>
    <td><img src="./public/upload_form.png" alt="Upload Form" width="100%"/></td>
    <td><img src="./public/feedback_page.png" alt="Feedback Page" width="100%"/></td>
  </tr>
</table>

---

## Setup Instructions

To run this project locally, follow these steps:

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local instance or a cloud service like MongoDB Atlas)
- A Cloudinary account for media storage

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Deepesh-Gaharwar/tanishaReads-app.git
    cd tanishareads-app/backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `backend` directory and add the following environment variables:
    ```env
    PORT=3000
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret_key>
    JWT_EXPIRES_IN=7d
    CLIENT_URL=http://localhost:5173
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    FEEDBACK_EMAIL=<your_gmail_address>
    FEEDBACK_PASS=<your_gmail_app_password>
    ADMIN_RECEIVER_EMAIL=<email_to_receive_feedback>
    ```
4.  **Start the server:**
    ```bash
    npm run dev
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the `frontend` directory and add the backend URL:
    ```env
    VITE_BACKEND_URL=http://localhost:3000
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```

The application should now be running, with the frontend available at `http://localhost:5173` and the backend at `http://localhost:3000`.