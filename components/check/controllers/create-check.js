const mongoose = require('mongoose');
const Check = require('../check.model')
const catchAsync = require('../../../utils/catchAsync')
const { checkInfo: checkSchema } = require('../check.validation')

createCheck = catchAsync(async (req, res) => {
    try {
        const { error, value } = checkSchema.validate(req.body)
        if (error)
            return res.status(400).json({ message: error.message.replace(/"/g, '') })

        let ownerID = req.userData._id;

        let check = await Check.findOne({}).or([
            { name: value.name, userId: mongoose.Types.ObjectId(ownerID) },
            { url: value.url, userId: mongoose.Types.ObjectId(ownerID) }
        ]);

        if (check && check.name === value.name)
            return res
                .status(409)
                .json({ message: 'Check name already exists', status: 409 });

        if (check && check.url == value.url)
            return res.status(409).json({ message: 'Check url already exists', status: 409 });

        value.userId = ownerID;

        let newCheck = await Check.create(value);

        return res.status(200).send(newCheck)
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({ message: 'Internal server error' })
    }
})

module.exports = createCheck;
