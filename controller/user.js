function addSuccess(req, msg) {
  if (!req.session.success) req.session.success = [];
  req.session.success.push(msg);
}
function addError(req, msg) {
  if (!req.session.error) req.session.error = [];
  req.session.error.push(msg);
}


const User = require("../Models/user");

// --- Toast helper functions ---
function addSuccess(req, msg) {
  if (!req.session.success) req.session.success = [];
  req.session.success.push(msg);
}
function addError(req, msg) {
  if (!req.session.error) req.session.error = [];
  req.session.error.push(msg);
}

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    // Login the user automatically after signup
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.session.save(() => {
      addSuccess(req, "Welcome to Wanderlust!");
      res.redirect("/listings");
      })
    });
  } catch (e) {
    addError(req, e.message);
    req.session.save(() => {
    res.redirect("/signup");
    })
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// Login function to properly handle redirect and toast messages
module.exports.login = (req, res) => {
  addSuccess(req, "Welcome to Wanderlust! You are logged in!");

  // Get the saved redirect URL from session, default to /listings
  let redirectUrl = req.session.redirectUrl || "/listings";

  // Clear the redirect URL from session
  delete req.session.redirectUrl;

  // Save the session before redirecting to ensure toast message persists
  req.session.save((err) => {
    if (err) {
      console.log("Session save error:", err);
    }
    res.redirect(redirectUrl);
  });
};

module.exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    addSuccess(req, "You are logged out!");
    req.session.save(() => {
    res.redirect("/listings");
    })
  });
};
