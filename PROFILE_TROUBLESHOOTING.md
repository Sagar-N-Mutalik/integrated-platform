# Profile Page Troubleshooting Guide

## Issue: "Profile not found" Error

### Quick Fixes:

### 1. Check Backend is Running
```powershell
# Backend should be running on port 8080
# Check if you can access: http://localhost:8080/api/v1/users/me
```

### 2. Check Authentication Token
Open browser console (F12) and check:
```javascript
localStorage.getItem('token')
// Should return a JWT token string
```

If token is missing:
- Logout and login again
- Token might have expired

### 3. Test API Directly
Open browser console and run:
```javascript
fetch('/api/v1/users/me', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
})
.then(r => r.json())
.then(data => console.log('Profile data:', data))
.catch(err => console.error('Error:', err));
```

### 4. Check MongoDB Data
In MongoDB Compass:
1. Connect to `mongodb://localhost:27017`
2. Open database: `secured_health_records`
3. Open collection: `users`
4. Find your user by email
5. Check if the document exists

### 5. Restart Frontend
```powershell
cd minor-project-frontend
# Stop the server (Ctrl+C)
npm start
```

## Issue: Settings Button Says "VIEW PROFILE" Instead of "EDIT PROFILE"

✅ **FIXED**: Updated Dashboard.js to show "Edit Profile"

## Issue: Profile Edit Not Saving

### Check These:

1. **Backend Running**: Port 8080
2. **Token Valid**: Check localStorage
3. **Network Tab**: Check if PUT request is sent
4. **Response**: Check if 200 OK or error

### Test Save Manually:
```javascript
// In browser console
const profileData = {
    fullName: "Test Name",
    age: 25,
    gender: "Male",
    phone: "+91 9876543210"
};

fetch('/api/v1/users/me', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(profileData)
})
.then(r => r.json())
.then(data => console.log('Updated:', data))
.catch(err => console.error('Error:', err));
```

## Common Issues & Solutions

### Issue: 404 Not Found
**Cause**: Backend not running or wrong URL
**Solution**: 
- Start backend: `cd MinorProjectBackend && mvn spring-boot:run`
- Check proxy in package.json: `"proxy": "http://localhost:8080"`

### Issue: 401 Unauthorized
**Cause**: Invalid or expired token
**Solution**: 
- Logout and login again
- Check token in localStorage

### Issue: 500 Internal Server Error
**Cause**: Backend error
**Solution**: 
- Check backend console for errors
- Check MongoDB is running
- Check user exists in database

### Issue: CORS Error
**Cause**: CORS not configured
**Solution**: 
- Backend should have `@CrossOrigin(origins = "*")` on controllers
- Or use proxy in package.json (already configured)

## Debug Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] MongoDB running on port 27017
- [ ] User logged in (token in localStorage)
- [ ] User exists in MongoDB users collection
- [ ] Browser console shows no errors
- [ ] Network tab shows API calls being made
- [ ] Proxy configured in package.json

## Quick Test Commands

### Test Backend Health:
```powershell
curl http://localhost:8080/api/v1/users/me -H "Authorization: Bearer YOUR_TOKEN"
```

### Check MongoDB:
```powershell
mongosh
use secured_health_records
db.users.find().pretty()
```

### Check Frontend Proxy:
```javascript
// In browser console
fetch('/api/v1/users/me')
  .then(r => console.log('Status:', r.status))
```

## Expected Behavior

### Profile View:
1. Click profile icon/name in sidebar
2. See profile page with:
   - Avatar
   - Name and email
   - Statistics (files, appointments)
   - Personal information
   - "Edit Profile" button

### Profile Edit:
1. Click "Edit Profile" button
2. Form appears with all fields
3. Make changes
4. Click "Save Changes"
5. See success toast
6. Return to view mode
7. Changes are saved

## Still Not Working?

### Check Backend Logs:
Look for errors in the backend console when accessing `/api/v1/users/me`

### Check Frontend Console:
Look for:
- Network errors
- API response errors
- JavaScript errors

### Verify User Data:
In MongoDB, your user document should look like:
```json
{
  "_id": "ObjectId(...)",
  "fullName": "Your Name",
  "email": "your@email.com",
  "password": "$2a$10...",
  "createdAt": "2025-01-28T...",
  "age": null,
  "gender": null,
  "phone": null,
  "_class": "com.securedhealthrecords.model.User"
}
```

## Manual Fix: Add Profile Fields to Existing Users

If your users don't have the profile fields, add them manually in MongoDB:

```javascript
// In MongoDB Compass or mongosh
db.users.updateMany(
  {},
  {
    $set: {
      age: null,
      gender: null,
      phone: null,
      notificationsEnabled: true
    }
  }
)
```

## Contact Points

If still having issues, check:
1. Backend console output
2. Frontend browser console
3. Network tab in browser DevTools
4. MongoDB Compass to verify data
