const Video = require("../models/videoModel");
const catchAsync = require("../utils/catchAsync");
const {
  generatePresignedUrl,
} = require("../services/aws/generatePresignedUrl");

const getThumbnailData = catchAsync(async (req, res, next) => {
  try {
    const videoData = await Video.find();
    // eslint-disable-next-line array-callback-return
    const thumbnails = videoData.map((video) => video.thumbnail);

    try {
      // Generate pre-signed URLs for each thumbnail
      const urls = await Promise.all(
        thumbnails.map(async (thumbnail) => {
          try {
            const url = await generatePresignedUrl(thumbnail);
            return { thumbnail, url }; // Return an object with thumbnail and its URL
          } catch (error) {
            console.error(`Error generating URL for ${thumbnail}:`, error);
            return { thumbnail, url: null }; // Return null URL in case of error
          }
        }),
      );

      // Send URLs back in the response
      res.json({ urls });
    } catch (error) {
      res.status(500).json({ message: "Error generating URLs" });
    }
  } catch (err) {
    console.log(`GET THUMBNAIL DATA | VIDEO CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getThumbnailData;
