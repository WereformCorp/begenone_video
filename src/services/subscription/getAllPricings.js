const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const getAllPricings = catchAsync(async () => {
  try {
    const pricings = await axios.get(
      `${process.env.LOCALHOST_SUBSCRIPTION_URL}/api/v1/subscription/route-pricings/`
    );

    const pricingsData = pricings || pricings.data;

    return pricingsData;
  } catch (err) {
    console.log(`GET USER | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getAllPricings;
