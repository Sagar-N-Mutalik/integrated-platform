# 📧 Email Setup Instructions

## Gmail SMTP Configuration

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click on "2-Step Verification"
4. Follow the prompts to enable 2FA

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" as the app
3. Select "Other (Custom name)" as the device
4. Enter "Health Records Backend" as the name
5. Click "Generate"
6. **Copy the 16-digit password** (you won't see it again!)

### Step 3: Add Credentials to application.properties

**Option A: Direct in application.properties**
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-16-digit-app-password
```

**Option B: Using Environment Variables (Recommended)**
1. Create a `.env` file in `MinorProjectBackend/` directory
2. Add your credentials:
```
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=abcd efgh ijkl mnop
```

### Step 4: Paste Your Credentials Here

**Your Gmail:**
```
MAIL_USERNAME=_____________________@gmail.com
```

**Your App Password (16 digits):**
```
MAIL_PASSWORD=____ ____ ____ ____
```

---

## Testing the Email Functionality

### 1. Start the Backend
```bash
cd MinorProjectBackend
mvn spring-boot:run
```

### 2. Test Email Endpoint
```bash
curl -X POST http://localhost:8080/api/v1/email/send-inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "recipientEmail": "doctor@hospital.com",
    "recipientName": "Dr. John Doe",
    "patientName": "Jane Smith",
    "patientEmail": "jane@example.com",
    "patientPhone": "+91 9876543210",
    "message": "I would like to schedule an appointment for a general checkup.",
    "recipientType": "doctor"
  }'
```

### 3. Test from Frontend
1. Open http://localhost:3000
2. Login to your account
3. Navigate to "Find Doctors" or "View Hospitals"
4. Click on any doctor/hospital card
5. Click "Send Inquiry" button
6. Fill in the form and submit

---

## Email Features

### For Patients:
- ✅ Send inquiries to doctors/hospitals
- ✅ Receive confirmation email
- ✅ Professional email templates
- ✅ Contact information included

### For Doctors/Hospitals:
- ✅ Receive patient inquiries
- ✅ Patient contact details included
- ✅ Professional email format
- ✅ Direct reply capability

---

## Email Templates

### Inquiry Email (to Doctor/Hospital)
- Patient name, email, and phone
- Patient's message/inquiry
- Professional formatting
- Reply-to patient email

### Confirmation Email (to Patient)
- Confirmation of sent inquiry
- Recipient name
- Expected response time
- Next steps information

---

## Troubleshooting

### Error: "Failed to send email"
**Possible causes:**
1. Incorrect Gmail credentials
2. App password not generated
3. 2FA not enabled
4. Network/firewall blocking SMTP

**Solutions:**
1. Double-check your Gmail and app password
2. Regenerate app password
3. Enable 2FA on Google account
4. Check firewall settings for port 587

### Error: "Authentication failed"
- Make sure you're using the **App Password**, not your regular Gmail password
- App password should be 16 characters (4 groups of 4)
- Remove any spaces when pasting

### Error: "Connection timeout"
- Check your internet connection
- Verify port 587 is not blocked
- Try using port 465 (SSL) instead

---

## Security Best Practices

1. ✅ **Never commit credentials** to Git
2. ✅ Use environment variables
3. ✅ Add `.env` to `.gitignore`
4. ✅ Use different credentials for production
5. ✅ Rotate app passwords regularly
6. ✅ Monitor email sending logs

---

## Alternative Email Providers

### SendGrid
```properties
spring.mail.host=smtp.sendgrid.net
spring.mail.port=587
spring.mail.username=apikey
spring.mail.password=your-sendgrid-api-key
```

### Mailgun
```properties
spring.mail.host=smtp.mailgun.org
spring.mail.port=587
spring.mail.username=postmaster@your-domain.mailgun.org
spring.mail.password=your-mailgun-password
```

### AWS SES
```properties
spring.mail.host=email-smtp.us-east-1.amazonaws.com
spring.mail.port=587
spring.mail.username=your-aws-smtp-username
spring.mail.password=your-aws-smtp-password
```

---

## Current Configuration

**SMTP Server:** smtp.gmail.com
**Port:** 587 (TLS)
**Authentication:** Required
**From Email:** Configured in application.properties
**From Name:** Secured Health Records

---

## Need Help?

If you're having trouble setting up email:
1. Check the backend logs for detailed error messages
2. Verify your Gmail settings
3. Test with a simple email client first
4. Check Spring Boot mail documentation

---

## Status

- ✅ Email service created
- ✅ API endpoint configured
- ✅ Frontend integration complete
- ✅ Email templates designed
- ⏳ **Waiting for your Gmail credentials**

Once you provide your credentials, the email functionality will be fully operational!
