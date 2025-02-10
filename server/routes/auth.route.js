import express from "express";
import passport from "passport";
import User from "../models/user.model.js";

const router = express.Router();

router.get("/github", passport.authenticate("github", { scope: ["user:email", "read:user"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: process.env.CLIENT_BASE_URL + "/login" }),
  function (req, res) {
    res.redirect(process.env.CLIENT_BASE_URL);
  }
);

router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(200).json({ user: null });
  }
});

router.get("/logout", (req, res) => {
  try {
    req.logout(function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: "Logout failed" });
      }
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Session destruction failed" });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ success: true, message: "Logged out successfully" });
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Logout failed", error: error.message });
  }
});

export default router;