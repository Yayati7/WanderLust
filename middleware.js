const Listing = require("./Models/listing");
const Review = require("./Models/review.js");

// --- Toast helper functions ---
function addSuccess(req, msg) {
  if (!req.session.success) req.session.success = [];
  req.session.success.push(msg);
}
function addError(req, msg) {
  if (!req.session.error) req.session.error = [];
  req.session.error.push(msg);
}

// Generic login check with customizable message
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    addError(req, "You must be logged in to create listing!");
    req.session.save(() => {
      res.redirect("/login");
    });
    return;
  }
  next();
};

// Save redirect URL properly
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    addError(req, "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    addError(req, "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Additional middleware for host page access
module.exports.canHost = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    addError(req, "You must be logged in to become a host!");
    req.session.save(() => {
      res.redirect("/login");
    });
    return;
  }
  next();
};

// Middleware for different login scenarios with custom messages
module.exports.requireLogin = (message = "You must be logged in!") => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl;
      addError(req, message);
      req.session.save(() => {
        res.redirect("/login");
      });
      return;
    }
    next();
  };
};
