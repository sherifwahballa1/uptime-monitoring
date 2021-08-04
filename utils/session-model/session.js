const mongoose = require('mongoose');
const { Schema } = mongoose;


// generates random number
function getRandom () {
  return Math.floor(100000000 + Math.random() * 900000000);
}

// Schema
const Session = mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  role: { type: String },
  // used for login devices
  sessions: [
    {
      urn: { type: Number },
      iat: { type: Number },
      exp: { type: Number }
    }
  ],
  // usuage rate limit per hour
  usage: {
    total: Number,
    span: Date,
    blocked: Boolean,
    nextAt: Date
  },
  updatedAt: { type: Date, default: Date.now }
});


Session.methods.createFor = function (user) {
  this.user = user._id;
  this.usage = {
    total: 0,
    span: new Date(),
    blocked: false,
    nextAt: new Date()
  };
};

// create new random number
// returns token
Session.methods.newLogin = function (opts) {
  const tokenConfig = {
    urn: getRandom(),
    exp: opts.exp,
    iat: opts.iat
  };
  this.sessions.unshift(tokenConfig);
  return tokenConfig;
};

// check if session exists and not expired
Session.methods.getLogin = function (urn) {
  const s = this.sessions.find(e => e.urn === urn);
  return (s) ? s : false;
};

// add to records
Session.methods.recordUsage = function () {
  this.usage.total++;
};

// block sessions usage
// nextAt
Session.methods.blockUsage = function (opts) {
  this.usage.blocked = true;
  this.usage.nextAt = opts.nextAt;
};

// reset usage to inital state
Session.methods.resetUsage = function () {
  this.usage.total = 0;
  this.usage.span = new Date();
  this.usage.blocked = false;
  this.usage.nextAt = new Date();
};

Session.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Session', Session);