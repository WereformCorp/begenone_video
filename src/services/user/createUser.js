const axios = require('axios');
const catchAsync = require('../../utils/catchAsync');

const createUser = catchAsync(async (body) => {
  try {
    const user = await axios.post(
      `${process.env.LOCALHOST_USER_URL}/api/v1/users/`,
      { body }
    );

    const userData = user && user.data.data;

    return userData;
  } catch (err) {
    console.log(`GET USER | USER CONTROLLER | ERROR ⭕⭕⭕`, err);
    throw err;
  }
});

module.exports = createUser;
