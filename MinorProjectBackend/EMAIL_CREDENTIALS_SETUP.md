# 📧 Email Setup - Quick Guide

## Step 1: Get Gmail App Password

1. **Enable 2-Factor Authentication:**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it: "Health Records"
   - Click "Generate"
   - **COPY THE 16-DIGIT PASSWORD** (looks like: abcd efgh ijkl mnop)

## Step 2: Add Your Credentials

**Open this file:**
```
MinorProjectBackend/src/main/resources/application.properties
```

**Find lines 44-45 and replace with YOUR credentials:**

```properties
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_16_DIGIT_APP_PASSWORD
```

**Example:**
```properties
spring.mail.username=john.doe@gmail.com
spring.mail.password=abcd efgh ijkl mnop
```

## Step 3: Restart Backend

```bash
# Stop the current backend (Ctrl+C)
# Then restart:
cd MinorProjectBackend
mvn spring-boot:run
```

## Step 4: Test Email

1. Open http://localhost:3000
2. Login to your account
3. Go to "Find Doctors" or "View Hospitals"
4. Click on any card
5. Click "Send Inquiry" button
6. Fill the form and submit
7. Check your email for confirmation!

---

## ⚠️ Important Notes

- Use the **App Password**, NOT your regular Gmail password
- Remove spaces from the app password (or keep them, both work)
- Make sure 2FA is enabled on your Gmail account
- The email will be sent FROM your Gmail account
- Patients will receive confirmation emails

---

## 🔧 Troubleshooting

**Error: "Authentication failed"**
- Double-check your Gmail address
- Make sure you're using the App Password
- Verify 2FA is enabled

**Error: "Connection timeout"**
- Check your internet connection
- Verify port 587 is not blocked by firewall

**No error but email not sending:**
- Check backend console logs
- Verify Gmail credentials are correct
- Check spam folder for confirmation email

---

## ✅ Once Configured

The email system will:
- ✅ Send inquiry emails to doctors/hospitals
- ✅ Send confirmation emails to patients
- ✅ Include all contact information
- ✅ Use professional HTML templates
- ✅ Handle errors gracefully

---

## 📝 Your Credentials (Fill this out)

**Your Gmail:**
```
_____________________@gmail.com
```

**Your App Password:**
```
____ ____ ____ ____
```

**Paste these into application.properties lines 44-45!**
