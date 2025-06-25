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
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
  const { search } = req.query;
  let allListings;
  if (search) {
    allListings = await Listing.find({
      title: { $regex: search, $options: "i" } // case-insensitive, partial match
    });
  } else {
    allListings = await Listing.find({});
  }
  res.render("listings/index.ejs", { allListings, isListingsPage: true, search });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  try {
    let response = await geocodingClient
      .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    addSuccess(req, "New Listing Created");
    req.session.save(() => {
    res.redirect("/listings");
    })

  } catch (err) {
    next(err);
  }
};


module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    })
    .populate("owner");

  if (!listing) {
    addError(req, "Listing doesn't exist!");
    req.session.save(() => {
    return res.redirect("/listings");
    })
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    addError(req, "Listing you requested for does not exist!");
    req.session.save(() => {
    res.redirect("/listings");
    })
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  // Check if the location has changed
  if (req.body.listing.location && req.body.listing.location !== listing.location) {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();

    const geoData = response.body.features[0]?.geometry;
    if (!geoData || !geoData.type || !geoData.coordinates) {
      addError(req, "Could not find location on map.");
      return res.redirect(`/listings/${id}/edit`);
    }

  listing.geometry = geoData; // This will be { type: 'Point', coordinates: [...] }
  listing.location = req.body.listing.location;
}


  // Update other fields
  Object.assign(listing, req.body.listing);

  // Handle image update if a new file is uploaded
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  await listing.save();

  addSuccess(req, "Listing Updated!");
  req.session.save(() => {
  res.redirect(`/listings/${id}`);
  })
};



module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  addSuccess(req, "Listing Deleted");
  req.session.save(() => {
  res.redirect("/listings");
  })
};