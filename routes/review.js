const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");

const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

// Middleware to validate review data
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// FIXED: Correct controller path
const reviewController = require("../controller/review.js");

//-----------------------------------------------------------------//

// ✅ POST: Create a new review for a listing
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// ✅ DELETE: Remove a review from a listing
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
