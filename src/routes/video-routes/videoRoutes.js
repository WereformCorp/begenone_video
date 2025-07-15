const express = require("express");
const multer = require("multer");

// CONTROLLERS
const s3UploadVideo = require("../../controllers/s3UploadVideo");
const getVideo = require("../../controllers/getVideo");
const updateVideo = require("../../controllers/updateVideo");
const deleteVideo = require("../../controllers/deleteVideo");
const getAllVideos = require("../../controllers/getAllVideos");
const updateLikesDislikes = require("../../controllers/updateLikesDislikes");
const getThumbnailData = require("../../controllers/getThumbnailData");

// MIDDLEWARE
const protect = require("../../middlewares/protectMiddleware");
const authMiddleware = require("../../middlewares/authMiddleware");

{
  // const {
  //   // checkSubscription,
  //   checkUserSubscription,
  // } = require("../controllers/util-controllers/checkSubscription");
  // const { uploadContentToS3 } = require('../controllers/aws_S3_controller');
  // const uploadThumbnailFunction = require("../controllers/util-controllers/uploadThumbnailFunction");
}

const router = express.Router({ mergeParams: true });

let thumbnailImage;

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Set 100MB limit for uploads
});

// WE ACTUALLY DON'T NEED IT AS THE "videos/" route actually already handles thumbnail and video altogether, we just need to implement a FRONTEND FUNCTION that can send the data of THUMBNAIL (if it exists) and VIDEO in one request USING REACT!
{
  // router
  //   .route("/thumbnail")
  //   // .get(getThumbnailData)
  //   .post(
  //     protect,
  //     upload.single("thumbnail"),
  //     // uploadThumbnailFunction,
  //     async (req, res) => {
  //       console.log(`REQUESTED THUMBNAIL: `, req.file);
  //       thumbnailImage = req.thumbnail;
  //     },
  //   );
}

router
  .route("/")
  .get(getAllVideos)
  .post(
    protect,
    // checkSubscription,
    // checkUserSubscription,
    authMiddleware,
    // upload.single("video"),
    upload.fields([
      { name: "video", maxCount: 1 }, // Handle video file upload
      { name: "thumbnail", maxCount: 1 }, // Handle thumbnail file upload
    ]),
    async (req, res, next) => {
      // req.thumbnailImage = thumbnailImage || null;
      // Extract video and thumbnail from the request files
      console.log(`Requested Files: `, req.files);
      const videoFile = req.files?.video[0]; // The first (and only) video file
      const thumbnailFile = req.files?.thumbnail?.[0] || null;
      // req.files?.thumbnail?.[0] || null; // The first (and only) thumbnail file

      console.log(`Video File: `, videoFile);
      console.log(`Thumbnail Files: `, thumbnailFile);

      // You can now process the video and thumbnail files as needed
      req.videoFile = videoFile;
      req.thumbnailFile = thumbnailFile;

      next();
    },
    s3UploadVideo,
  );

router
  .route("/interaction/:videoId/:action")
  .patch(protect, updateLikesDislikes);

router
  .route("/:id")
  .get(getVideo)
  .patch(
    protect,
    authMiddleware,
    upload.single("thumbnail"),
    async (req, res, next) => {
      // req.thumbnailImage = thumbnailImage || null;
      // Extract video and thumbnail from the request files
      console.log(`Requested Files: `, req.file);
      const thumbnailFile = req.file;

      console.log(`Thumbnail Files: `, thumbnailFile);

      req.thumbnailFile = thumbnailFile;

      next();
    },
    updateVideo,
  )
  .delete(protect, deleteVideo);

// router.use('/:videoId/sponsors', sponsorRouter);
// router.use("/:videoId/comments", commentRouter);

module.exports = router;
