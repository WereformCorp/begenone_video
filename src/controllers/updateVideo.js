const Video = require("../models/videoModel");

const { uploadContentToS3 } = require("../services/aws/uploadContentToS3");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const updateVideo = catchAsync(async (req, res, next) => {
  try {
    console.log(`Requested User: `, req.user);
    console.log(`Requested File: `, req.file);
    console.log(`Requested File: `, req.params.id);

    let thumbnailResult;

    if (req.file && req.file.mimetype) {
      thumbnailResult = await uploadContentToS3(
        req.file,
        req.user.channel,
        "thumbnail",
      );
      console.log("Thumbnail Upload Result:", thumbnailResult);
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    console.log(`Updated Video: `, updatedVideo);

    if (req.file) {
      updatedVideo.thumbnail = thumbnailResult.key;
    }

    await updatedVideo.save();

    if (!updatedVideo)
      return next(new AppError(`Data you are looking for, do not exist.`, 404));

    return res.status(200).json({
      status: "Success",
      data: updatedVideo,
    });
  } catch (err) {
    console.log(`UPDATE VIDEO | VIDEO CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = updateVideo;
