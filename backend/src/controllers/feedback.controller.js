const Feedback = require('../models/Feedback.model');
const nodemailer = require('nodemailer');

exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Save to MongoDB
    const feedback = await Feedback.create({ name, email, message });

    // Send email notification to admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.FEEDBACK_EMAIL,      // your Gmail
        pass: process.env.FEEDBACK_PASS        // app password
      }
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.ADMIN_RECEIVER_EMAIL,
      subject: '📩 New Feedback on TanishaWrites',
      html: `
        <h3>New Feedback Received</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      data: feedback
    });

  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ success: false, message: 'Server error while submitting feedback' });
  }
};