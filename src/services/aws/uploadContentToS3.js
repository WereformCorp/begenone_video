const axios = require("axios");
const catchAsync = require("../../utils/catchAsync");

const uploadContentToS3 = catchAsync(async (file, channelId, filetype) => {
  console.log(`Upload Content To S3 API CALL: --FILE--`, file);
  console.log(`Upload Content To S3 API CALL: --Channel ID--`, channelId);
  console.log(`Upload Content To S3 API CALL: --FILE TYPE--`, filetype);

  console.log(
    `URL of AWS: --LOCALHOST_AWS_URL--`,
    process.env.LOCALHOST_AWS_URL,
  );
  try {
    const responseData = await axios.post(
      `${process.env.LOCALHOST_AWS_URL}/api/v1/aws/s3/s3-upload-content`,
      {
        file,
        channelId,
        filetype,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const response = responseData.data;

    console.log(`Response from Upload Content To S3: `, responseData);

    if (!response)
      throw new Error(`No Response Came from Upload Content To S3 API CALL!`);

    return response;
  } catch (err) {
    return console.log(err.message);
  }
});

module.exports = { uploadContentToS3 };
