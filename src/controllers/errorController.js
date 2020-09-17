// Function that handle the type of error response
const sendError = (err, possibleCode, res) => {
  // This logic is for the possible error in the fs methods
  const [code, message, status] =
    err.code === "ENOENT"
      ? [500, "Unable to write in the file", "error"]
      : [possibleCode, err.message, "fail"];

  res.writeHead(code, {
    "Content-Type": "application/json",
  });
  res.end(
    JSON.stringify({
      status,
      message,
    })
  );
};

module.exports = sendError;
