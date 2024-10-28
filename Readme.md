🌿 Plant Store E-Commerce
A fully functional eCommerce platform designed for selling plants online. This application is built with Node.js, Express.js, TypeScript, and MongoDB (Mongoose), providing a smooth and scalable backend for managing products, users, and orders. The project uses JWT for secure authentication, Cloudinary for media storage, and Zod for data validation.

🚀 Live Demo
Check out the live version of the plant store here.

Database diagram available - [here](https://app.eraser.io/workspace/tNrBITdz4vrAp7OkcOqr)

📖 Table of Contents
Features
Tech Stack
Installation
Environment Variables
API Endpoints
Folder Structure
Documentation
License
✨ Features
User authentication and authorization using JWT
Bcrypt for password hashing and security
Product management (Create, Read, Update, Delete) for admin users
Cloudinary integration for image uploads
Secure payment processing integration (e.g., Stripe or PayPal)
Responsive design for user-friendly browsing
Shopping cart and checkout functionality
Order history for users
RESTful API with robust validation using Zod
CORS enabled for secure cross-origin requests
🛠️ Tech Stack
Node.js: Server-side JavaScript runtime
Express.js: Web framework for building APIs
TypeScript: Strictly typed JavaScript for scalable and maintainable code
MongoDB: NoSQL database used with Mongoose for ORM
JWT: Secure token-based authentication
Cloudinary: Media and image storage
Zod: Schema validation for API requests
Bcrypt: Password hashing
Nodemon: Auto-restart server for development

📦 Installation
Clone the repository:
git clone https://github.com/yourusername/plant-store.git
Navigate to the project directory:


cd plant-store
Install dependencies:


npm install
Create a .env file and add the required environment variables as described in the Environment Variables section.

Run the application:
npm run dev
Access the app at https://furn-flora-api.vercel.app/api/v1/health

🌱 Environment Variables
Create a .env file in the root directory of your project and add the following environment variables:

plaintext
Copy code
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

📋 API Endpoints
Health 
/health
Auth Routes
POST /auth/register - Register a new user
POST /auth/login - Login an existing user
Product Routes
GET /products - Get all products
GET /products/:id - Get a single product
POST /products - Create a new product (admin only)
PUT /products/:id - Update a product (admin only)
DELETE /products/:id - Delete a product (admin only)
Order Routes
POST /orders - Create a new order
GET /orders/user/:id - Get order history for a user

For more detailed information, check the API Documentation.

🗂️ Folder Structure
📦 plant-store
 ┣ 📂src
 ┃ ┣ 📂controllers
 ┃ ┣ 📂middlewares
 ┃ ┣ 📂models
 ┃ ┣ 📂routes
 ┃ ┣ 📂utils
 ┃ ┣ 📜constants.ts
 ┃ ┣ 📜index.ts
 ┃ ┗ 📜app.ts
 ┣ 📜.env
 ┣ 📜.gitignore
 ┣ 📜.prettierignore
 ┣ 📜.prettierrc
 ┣ 📜package.json
 ┗ 📜README.md

📄 Documentation
For detailed API documentation and usage, please refer to the project documentation.

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.