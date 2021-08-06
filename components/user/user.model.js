const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpSubmitCounter: { type: Number, default: 0 },
    otpNextResendAt: { type: Date, default: Date.now },
    otpRequestCounter: { type: Number, default: 0 },
    role: { type: String, default: "user" },
  },
  { usePushEach: true, timestamps: true }
); /// to make the array push available in DB

User.index({ email: 1 });


// check Password Validation
User.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password);
};

User.query.byEmail = function (email) {
  return this.where({ email: new RegExp(email, "i") });
};

User.query.byID = function (id) {
  return this.where({ _id: mongoose.Types.ObjectId(id) });
};


User.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

User.methods.updateOtp = function () {
  let blockTimeInMinutes = 1;
  let nextResendTime = 0;

  // block user for 1h if he made 5 requests
  // otherwise block user for 1 minute
  if (this.otpRequestCounter === 4) {
    blockTimeInMinutes = 60;
    this.otpRequestCounter = -1; // set otpRequestCounter to 0 after (1) hour of blocking
    nextResendTime = new Date().getTime() + blockTimeInMinutes * 60 * 1000;
  } else if (this.otpRequestCounter === 3) {
    blockTimeInMinutes = 30;
    nextResendTime = new Date().getTime() + blockTimeInMinutes * 60 * 1000;
  } else if (this.otpRequestCounter === 2) {
    blockTimeInMinutes = 15;
    nextResendTime = new Date().getTime() + blockTimeInMinutes * 60 * 1000;
  } else if (this.otpRequestCounter === 1) {
    blockTimeInMinutes = 5;
    nextResendTime = new Date().getTime() + blockTimeInMinutes * 60 * 1000;
  } else {
    nextResendTime = new Date().getTime() + blockTimeInMinutes * 1000; // 1 second
  }

  // generate 6-digits OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  this.otp = otp;
  this.otpNextResendAt = new Date(nextResendTime);
  this.otpRequestCounter++;
};

User.methods.updateSubmitOtp = function () {
  let blockTimeInMinutes = 1;
  let nextResendTime = 0;

  // block user for 1h if he made 5 requests
  // otherwise block user for 1 minute
  if (this.otpSubmitCounter === 5) {
    this.otpSubmitCounter = -1;
    nextResendTime = new Date().getTime() + 30 * blockTimeInMinutes * 60 * 1000;
  } else
    nextResendTime = new Date().getTime() + blockTimeInMinutes * 1000; // 1 second

  this.otpNextResendAt = new Date(nextResendTime);
  this.otpSubmitCounter++;
};


module.exports = mongoose.model("User", User);
