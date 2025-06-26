const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../Models/listing.js");
const { isLoggedIn, isOwner, requireLogin } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// CORRECTED PATH (plural "controllers")
const listingController = require("../controller/listing.js");

// Middleware to validate listing input
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// ------------------- ROUTES -------------------
router.get("/new", 
  requireLogin("You must be logged in to create a listing!"), 
  listingController.renderNewForm
);



router.get("/", listingController.index);

router.post("/", 
  requireLogin("You must be logged in to create a listing!"),
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);

router.get("/:id", wrapAsync(listingController.showListing));

router.get("/:id/edit", 
  isLoggedIn, 
  isOwner, 
  wrapAsync(listingController.renderEditForm)
);

router.put("/:id", 
  isLoggedIn, 
  isOwner, 
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

router.delete("/:id", 
  isLoggedIn, 
  isOwner, 
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
