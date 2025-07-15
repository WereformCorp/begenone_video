const express = require("express");
const multer = require("multer");

// const uploadThumbnailFunction = require("../controllers/util-controllers/uploadThumbnailFunction");
const updateLikesDislikes = require("../../controllers/updateLikesDislikes");
const getThumbnailData = require("../../controllers/getThumbnailData");
const protect = require("../../middlewares/protectMiddleware");

const router = express.Router({ mergeParams: true });

let thumbnailImage;

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
  .route("/thumbnail")
  .get(getThumbnailData)
  .post(
    protect,
    upload.single("thumbnail"),
    // uploadThumbnailFunction,
    async (req, res) => {
      thumbnailImage = req.thumbnail;
    },
  );

router
  .route("/interaction/:videoId/:action")
  .patch(protect, updateLikesDislikes);

module.exports = router;
