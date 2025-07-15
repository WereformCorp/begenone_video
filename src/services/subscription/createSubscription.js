const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const createSubscription = catchAsync(
  async (userId, pricingName, pricingId, price = 0, autoRenew = true) => {
    try {
      const subscription = await axios.post(
        `${process.env.LOCALHOST_SUBSCRIPTION_URL}/api/v1/subscription/`,
        {
          userId,
          pricingName,
          pricingId,
          price,
          autoRenew,
        }
      );

      const subscriptionData = subscription || subscription.data;

      return subscriptionData;
    } catch (err) {
      console.log(`GET USER | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
      throw err;
    }
  }
);

module.exports = createSubscription;
