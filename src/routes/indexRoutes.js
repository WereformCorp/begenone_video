const express = require("express");

const videoRouter = require("./video-routes/videoRoutes");
const engagementRouter = require("./events/engagementRoute");

const router = express.Router({ mergeParams: true });

router.use("/route-video", videoRouter);
router.use("/route-engagement", engagementRouter);

module.exports = router;
