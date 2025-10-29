# Appointment Booking System Implementation

## Overview
A complete appointment booking system has been implemented with email notifications, appointment reminders, and a user-friendly interface.

## Features Implemented

### 1. **Book Appointment**
- Users can click on a doctor's card to view details
- Two action buttons appear at the bottom:
  - **Book Appointment** (left) - Opens appointment booking modal
  - **Send Inquiry** (right) - Opens inquiry form
- Appointment booking form collects:
  - Date (with date picker, limited to next 3 months)
  - Time (9 AM - 6 PM)
  - Reason for appointment

### 2. **Email Notifications**

#### To Doctor (Appointment Request):
- Sent when patient books an appointment
- Contains patient information (name, email, phone)
- Shows appointment date, time, and reason
- Includes Accept/Decline buttons (links to frontend)

#### To Patient (Confirmation):
- Sent when doctor accepts the appointment
- Shows appointment details
- Includes preparation checklist
- Confirms appointment is scheduled

#### To Patient (Rejection):
- Sent when doctor declines the appointment
- Suggests alternative actions
- Encourages rebooking

#### To Patient (Reminder):
- Automatically sent 24 hours before appointment
- Includes appointment details
- Shows preparation checklist

### 3. **Appointment Dashboard**
Located in the main dashboard under "Appointments" tab:
- **All Appointments** - Shows all appointments
- **Upcoming** - Shows accepted appointments in the future
- **Pending** - Shows appointments awaiting doctor approval
- **Past** - Shows completed appointments

Features:
- Color-coded status badges (Pending, Accepted, Rejected, Cancelled)
- Appointment cards show:
  - Doctor name and hospital
  - Date and time
  - Reason for visit
  - Status
- Special "Appointment Tomorrow!" badge for next-day appointments
- Cancel button for pending appointments

### 4. **Automatic Reminder System**
- Scheduled task runs every hour
- Checks for appointments in the next 24 hours
- Sends reminder emails automatically
- Marks reminders as sent to avoid duplicates

## Backend Implementation

### Models
**Appointment.java** - Enhanced with:
- `doctorEmail` - For sending notifications
- `reason` - Reason for appointment
- `status` - PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED
- `reminderSent` - Track if reminder was sent

### Services
**AppointmentService.java** - New service for:
- Sending appointment requests
- Sending confirmations
- Sending rejections
- Automated reminder scheduling

**EmailService.java** - Enhanced with:
- `sendAppointmentRequestEmail()` - To doctor
- `sendAppointmentConfirmationEmail()` - To patient
- `sendAppointmentRejectionEmail()` - To patient
- `sendAppointmentReminderEmail()` - To patient

### Controllers
**AppointmentController.java** - Enhanced with:
- `POST /appointments` - Book appointment
- `GET /appointments/my-appointments` - Get user's appointments
- `GET /appointments/accepted-appointments` - Get accepted appointments
- `PUT /appointments/{id}/accept` - Accept appointment (for doctors)
- `PUT /appointments/{id}/reject` - Reject appointment (for doctors)
- `DELETE /appointments/{id}` - Cancel appointment

### Repository
**AppointmentRepository.java** - Enhanced with:
- `findByPatientIdAndStatusIn()` - Filter by multiple statuses
- `findByAppointmentDateTimeBetweenAndStatusAndReminderSent()` - For reminder system

## Frontend Implementation

### Components

#### AppointmentBooking.js
- Modal for booking appointments
- Date and time pickers
- Reason textarea
- Form validation
- API integration

#### Appointments.js
- Full appointments dashboard
- Tab-based filtering
- Appointment cards with status
- Cancel functionality
- Reminder badges

#### DoctorSearch.js (Enhanced)
- Added "Book Appointment" button
- Integrated AppointmentBooking modal
- Maintains existing "Send Inquiry" functionality

#### Dashboard.js (Enhanced)
- Added "Appointments" navigation item
- Added "My Appointments" quick action card
- Integrated Appointments component

### Styling
- **AppointmentBooking.css** - Modal and form styles
- **Appointments.css** - Dashboard and card styles
- **DoctorSearch.css** - Enhanced with action button styles

## Email Configuration

### Required Environment Variables
```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: ${MAIL_USERNAME}
    password: ${MAIL_PASSWORD}
```

### Setup Instructions
1. Use Gmail account
2. Enable 2-factor authentication
3. Generate App Password
4. Set environment variables:
   - `MAIL_USERNAME=your-email@gmail.com`
   - `MAIL_PASSWORD=your-app-password`

## How It Works

### Booking Flow
1. **Patient** clicks on doctor card → Views details
2. **Patient** clicks "Book Appointment" → Fills form
3. **System** creates appointment with status "PENDING"
4. **System** sends email to doctor with Accept/Decline links
5. **Doctor** clicks Accept/Decline in email
6. **System** updates appointment status
7. **System** sends confirmation/rejection email to patient
8. **Patient** views appointment in dashboard

### Reminder Flow
1. **Scheduler** runs every hour
2. **System** finds appointments in next 24 hours with status "ACCEPTED"
3. **System** sends reminder email to patient
4. **System** marks `reminderSent = true`
5. **Patient** receives reminder with preparation checklist

## API Endpoints

### Patient Endpoints
```
POST   /api/v1/appointments                    - Book appointment
GET    /api/v1/appointments/my-appointments    - Get my appointments
GET    /api/v1/appointments/accepted-appointments - Get accepted appointments
DELETE /api/v1/appointments/{id}               - Cancel appointment
```

### Doctor Endpoints (for future implementation)
```
PUT    /api/v1/appointments/{id}/accept        - Accept appointment
PUT    /api/v1/appointments/{id}/reject        - Reject appointment
```

## Database Schema

### Appointments Collection
```javascript
{
  id: String,
  patientId: String,
  patientName: String,
  patientEmail: String,
  patientPhone: String,
  doctorId: String,
  doctorName: String,
  doctorEmail: String,
  hospitalName: String,
  appointmentDateTime: LocalDateTime,
  reason: String,
  status: String, // PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED
  reminderSent: Boolean,
  createdAt: String,
  updatedAt: String
}
```

## Testing

### Test Appointment Booking
1. Login to the application
2. Navigate to "Find Doctors"
3. Click on any doctor card
4. Click "Book Appointment"
5. Fill in date, time, and reason
6. Click "Book Appointment"
7. Check email for confirmation

### Test Appointment Dashboard
1. Navigate to Dashboard
2. Click "Appointments" in sidebar
3. View all appointments
4. Filter by tabs (All, Upcoming, Pending, Past)
5. Cancel a pending appointment

### Test Reminders
1. Book an appointment for tomorrow
2. Wait for the hourly scheduler to run
3. Check email for reminder

## Notes

- Scheduling is enabled in `MinorProjectBackendApplication.java` with `@EnableScheduling`
- Reminders run every hour (configurable in `@Scheduled` annotation)
- Email templates are HTML-formatted with responsive design
- All emails include branding and professional styling
- Dark mode support included in frontend components
- No new issues introduced - all existing functionality preserved

## Future Enhancements

1. **Doctor Portal** - Separate interface for doctors to manage appointments
2. **SMS Notifications** - Add SMS reminders via Twilio
3. **Calendar Integration** - Export to Google Calendar/iCal
4. **Video Consultations** - Integrate video calling
5. **Payment Integration** - Online payment for consultation fees
6. **Prescription Management** - Digital prescriptions after appointments
7. **Appointment History** - Detailed history with notes
8. **Recurring Appointments** - Schedule regular checkups
