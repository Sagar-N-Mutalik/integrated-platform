# Email Setup Guide - Quick Fix

## 🚨 Why Emails Aren't Sending

Your email credentials are not configured. The system needs a Gmail account with an App Password.

## ✅ Quick Setup (5 Minutes)

### Step 1: Get Gmail App Password

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Enable 2-Factor Authentication** (if not already enabled):
   - Go to Security → 2-Step Verification
   - Follow the setup process

3. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
   - Select app: **Mail**
   - Select device: **Windows Computer**
   - Click **Generate**
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Configure Backend

**Option A: Environment Variables (Recommended for Production)**

In PowerShell (before starting backend):
```powershell
$env:MAIL_USERNAME="youremail@gmail.com"
$env:MAIL_PASSWORD="abcdefghijklmnop"  # Your 16-char app password (no spaces)

# Then start backend
cd MinorProjectBackend
mvn spring-boot:run
```

**Option B: Direct Configuration (Quick Testing)**

Edit `MinorProjectBackend/src/main/resources/application.yml`:

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: youremail@gmail.com        # Replace with your email
    password: abcdefghijklmnop            # Replace with your app password
```

⚠️ **Important**: Don't commit this file with real credentials!

### Step 3: Restart Backend

```powershell
cd MinorProjectBackend
mvn spring-boot:run
```

### Step 4: Test Email

1. Book an appointment from the UI
2. Check backend console for email logs:
   - ✅ Success: `✅ Appointment request email sent to doctor`
   - ❌ Error: `❌ Failed to send appointment request email`

## 🔍 Troubleshooting

### Error: "Authentication failed"
- **Cause**: Wrong password or 2FA not enabled
- **Fix**: 
  - Make sure you're using the App Password, not your regular Gmail password
  - Enable 2-Factor Authentication first
  - Generate a new App Password

### Error: "Connection timeout"
- **Cause**: Firewall or network issue
- **Fix**: 
  - Check if port 587 is open
  - Try using port 465 with SSL instead:
    ```yaml
    port: 465
    properties:
      mail:
        smtp:
          ssl:
            enable: true
    ```

### Error: "Username and Password not accepted"
- **Cause**: Less secure app access disabled
- **Fix**: Use App Password (not regular password)

### Emails Not Received
- **Check**: Spam/Junk folder
- **Check**: Backend console for errors
- **Check**: Email address is correct

## 📧 Where Doctor Emails Come From

### Current Implementation:
The system generates doctor emails automatically if not in database:

```javascript
// Format: firstname.lastname@hospitalname.com
// Example: dr.john.smith@cityhospital.com
```

### To Add Real Doctor Emails:

**Option 1: Update Database Directly**
```javascript
// In MongoDB
db.doctors.updateMany(
  {},
  { $set: { email: "doctor@hospital.com" } }
)
```

**Option 2: Add to Data Seeder**
Edit `DataSeeder.java` to include email field when creating doctors.

**Option 3: Manual Entry**
Add email field when creating new doctors through admin panel.

## 🎯 Quick Test Without Real Email

For testing without setting up email, you can:

1. **Check Backend Logs**: Emails are logged even if not sent
2. **Use MailHog** (local email testing):
   ```powershell
   # Install MailHog
   # Update application.yml:
   spring:
     mail:
       host: localhost
       port: 1025
   ```
3. **Mock Email Service**: Comment out email sending temporarily

## ✅ Verification Checklist

- [ ] 2-Factor Authentication enabled on Gmail
- [ ] App Password generated (16 characters)
- [ ] Environment variables set OR application.yml updated
- [ ] Backend restarted
- [ ] Test appointment booked
- [ ] Check backend console for success message
- [ ] Check email inbox (and spam folder)

## 📝 Example Configuration

### Working Configuration:
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: healthrecords@gmail.com
    password: abcd efgh ijkl mnop  # App password (spaces removed in actual use)
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
            required: true
```

### Environment Variables:
```powershell
# Set these in PowerShell
$env:MAIL_USERNAME="healthrecords@gmail.com"
$env:MAIL_PASSWORD="abcdefghijklmnop"

# Verify they're set
echo $env:MAIL_USERNAME
echo $env:MAIL_PASSWORD
```

## 🚀 After Setup

Once configured, the system will automatically:
- ✅ Send appointment requests to doctors
- ✅ Send confirmations to patients
- ✅ Send reminders 24 hours before appointments
- ✅ Log all email activities in console

## 📞 Need Help?

Check backend console for detailed error messages:
```
❌ Failed to send appointment request email: [error details]
```

Common issues are usually:
1. Wrong password (use App Password, not regular password)
2. 2FA not enabled
3. Firewall blocking port 587
