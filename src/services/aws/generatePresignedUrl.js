const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");

const generatePresignedUrl = catchAsync(async (key) => {
  try {
    const response = await axios.post(
      `${process.env.LOCALHOST_AWS_URL}/api/v1/aws/s3/s3-generatePresignedUrl`,
      {
        key,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (err) {
    return console.log(err.message);
  }
});

module.exports = { generatePresignedUrl };
