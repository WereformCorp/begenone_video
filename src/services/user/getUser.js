const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");

const getUser = catchAsync(async (userId) => {
  try {
    const user = await axios.get(
      `${process.env.LOCALHOST_USER_URL}/api/v1/users/user/${userId}`,
    );

    const userData = user && user.data.data;

    if (!userData)
      throw new Error(`No User Data Was Found! -- Get User from API CALL --`);

    return userData;
  } catch (err) {
    console.log(`GET USER | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getUser;
