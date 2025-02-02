# kdShop - Modern E-Commerce Platform

![KartDukaan Banner](https://via.placeholder.com/1200x400.png?text=KartDukaan+Banner) <!-- Add your banner image -->

A full-stack e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring modern UI/UX, secure payments, and comprehensive admin controls.

[![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue)](https://mern.io/)
[![JWT Auth](https://img.shields.io/badge/Security-JWT%20Auth-red)](https://jwt.io/)
[![Stripe Payments](https://img.shields.io/badge/Payment-Stripe-626CD9)](https://stripe.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Features

### User Features
- **Secure Authentication**: JWT-based signup/login with Bcrypt password hashing
- **Product Catalog**: 100+ products with search, sort, and filter functionality
- **Cart Management**: React-Redux powered cart system with persistent storage
- **Wishlist**: Save favorite products for later
- **Stripe Payments**: Secure payment gateway integration
- **Order Tracking**: Real-time order status updates
- **User Profile**: 
  - Change password functionality
  - Order/payment history
  - Account management
- **Coupon System**: Discount code integration
- **Stock Alerts**: Real-time out-of-stock notifications
- **Responsive UI**: Mobile-first design with Tailwind CSS

### Admin Features
- **Dashboard Analytics**: Sales, user, and product metrics
- **Product Management**: CRUD operations for products
- **User Management**: View/Modify user accounts
- **Order Management**: Update order statuses
- **Coupon System**: Generate and manage discount codes
- **Inventory Control**: Real-time stock updates

## 🛠 Tech Stack

**Frontend**  
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Redux](https://img.shields.io/badge/Redux-764ABC?logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

**Backend**  
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)

**Services**  
![JWT](https://img.shields.io/badge/JWT-000000?logo=json-web-tokens&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?logo=stripe&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

## 🚀 Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/kartdukaan.git
   cd kartdukaan