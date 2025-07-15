const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");

const getChannel = catchAsync(async (channelID) => {
  try {
    const channelData = await axios.get(
      `${process.env.LOCALHOST_CHANNEL_URL}/api/v1/channels/channel-routes/${channelID}`,
    );

    const channel = channelData.data.data;

    if (!channel)
      throw new Error(
        `No Channel Was Found! -- Channel Data API CALL from Get All Channels -- 💥💥💥`,
      );

    console.log(`Channel Data from GET ALL CHANNELS API CALL: `, channel);

    return channel;
  } catch (err) {
    return console.log(err.message);
  }
});

module.exports = { getChannel };
