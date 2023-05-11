// pages/api/password-check.js
export default async function handler(req, res) {
    const inputPassword = req.body.password;
    const correctPassword = process.env.PASSWORD;
  
    if (inputPassword === correctPassword) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  }