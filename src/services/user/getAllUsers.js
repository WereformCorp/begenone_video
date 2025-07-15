const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");

const getAllUsers = catchAsync(async () => {
  try {
    const user = await axios.get(
      `${process.env.LOCALHOST_USER_URL}/api/v1/users/user/`,
    );

    const userData = user && user.data.data;

    return userData;
  } catch (err) {
    console.log(`GET USER | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = getAllUsers;
