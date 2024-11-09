# E-Commerce Backend API

A robust and scalable e-commerce backend built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, and **Redis**. This API handles product management, cart and wishlist functionalities, user authentication, order management, payment integration, and invoice generation for an e-commerce platform.

## Live Link 
### [CLICK HERE](https://furn-flora-api.vercel.app/api/v1/health)

## Features

- **User Authentication & Authorization**: Secure login, registration, and JWT-based user authentication.
- **Product Management**: CRUD operations for products, including filtering and pagination.
- **Cart & Wishlist**: Add products to the cart and wishlist, update quantities, and manage items.
- **Order Management**: Place, view, update, and cancel orders, including integration with Stripe for payment.
- **Invoice Generation**: Automatically generates invoices upon order completion, with downloadable PDFs.
- **Redis Caching**: Optimized data fetching with Redis caching for faster responses.
- **Payment Integration**: Supports Cash on Delivery (COD) and Stripe card payments.
- **Swagger API Documentation**: Detailed API documentation for easy integration and testing.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (Mongoose)
- **Caching**: Redis
- **Payment Integration**: Stripe
- **PDF Generation**: PDFKit (for invoice PDFs)
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger


## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v14 or above)
- [MongoDB](https://www.mongodb.com/) (local or cloud-based)
- [Redis](https://redis.io/) (for caching)
- [Stripe Account](https://stripe.com/) (for payment integration)
- [Swagger UI](https://swagger.io/tools/swagger-ui/) (for API documentation)

## Installation

1. **Clone the repository**:

   - git clone https://github.com/NayimWd/NayimWd-PlantStoreApi
   - cd ecommerce-backend
- Install dependencies:
- npm install
Create a .env file:

- add your environment variables:


-  MongoDB, Redis, and Stripe credentials, cloudinary, jwt secret to the .env file.**

Run the development server:

Use nodemon for hot-reloading during development:


npm run dev
The backend will be running on http://localhost:8000.

 ## API Documentation
For detailed API documentation and usage, please refer to the project [documentation](https://app.swaggerhub.com/apis-docs/naimhasan/Plant_Store_Api/1.0.0) 


### Main Endpoints
- POST /auth/register: Register a new user.
- POST /auth/login: Log in and receive a JWT token.
- GET /products: Get all products with pagination and filters (category, size, price, etc.).
- GET /products/{id}: Get a single product by its ID.
- POST /cart/add: Add a product to the cart.
- POST /wishlist/add: Add a product to the wishlist.
- POST /order/create: Place an order from the cart or wishlist.
- GET /order/{id}: Get details of a specific order.
- GET /invoices: Get all invoices for a user (admin or user who owns the order).
- GET /invoices/{id}: Get a single invoice by ID (with option to download as PDF).
Payment Flow
- For Cash on Delivery (COD), the order is placed immediately, and the payment status is set to "pending".
- For Stripe payments, a payment intent is created, and the payment is processed. - Upon success, the order status is updated to "paid", and an invoice is generated.
### Redis Caching
- Redis is used for caching product data to reduce response times for frequently requested data.
- Redis is configured for local development and can be used in production for better scalability.
 ### Invoice Download
- After placing an order, an invoice is automatically generated.
- Users can download their invoice as a PDF from the /invoices/{id} endpoint.



Thank you for checking out this project! If you have any questions or feedback, feel free to open an issue or contact me. 

### Email
 **nayim.wd@gmail.com**
 ##
### Linkedin

**[Linkedin](https://www.linkedin.com/in/nayim-hasan/)**