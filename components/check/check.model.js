const mongoose = require("mongoose");

const Check = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    method: {
      type: String,
      required: true,
      enum: ["GET", "POST", "DELETE", "HEAD", "OPTIONS", "PATCH", "PUT"],
      default: "GET",
    },
    protocol: {
      type: String,
      enum: ["HTTP", "HTTPS", "TCP"],
      required: true,
    },
    path: { type: String, default: "" },
    port: { type: Number },
    webhook: { type: String, deafult: null },
    timeout: { type: Number, default: 5 },
    interval: { type: Number, default: 10 },
    threshold: { type: Number, default: 1 },
    authentication: {
      type: {
        username: {
          type: String,
          required: true,
        },
        password: {
          type: String,
          required: true,
        },
      },
    },
    httpHeaders: [
      {
        key: { type: String, default: "" },
        value: { type: String, default: "" },
      },
    ],
    assert: {
      type: {
        statusCode: {
          type: Number,
          required: true,
        },
      },
    },
    tags: [{ type: String, required: true }],
    ignoreSSL: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { usePushEach: true, timestamps: true }
);

module.exports = mongoose.model("Check", Check);
