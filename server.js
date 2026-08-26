require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json({ limit: '1mb' }));

// Serve all static files from root directory
app.use(express.static(path.join(__dirname)));

// Create reusable SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: parseInt(process.env.SMTP_PORT, 10) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify SMTP connection on startup
transporter.verify()
  .then(() => console.log('SMTP connection verified — ready to send emails'))
  .catch(err => console.error('SMTP connection failed:', err.message));

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, body } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).json({ ok: false, error: 'Missing required fields: to, subject, body' });
  }

  try {
    await transporter.sendMail({
      from: `"Double Coin Heavy Duty" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: body
    });
    console.log('Email sent to:', to, '| Subject:', subject);
    res.json({ ok: true });
  } catch (err) {
    console.error('Email send failed:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to send email' });
  }
});

// Fallback: serve index.html for any unknown route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
