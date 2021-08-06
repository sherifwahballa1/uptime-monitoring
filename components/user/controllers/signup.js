const User = require('../user.model')
const catchAsync = require('../../../utils/catchAsync')
const { signup: signupSchema } = require('../user.validation')
const securityModule = require('./../../../security');

signup = catchAsync(async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body)
    if (error)
      return res.status(400).json({ message: error.message.replace(/"/g, '') })

    let user = await User.findOne({}).or([
      { email: value.email },
      { phone: value.phone }
    ]);

    if (user && user.email === value.email)
      return res
        .status(409)
        .json({ message: 'Email already registered before', status: 409 })

    if (value.phone) {
      if (user && user.phone == value.phone)
        return res.status(409).json({ message: 'Phone number is used', status: 409 })
    }


    user = await User.create(value)
    const token = securityModule.signTempJWT(user)
    return res.status(200).send({ temp: token })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send({ message: 'Internal server error' })
  }
})

module.exports = signup
