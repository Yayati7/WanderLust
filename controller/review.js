function addSuccess(req, msg) {
  if (!req.session.success) req.session.success = [];
  req.session.success.push(msg);
}
function addError(req, msg) {
  if (!req.session.error) req.session.error = [];
  req.session.error.push(msg);
}

const Listing = require("../Models/listing");
const Review = require("../Models/review");

// --- Toast helper functions ---
function addSuccess(req, msg) {
  if (!req.session.success) req.session.success = [];
  req.session.success.push(msg);
}
function addError(req, msg) {
  if (!req.session.error) req.session.error = [];
  req.session.error.push(msg);
}

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    addError(req, "Listing not found!");
    req.session.save(() => {
    return res.redirect("/listings");
    })
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  addSuccess(req, "Review added successfully!");
  req.session.save(() => {
  res.redirect(`/listings/${listing._id}`);
  })
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  addSuccess(req, "Review deleted.");
  req.session.save(() => {
  res.redirect(`/listings/${id}`);
  })
};
