import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
      ...options
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendRegistrationEmail = async (name: string, email: string, password: string): Promise<void> => {
  const subject = 'Welcome to Flight Booking System - Your Account Details';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Welcome to Flight Booking System!</h2>
      <p>Dear ${name},</p>
      <p>Thank you for registering with our Flight Booking System. Your account has been successfully created.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Your Account Details:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>
      </div>

      <p style="color: #e74c3c; font-weight: bold;">Please keep your credentials safe and secure.</p>
      <p>You can now log in to your account and start booking flights.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p>Best regards,<br>${process.env.EMAIL_FROM_NAME}</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject,
    html
  });
};

export const sendOTPEmail = async (name: string, email: string, otp: string): Promise<void> => {

  const subject = 'Profile Update Verification - OTP';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2c3e50;">Profile Update Verification</h2>
      <p>Dear ${name},</p>
      <p>You have requested to update your profile. Please use the following OTP to verify your identity:</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
        <h3 style="color: #2c3e50; margin-top: 0;">Your OTP</h3>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">${otp}</p>
        <p style="color: #e74c3c; font-size: 12px;">This OTP will expire in 5 minutes</p>
      </div>

      <p>If you did not request this change, please ignore this email.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p>Best regards,<br>${process.env.EMAIL_FROM_NAME}</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject,
    html
  });
 
}; 