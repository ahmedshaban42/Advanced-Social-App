# Advanced Social App

Backend API for a social platform with users, posts, comments, reactions and real-time chat.

## Features
- User auth: JWT, password hashing with bcrypt, email OTP (Nodemailer), Google sign-in (google-auth-library)
- Posts, comments and reactions with pagination (mongoose-paginate-v2)
- Real-time one-to-one chat with Socket.IO, sockets authenticated by access token
- File uploads (Multer) served from `/Assets`
- Joi validation, global error handler, rate limiting (1000 requests per 15 minutes), CORS allow-list

## Tech stack
Node.js, Express, MongoDB with Mongoose, Socket.IO, JWT, bcrypt, Joi, Nodemailer, Multer

## Getting started
1. `git clone https://github.com/ahmedshaban42/Advanced-Social-App.git && cd Advanced-Social-App`
2. `npm install`
3. Create `src/config/.dev.env` (the app loads `src/config/.<NODE_ENV>.env`) with your own values: `PORT`, `FRONTEND_ORIGIN`, MongoDB URI, JWT secrets, email credentials, Google client ID.
4. `npm run start:dev`

## Main route groups
`/auth-user` `/user` `/posts` `/comment` `/react
