# 🔍 File Upload Debug Guide

## 🚨 **DEBUGGING STEPS**

### 1. **Check Backend Status**
First, verify your backend is running:
```
Visit: http://localhost:8080/api/v1/test/data-count
```

### 2. **Check Browser Console**
Open browser DevTools (F12) and look for:
- Network tab: Check if upload request is being sent
- Console tab: Look for error messages

### 3. **Check Backend Console**
Look for these messages in your Spring Boot console:
```
📥 FileController: Upload request received
   File: your-file.pdf
   Size: 1048576 bytes
   User ID: user123
```

## 🔧 **COMMON ISSUES & FIXES**

### **Issue A: Authentication Error**
**Symptoms**: 401 Unauthorized or 403 Forbidden
**Fix**: Check if user is logged in and token is valid
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

### **Issue B: CORS Error**
**Symptoms**: CORS policy error in browser console
**Fix**: Backend should have CORS enabled (already configured)

### **Issue C: File Size Error**
**Symptoms**: "File size exceeds 50MB limit"
**Fix**: Try with a smaller file (< 50MB)

### **Issue D: Backend Not Running**
**Symptoms**: Network error, connection refused
**Fix**: Start backend with `./mvnw spring-boot:run`

### **Issue E: MongoDB Not Connected**
**Symptoms**: Database connection errors
**Fix**: Start MongoDB service

## 🧪 **QUICK TESTS**

### Test 1: Simple Upload via Postman/curl
```bash
curl -X POST http://localhost:8080/api/v1/files/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.txt" \
  -F "userId=YOUR_USER_ID"
```

### Test 2: Check File Permissions
Make sure the `uploads` directory is writable:
```bash
mkdir -p uploads/health_records
chmod 755 uploads
```

### Test 3: Test with Small File
Try uploading a small text file first (< 1MB)

## 🎯 **EXPECTED FLOW**

1. **Frontend**: User selects file
2. **Frontend**: Creates FormData with file + userId
3. **Frontend**: Sends POST to `/api/v1/files/upload`
4. **Backend**: Receives request, validates file
5. **Backend**: Tries Cloudinary upload (fails gracefully)
6. **Backend**: Falls back to local storage
7. **Backend**: Saves file record to MongoDB
8. **Backend**: Returns file record with URL
9. **Frontend**: Updates file list and shows success

## 🔍 **DEBUG CHECKLIST**

- [ ] Backend running on port 8080
- [ ] MongoDB running and connected
- [ ] User logged in with valid token
- [ ] File size < 50MB
- [ ] Browser console shows no CORS errors
- [ ] Backend console shows upload request received
- [ ] `uploads` directory exists and is writable

## 🚀 **IMMEDIATE FIX**

If nothing works, try this simple test:
1. **Restart backend**: `./mvnw spring-boot:run`
2. **Clear browser cache**: Ctrl+Shift+R
3. **Try small file**: Upload a simple .txt file
4. **Check both consoles**: Browser DevTools + Backend terminal

Let me know what errors you see in the console! 🎯