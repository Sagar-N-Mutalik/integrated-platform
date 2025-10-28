# 🚀 How to Start the Backend Server

## Quick Start

### Option 1: Using Maven (Recommended)

Open a **new terminal** and run:

```bash
cd MinorProjectBackend
mvn spring-boot:run
```

### Option 2: Using the Pre-built JAR

```bash
cd MinorProjectBackend
java -jar target\secured-health-records-backend-0.0.1-SNAPSHOT.jar
```

---

## ✅ How to Know Backend is Running

You should see output like:

```
🚀 Secured Health Records Backend API is running!
📋 API Documentation: http://localhost:8080/api/v1/swagger-ui.html
🔒 Security: JWT Authentication enabled
📧 Email: SMTP configured for OTP and notifications
🗄️  Database: MongoDB connection established
```

---

## 🔍 Verify Backend is Working

Open your browser and go to:
- **API Base**: http://localhost:8080/api/v1
- **Swagger UI**: http://localhost:8080/api/v1/swagger-ui.html
- **Test Endpoint**: http://localhost:8080/api/v1/search/hospitals

---

## ⚠️ Troubleshooting

### Problem: Port 8080 already in use

**Solution**: Kill the process using port 8080

**Windows:**
```bash
netstat -ano | findstr :8080
taskkill /F /PID <PID_NUMBER>
```

**Then restart the backend**

---

### Problem: MongoDB connection failed

**Solution**: Start MongoDB service

**Windows:**
```bash
net start MongoDB
```

Or if MongoDB is installed manually:
```bash
mongod --dbpath "C:\data\db"
```

---

### Problem: Environment variables not found

**Solution**: Make sure `.env` file exists in `MinorProjectBackend/` folder

Required variables:
```properties
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=dy5wk8uup
CLOUDINARY_API_KEY=925261555794748
CLOUDINARY_API_SECRET=PTxMbrV0xcI7M0Bj8j9uhuFnIfE
MONGODB_URI=mongodb://localhost:27017/secured_health_records
```

---

## 📱 Frontend Connection

Once backend is running, the frontend will automatically connect to:
- **Doctors API**: http://localhost:8080/api/v1/search/doctors
- **Hospitals API**: http://localhost:8080/api/v1/search/hospitals

---

## 🎯 Quick Test

After starting backend, test in browser:

1. **Test Hospitals**: http://localhost:8080/api/v1/search/hospitals
2. **Test Doctors**: http://localhost:8080/api/v1/search/doctors

You should see JSON data returned!

---

## 💡 Tips

1. **Keep backend terminal open** - Don't close it while using the app
2. **Check logs** - Backend terminal shows all API requests
3. **MongoDB must be running** - Backend needs database connection
4. **Port 8080 must be free** - No other app should use this port

---

## ✅ Success Checklist

- [ ] MongoDB is running
- [ ] Backend started without errors
- [ ] Can access http://localhost:8080/api/v1/swagger-ui.html
- [ ] Frontend shows doctors/hospitals (not "could not connect")

---

**Need help?** Check the backend terminal for error messages!
