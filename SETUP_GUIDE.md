# Secured Health Records Using AI - Complete Setup Guide

## Project Overview
This is a full-stack web application for managing secured health records using AI. The project consists of:
- **Backend**: Spring Boot REST API with MongoDB, JWT authentication, file upload, and email services
- **Frontend**: React.js application with modern UI components

## Prerequisites
Before running this project, ensure you have the following installed:

### Required Software
1. **Java 21** - [Download from Oracle](https://www.oracle.com/java/technologies/downloads/)
2. **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
3. **MongoDB** - [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
4. **Maven 3.6+** - [Download from Apache Maven](https://maven.apache.org/download.cgi)

### Optional but Recommended
- **MongoDB Compass** - GUI for MongoDB
- **Postman** - For API testing

## Setup Instructions

### 1. Clone and Navigate to Project
```bash
cd "C:\Users\sagar\Downloads\Secured-Health-Records-Using-AI-main"
```

### 2. Backend Setup

#### Step 2.1: Create Development Configuration
Create the file `MinorProjectBackend/src/main/resources/application-dev.properties` with the following content:

```properties
# Development Environment Configuration
# MongoDB Configuration (Local)
spring.data.mongodb.uri=mongodb://localhost:27017/secured_health_records_dev

# JWT Configuration
jwt.secret=dev-secret-key-change-this-for-production-use-at-least-256-bits-long
jwt.expiration=86400000

# Cloudinary Configuration (Optional - for file storage)
cloudinary.cloud-name=your-cloud-name
cloudinary.api-key=your-api-key
cloudinary.api-secret=your-api-secret

# MailerSend Configuration (Optional - for email)
mailersend.api-key=your-mailersend-api-key
mailersend.from-email=noreply@yourdomain.com
mailersend.from-name=Secured Health Records

# CORS Configuration
cors.allowed-origins=http://localhost:3000,http://localhost:3001

# Frontend URL
frontend.url=http://localhost:3000

# Logging Configuration
logging.level.com.securedhealthrecords=DEBUG
logging.level.org.springframework.security=DEBUG
```

#### Step 2.2: Start MongoDB
```bash
# Start MongoDB service (Windows)
net start MongoDB

# Or if using MongoDB installed manually, navigate to MongoDB bin directory and run:
mongod --dbpath "C:\data\db"
```

#### Step 2.3: Build and Run Backend
```bash
cd MinorProjectBackend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080/api/v1`

### 3. Frontend Setup

#### Step 3.1: Install Dependencies
```bash
cd minor-project-frontend
npm install
```

#### Step 3.2: Start Frontend Development Server
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Usage Guide

### 1. Access the Application
Open your browser and navigate to `http://localhost:3000`

### 2. User Registration/Login
1. **Sign Up**: Click "Sign Up" to create a new account
   - Enter full name, email, and password
   - OTP verification will be sent to email (if email service is configured)
   
2. **Login**: Use your credentials to log in
   - JWT token will be stored for authentication

### 3. Main Features

#### File Management
- **Upload Files**: Click "Upload" button to upload medical records
- **Create Folders**: Organize files in folders
- **Download Files**: Click on files to download/view
- **Delete Files**: Use delete button to remove files

#### File Sharing
- **Share Files**: Click share button on any file
- **Set Access Duration**: Choose how long the recipient can access
- **Email Notifications**: Recipients get email with secure link

#### Hospital Directory
- **View Hospitals**: Browse registered hospitals
- **Hospital Profiles**: View hospital information and services

### 4. API Documentation
Once the backend is running, access Swagger UI at:
`http://localhost:8080/api/v1/swagger-ui.html`

## Configuration Details

### Environment Variables (Optional)
You can set these environment variables instead of hardcoding in properties files:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/secured_health_records

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# Cloudinary (for file storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service
MAILERSEND_API_KEY=your-api-key
MAILERSEND_FROM_EMAIL=noreply@yourdomain.com
```

### Database Setup
The application will automatically create the MongoDB database and collections on first run.

### File Storage
- **Local Development**: Files are stored using Cloudinary (cloud storage)
- **Production**: Configure Cloudinary credentials for production use

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Backend (8080): Change `server.port` in application.properties
   - Frontend (3000): Use `npm start -- --port 3001`

2. **MongoDB Connection Issues**
   - Ensure MongoDB service is running
   - Check MongoDB URI in configuration
   - Verify MongoDB is accessible on port 27017

3. **CORS Issues**
   - Ensure frontend URL is in `cors.allowed-origins`
   - Check that both servers are running

4. **JWT Authentication Issues**
   - Clear browser localStorage
   - Check JWT secret configuration
   - Verify token expiration settings

5. **File Upload Issues**
   - Configure Cloudinary credentials
   - Check file size limits (max 50MB)
   - Verify internet connection for cloud storage

### Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **Logging**: Check console logs for debugging information
3. **Database**: Use MongoDB Compass to view database contents
4. **API Testing**: Use Postman with the Swagger documentation

## Production Deployment

### Backend Deployment
1. Create `application-prod.properties` with production configurations
2. Set `spring.profiles.active=prod`
3. Use environment variables for sensitive data
4. Deploy to cloud platform (AWS, Azure, etc.)

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Update API base URL for production backend

## Security Considerations

1. **JWT Secret**: Use a strong, unique secret key (256+ bits)
2. **Database**: Secure MongoDB with authentication
3. **HTTPS**: Use HTTPS in production
4. **Environment Variables**: Never commit sensitive data to version control
5. **File Upload**: Validate file types and sizes
6. **CORS**: Configure appropriate origins for production

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review application logs
3. Test API endpoints using Swagger UI
4. Verify all prerequisites are installed correctly

---

**Note**: This application is designed for educational/development purposes. For production use, implement additional security measures and proper deployment practices.
