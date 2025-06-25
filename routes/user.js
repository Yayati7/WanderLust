const express = require("express");
const router = express.Router();
const User = require("../Models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js");

// Public routes (no login required)
router.get("/signup", userController.renderSignupForm);
router.post("/signup", wrapAsync(userController.signup));
router.get("/login", userController.renderLoginForm);

// Updated login route with custom callback
router.post("/login", saveRedirectUrl, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // Handle failed login - push error to session
      if (!req.session.error) req.session.error = [];
      req.session.error.push(info?.message || "Invalid username or password");
      return req.session.save(() => res.redirect("/login"));
    }
    // Handle successful login
    req.logIn(user, (err) => {
      if (err) return next(err);
      if (!req.session.success) req.session.success = [];
      req.session.success.push("Welcome back!");
      const redirectUrl = res.locals.redirectUrl || "/listings";
      return req.session.save(() => res.redirect(redirectUrl));
    });
  })(req, res, next);
});

router.get("/logout", userController.logout);

module.exports = router;
