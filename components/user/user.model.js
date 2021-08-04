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


module.exports = mongoose.model("User", User);
