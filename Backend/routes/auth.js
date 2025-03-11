const express = require("express");
const router = express.Router();

// Test route to check if auth.js is working
router.get("/test", (req, res) => {
  res.json({ message: "Auth route is working!" });
});

module.exports = router;
