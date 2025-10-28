package com.securedhealthrecords.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${mail.from.email:noreply@healthrecords.com}")
    private String fromEmail;

    @Value("${mail.from.name:Secured Health Records}")
    private String fromName;

    /**
     * Send inquiry email to hospital/doctor
     */
    public void sendInquiryEmail(String toEmail, String toName, String patientName, 
                                  String patientEmail, String patientPhone, String message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(toEmail);
            helper.setSubject("New Patient Inquiry - " + patientName);
            helper.setText(buildInquiryEmailContent(toName, patientName, patientEmail, patientPhone, message), true);

            mailSender.send(mimeMessage);
            log.info("✅ Inquiry email sent successfully to: {}", toEmail);
        } catch (MessagingException e) {
            log.error("❌ Failed to send inquiry email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        } catch (Exception e) {
            log.error("❌ Unexpected error sending email: {}", e.getMessage());
            throw new RuntimeException("Failed to send email: " + e.getMessage());
        }
    }

    /**
     * Send confirmation email to patient
     */
    public void sendConfirmationEmail(String patientEmail, String patientName, String recipientName) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(patientEmail);
            helper.setSubject("Inquiry Sent Successfully");
            helper.setText(buildConfirmationEmailContent(patientName, recipientName), true);

            mailSender.send(mimeMessage);
            log.info("✅ Confirmation email sent successfully to: {}", patientEmail);
        } catch (Exception e) {
            log.error("❌ Failed to send confirmation email: {}", e.getMessage());
            // Don't throw exception for confirmation email failure
        }
    }

    private String buildInquiryEmailContent(String toName, String patientName, 
                                             String patientEmail, String patientPhone, String message) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 30px;
                        border-radius: 10px 10px 0 0;
                        text-align: center;
                    }
                    .content {
                        background: #f8f9fa;
                        padding: 30px;
                        border-radius: 0 0 10px 10px;
                    }
                    .info-box {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 20px 0;
                        border-left: 4px solid #667eea;
                    }
                    .info-row {
                        margin: 10px 0;
                        padding: 8px 0;
                        border-bottom: 1px solid #e9ecef;
                    }
                    .info-row:last-child {
                        border-bottom: none;
                    }
                    .label {
                        font-weight: bold;
                        color: #667eea;
                        display: inline-block;
                        width: 120px;
                    }
                    .message-box {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 20px 0;
                        border: 1px solid #dee2e6;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #dee2e6;
                        color: #6c757d;
                        font-size: 14px;
                    }
                    .button {
                        display: inline-block;
                        padding: 12px 30px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        text-decoration: none;
                        border-radius: 6px;
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🏥 New Patient Inquiry</h1>
                    <p>You have received a new inquiry from a patient</p>
                </div>
                <div class="content">
                    <p>Dear %s,</p>
                    <p>A patient has reached out to you through the Secured Health Records platform.</p>
                    
                    <div class="info-box">
                        <h3>Patient Information</h3>
                        <div class="info-row">
                            <span class="label">Name:</span>
                            <span>%s</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Email:</span>
                            <span><a href="mailto:%s">%s</a></span>
                        </div>
                        <div class="info-row">
                            <span class="label">Phone:</span>
                            <span><a href="tel:%s">%s</a></span>
                        </div>
                    </div>
                    
                    <div class="message-box">
                        <h3>Message</h3>
                        <p>%s</p>
                    </div>
                    
                    <p>You can reply directly to the patient using the contact information provided above.</p>
                    
                    <div class="footer">
                        <p>This email was sent from Secured Health Records Platform</p>
                        <p>© 2025 Secured Health Records. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(toName, patientName, patientEmail, patientEmail, 
                         patientPhone, patientPhone, message);
    }

    private String buildConfirmationEmailContent(String patientName, String recipientName) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white;
                        padding: 30px;
                        border-radius: 10px 10px 0 0;
                        text-align: center;
                    }
                    .content {
                        background: #f8f9fa;
                        padding: 30px;
                        border-radius: 0 0 10px 10px;
                    }
                    .success-icon {
                        font-size: 48px;
                        margin-bottom: 10px;
                    }
                    .info-box {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        margin: 20px 0;
                        border-left: 4px solid #10b981;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #dee2e6;
                        color: #6c757d;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="success-icon">✅</div>
                    <h1>Inquiry Sent Successfully</h1>
                </div>
                <div class="content">
                    <p>Dear %s,</p>
                    <p>Your inquiry has been successfully sent to <strong>%s</strong>.</p>
                    
                    <div class="info-box">
                        <h3>What happens next?</h3>
                        <ul>
                            <li>The healthcare provider will receive your inquiry via email</li>
                            <li>They will review your message and contact you directly</li>
                            <li>You should expect a response within 24-48 hours</li>
                        </ul>
                    </div>
                    
                    <p>If you don't receive a response within 48 hours, please try contacting them directly using the phone number provided on their profile.</p>
                    
                    <div class="footer">
                        <p>Thank you for using Secured Health Records Platform</p>
                        <p>© 2025 Secured Health Records. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(patientName, recipientName);
    }
}
