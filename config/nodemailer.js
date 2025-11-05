import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587, // Use 465 for SSL if needed
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({to, subject, html}) => {
  console.log('Preparing to send email to:',to);
  try {
    const mailOptions = {
      // from: process.env.EMAIL_USER,
      from:"",
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Email error:', error.message);
    throw error;
  }
};

export default sendEmail;
