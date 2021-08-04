const Error404 = (req, res, next) => {
  res.status(404).json({ title: "404: File Not Found" });
};

// global errors 500, 400, 401, 409
// 400	BadRequest
// 401	Unauthorized
// 402	PaymentRequired
// 403	Forbidden
// 405	MethodNotAllowed
// 409	Conflict
// 408	RequestTimeout
// 429	TooManyRequests
// 501	NotImplemented
// 503	ServiceUnavailable
// 504	GatewayTimeout
// 423	Locked
// 413	PayloadTooLarge
// 411	LengthRequired
const Error500 = (error, req, res, next) => {
  console.log(error.message)
  if (error.status === 500 || error.status === undefined)
    return res.status(500).json({ message: "500: Internal Server Error", error: error.message });
  else
    return res.status(error.status).json({ message: error.message, error });

};



module.exports = {
  Error404,
  Error500
};
