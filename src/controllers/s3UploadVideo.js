const { uploadContentToS3 } = require("../services/aws/uploadContentToS3");
const createVideo = require("./createVideo");
// const AppError = require("../utils/appError");
const getAllUsers = require("../services/user/getAllUsers");
const getUser = require("../services/user/getUser");

const s3UploadVideo = async (req, res) => {
  // const Users = await getAllUsers();
  console.log(`REQUESTED USER: `, req.user);
  console.log(`REQUESTED LOCAL USER: `, res.locals.user);

  console.log(`REQUESTED THUMBNAIL: `, req.thumbnailFile);
  console.log(`REQUESTED VIDEO FILE: `, req.videoFile);

  // return;
  const user = res.locals.user;
  let thumbnailResult;
  const videoFile = req.videoFile;
  const thumbnailFile = req.thumbnailFile;

  // const user = Users.find((u) => u.id === res.locals.user._id);

  // const user = await Users.findById(res.locals.user._id);
  console.log(`RES LOCAL USER ID FROM s3UPLOADVIDEO FUNCTION:`, user);

  if (user && user.active === false)
    return res.status(403).json({
      error: "USER_INACTIVE",
      message:
        "The user is not authorized to upload videos. Please verify your account.",
    });

  if (!videoFile) {
    return res.status(400).send("No Video uploaded!");
  }

  console.log(`REQUESTED THUMBNAIL`, req.thumbnailImage);
  console.log(`REACHING S3 UPLOAD VIDEO FILE`, req.file);

  try {
    // const channelId = req.user.channel; // Get channel ID from request
    const channelId = res.locals.user.channel; // Get channel ID from request
    console.log(`CHANNEL ID FROM VIDEO ROUTES:`, channelId);

    const videoResult = await uploadContentToS3(videoFile, channelId, "video");
    console.log("Video uploaded:", videoResult);

    if (thumbnailFile && req.thumbnailFile.mimetype) {
      thumbnailResult = await uploadContentToS3(
        thumbnailFile,
        channelId,
        "thumbnail",
      );
      console.log("Thumbnail Upload Result:", thumbnailResult);
    }

    console.log(
      `getTHUMBNAIL . THUMB FUNCTION --- VIDEO UPLOAD 🔥🔥🔥🔥:`,
      req.thumbnailFile,
    );

    req.s3Data = {
      video: videoResult || null,
      thumbnail: thumbnailResult || null,
    };

    console.log(`REQUEST S3-DATA:`, req.s3Data);

    return createVideo(req, res);
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).send("File upload failed");
  }
};

module.exports = s3UploadVideo;
