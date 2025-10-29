# 🚀 Quick Start - Appointment System

## ✅ What You Have Now

The appointment booking system is **fully implemented** and ready to use! Here's what works:

### UI Features ✨
- ✅ "Book Appointment" button on doctor cards (green, left side)
- ✅ "Send Inquiry" button on doctor cards (purple, right side)
- ✅ Professional booking modal with date/time pickers
- ✅ Appointments dashboard in main navigation
- ✅ View all appointments with filtering
- ✅ Color-coded status badges
- ✅ Reminder badges for tomorrow's appointments

### Backend Features 🔧
- ✅ Appointment booking API
- ✅ Email notification system
- ✅ Automatic reminder scheduler (runs every hour)
- ✅ Accept/Reject appointment endpoints

## ⚠️ What's Missing: Email Configuration

**The ONLY thing preventing emails from sending is the Gmail configuration.**

## 🔥 Fix Email in 3 Steps (5 Minutes)

### Step 1: Get Gmail App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2-Factor Authentication if not already enabled
3. Generate App Password for "Mail" on "Windows Computer"
4. Copy the 16-character password

### Step 2: Set Environment Variables
Open PowerShell and run:
```powershell
$env:MAIL_USERNAME="youremail@gmail.com"
$env:MAIL_PASSWORD="abcdefghijklmnop"  # Your app password (no spaces)
```

### Step 3: Restart Backend
```powershell
cd MinorProjectBackend
mvn spring-boot:run
```

## 🧪 Test Email Setup

### Option 1: Use Test Page
1. Open `test-email.html` in your browser
2. Click "Check Email Config"
3. Enter your email and click "Send Test Email"
4. Check your inbox (and spam folder)

### Option 2: Use API Directly
```
GET http://localhost:8080/api/v1/email-test/status
GET http://localhost:8080/api/v1/email-test/send?to=youremail@gmail.com
```

### Option 3: Book Real Appointment
1. Go to "Find Doctors" in the app
2. Click on any doctor
3. Click "Book Appointment"
4. Fill the form and submit
5. Check backend console for: `✅ Appointment request email sent`

## 📍 Where to Find Appointment Details

### In the UI:
1. **Dashboard** → Click "Appointments" in sidebar
2. Or click "My Appointments" quick action card
3. Filter by: All, Upcoming, Pending, Past

### Via API:
```
GET http://localhost:8080/api/v1/appointments/my-appointments
GET http://localhost:8080/api/v1/appointments/accepted-appointments
```

### In Database:
```javascript
// MongoDB
use secured_health_records
db.appointments.find().pretty()
```

## 🎯 How It Works

### Booking Flow:
```
1. Patient clicks doctor → "Book Appointment"
2. Fills form (date, time, reason)
3. Submits → Status: PENDING
4. Email sent to doctor with Accept/Decline buttons
5. Doctor responds → Status: ACCEPTED or REJECTED
6. Email sent to patient with confirmation
7. 24h before → Reminder email sent automatically
```

### Email Flow:
```
Appointment Booked
    ↓
📧 Email to Doctor (with Accept/Decline buttons)
    ↓
Doctor Accepts
    ↓
📧 Email to Patient (confirmation)
    ↓
24 Hours Before
    ↓
📧 Email to Patient (reminder)
```

## 🔍 Troubleshooting

### "Email not sending"
- ✅ Check: Environment variables set?
- ✅ Check: Using App Password (not regular password)?
- ✅ Check: 2FA enabled on Gmail?
- ✅ Check: Backend console for error messages

### "Can't see appointments"
- ✅ Check: Logged in as the user who booked?
- ✅ Check: Backend running on port 8080?
- ✅ Check: MongoDB running on port 27017?
- ✅ Check: Browser console for errors

### "Doctor email not found"
- ✅ System auto-generates: `firstname.lastname@hospitalname.com`
- ✅ To add real emails: Update Doctor model in database
- ✅ Or add email field when creating doctors

## 📁 Important Files

### Backend:
- `AppointmentService.java` - Email logic
- `AppointmentController.java` - API endpoints
- `EmailService.java` - Email templates
- `application.yml` - Email configuration

### Frontend:
- `AppointmentBooking.js` - Booking modal
- `Appointments.js` - Appointments dashboard
- `DoctorSearch.js` - Doctor cards with buttons
- `Dashboard.js` - Navigation integration

### Testing:
- `test-email.html` - Email configuration tester
- `EmailTestController.java` - Test API endpoints

### Documentation:
- `EMAIL_SETUP_GUIDE.md` - Detailed email setup
- `APPOINTMENT_BOOKING_IMPLEMENTATION.md` - Full technical docs
- `APPOINTMENT_VISUAL_GUIDE.md` - UI/UX guide

## ✅ Verification Checklist

- [ ] Backend compiles successfully
- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] MongoDB running on port 27017
- [ ] Email credentials configured
- [ ] Test email sent successfully
- [ ] Can book appointment from UI
- [ ] Can view appointments in dashboard
- [ ] Backend logs show email success

## 🎉 You're Ready!

Once email is configured, everything works automatically:
- ✅ Appointment requests sent to doctors
- ✅ Confirmations sent to patients
- ✅ Reminders sent 24 hours before
- ✅ All emails logged in console
- ✅ Professional HTML email templates
- ✅ Mobile-responsive UI
- ✅ Dark mode support

## 📞 Quick Commands

### Start Backend:
```powershell
cd MinorProjectBackend
mvn spring-boot:run
```

### Start Frontend:
```powershell
cd minor-project-frontend
npm start
```

### Check Email Config:
```powershell
echo $env:MAIL_USERNAME
echo $env:MAIL_PASSWORD
```

### Set Email Config:
```powershell
$env:MAIL_USERNAME="youremail@gmail.com"
$env:MAIL_PASSWORD="your-app-password"
```

### Test Email:
Open browser: `test-email.html`

## 🚀 Next Steps

1. **Configure email** (5 minutes)
2. **Test with test-email.html**
3. **Book a real appointment**
4. **Check your inbox**
5. **Done!** 🎉

---

**Need help?** Check `EMAIL_SETUP_GUIDE.md` for detailed instructions.
