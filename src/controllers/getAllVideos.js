// const { getAllChannels } = require("../services/channel/getAllChannels");
// const Video = require("../models/videoModel");
// const AppError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");

// const getAllVideos = catchAsync(async (req, res, next) => {
//   try {
//     const Channels = await getAllChannels();
//     // console.log(`CHANNELS:`, channels);
//     const allIds = Channels.map((item) => item._id);
//     // console.log(`ALL IDS:`, allIds);
//     const data = await Video.find({ channel: allIds });
//     // .populate({
//     //   path: "channel",
//     //   select: "_id name",
//     // });
//     // console.log(`DATA:`, data);
//     if (!data)
//       return next(new AppError(`Data you are looking for, do not exist.`, 404));
//     return res.status(200).json({
//       status: "Success",
//       results: data.length,
//       data,
//     });
//   } catch (err) {
//     console.log(`GET ALL VIDEOS | VIDEO CONTROLLER | ERROR ⭕⭕⭕`, err);
//     throw err;
//   }
// });

// module.exports = getAllVideos;

const { getAllChannels } = require("../services/channel/getAllChannels");
const Video = require("../models/videoModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getAllVideos = catchAsync(async (req, res, next) => {
  try {
    console.log(`Requested Query: `, req.query.ids);

    const channels = await getAllChannels(); // already gives full channel docs
    const channelMap = new Map(channels.map((ch) => [ch._id.toString(), ch]));

    const allIds = Array.from(channelMap.keys());

    let filter = { channel: allIds };

    // Method 1: Query param ?ids=id1,id2
    if (req.query.ids) {
      const ids = req.query.ids.split(",");
      console.log(`IDs from Query: `, ids);
      filter._id = { $in: ids };
    }

    console.log(`Filter: `, filter);

    const videos = await Video.find(filter);

    console.log(`Videos: `, videos);

    // if (!videos || videos.length === 0) {
    //   return next(
    //     `Data you are looking for, do not exist. || From: GET ALL VIDEOS ||.`,
    //     404,
    //   );
    // }

    // Simulate populate by attaching channel info manually
    const populatedVideos = videos.map((video) => {
      const plain = video.toObject();
      plain.channel = channelMap.get(video.channel.toString()) || null;
      return plain;
    });

    console.log(`Populated Videos: `, populatedVideos);

    return res.status(200).json({
      status: "Success",
      results: populatedVideos.length,
      data: populatedVideos,
    });
  } catch (err) {
    console.log(`GET ALL VIDEOS | VIDEO CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getAllVideos;
