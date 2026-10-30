# RentEase – Furniture & Appliance Rental Platform

## 1. Project Title
**RentEase – Furniture & Appliance Rental Platform**

## 2. Project Type
**Internship Project**

## 3. Project Overview
RentEase is a web-based furniture and appliance rental platform designed to make renting household products simple, affordable and convenient.

The platform allows customers to browse available furniture and appliances, view rental prices and deposits, select rental duration, add products to the rental cart and complete the checkout process.

The platform also provides a seller management system through which authorized sellers can manage products and view rental orders.

## 4. Problem Statement
Students and working professionals who relocate for education or employment often need furniture and appliances for a limited period.

Purchasing these products can involve:
- High initial cost
- Transportation difficulties
- Maintenance responsibilities
- Difficulty during relocation
- Limited flexible rental options
- Limited access to convenient local rental services

RentEase addresses these problems by providing a convenient online rental platform.

## 5. Objectives
- Provide affordable monthly rental options.
- Allow customers to select flexible rental durations.
- Provide an easy-to-use product browsing system.
- Simplify the rental and checkout process.
- Provide delivery and pickup information.
- Allow sellers to manage rental products.
- Store customer and order information securely.
- Support convenient renting for students and working professionals.

## 6. Target Users

### Customers
Customers can:
- Register and log in.
- Browse furniture and appliances.
- View product details.
- Select rental duration.
- Add products to the cart.
- Complete checkout.
- View their rental information.

### Sellers
Authorized sellers can:
- Log in securely.
- Access the seller dashboard.
- Add products.
- Upload product images.
- Edit products.
- Delete products.
- Manage rental orders.

## 7. Main Features

### Customer Features
- Customer registration
- Customer login
- Product listing
- Product details
- Product categories
- Monthly rental pricing
- Rental tenure selection
- Shopping cart
- Checkout
- Payment method selection
- Order creation
- Rental history

### Seller Features
- Seller login
- JWT-based authentication
- Seller dashboard
- Product management
- Add product
- Product image upload
- Edit product
- Delete product
- Order management

## 8. Technology Stack

### Frontend
- React.js
- Vite
- React Router
- JavaScript
- HTML
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JSON Web Token (JWT)
- bcryptjs
- Protected routes

### Development Tools
- Visual Studio Code
- Git
- GitHub
- MongoDB Atlas

## 9. System Architecture
The system follows a client-server architecture.

The React frontend provides the user interface and communicates with the Express.js backend through REST API requests.

The backend processes requests, performs authentication and communicates with MongoDB for storing and retrieving application data.

**Basic flow:**  
User → React Frontend → Express.js API → MongoDB

**Authenticated flow:**  
User → Login → JWT Token → Protected API → Database

## 10. Customer Workflow
1. Customer opens RentEase.
2. Customer registers or logs in.
3. Customer browses available products.
4. Customer selects a product.
5. Customer views product details.
6. Customer selects rental duration.
7. Customer adds the product to the cart.
8. Customer proceeds to checkout.
9. Customer enters delivery details.
10. Customer selects a payment method.
11. Order information is submitted.
12. Order is stored in MongoDB.
13. Customer receives order confirmation.

## 11. Seller Workflow
1. Seller opens the Seller Login page.
2. Seller enters seller credentials.
3. Backend verifies the credentials.
4. JWT token is generated.
5. Seller accesses the dashboard.
6. Seller can add products.
7. Seller can upload product images.
8. Seller can edit products.
9. Seller can delete products.
10. Seller can manage rental orders.

## 12. Authentication and Security
RentEase uses authentication to protect user and seller operations.

Passwords are securely processed using bcryptjs.

After successful login, the backend generates a JWT token.

Seller-specific operations are protected using seller authentication middleware.

This prevents unauthorized users from performing seller operations such as adding, editing or deleting products.

## 13. Database
MongoDB is used as the database.

The project contains data models for:
- Users
- Products
- Orders

### User Data
- Name
- Email
- Phone
- Password
- Role

Roles include customer and seller.

### Product Data
- Product name
- Category
- Monthly rental price
- Security deposit
- Rental tenure
- Availability
- Product image

### Order Data
- Order ID
- Product information
- Rental amount
- Rental duration
- Deposit
- Total amount
- Payment method
- Customer information
- Delivery information
- Order status

## 14. Project Scope

### Included
- Responsive web platform
- Product catalogue
- Furniture and appliance rentals
- Monthly rental plans
- Rental duration selection
- Cart
- Checkout
- Customer authentication
- Seller authentication
- Product management
- Order management
- MongoDB database

### Not Included
- Native mobile applications
- Cross-border rentals
- Advanced AI-based pricing
- Second-hand resale marketplace

## 15. Benefits
- Affordable rental options
- Flexible rental periods
- Reduced upfront purchasing cost
- Convenient online product selection
- Easier relocation
- Centralized product management
- Secure authentication
- Organized rental order management

## 16. Future Scope
Possible future improvements include:
- Online payment gateway integration
- Delivery tracking
- Automated notifications
- Customer reviews and ratings
- Advanced search and filters
- Mobile application
- Automated rental reminders
- Improved seller analytics
- Location-based product availability

## 17. Conclusion
RentEase provides a practical web-based solution for renting furniture and appliances.

The platform combines a customer rental experience with a secure seller management system. React.js is used for the frontend, Node.js and Express.js handle backend operations, and MongoDB stores application data.

The project demonstrates practical implementation of frontend development, REST APIs, database management, authentication, authorization, product management and order processing.
