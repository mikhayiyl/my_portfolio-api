const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validator = require('../middleware/validate');
const objId = require('../middleware/validateObjectId');
const router = express.Router();


//get all users
router.get('/', auth, async (req, res) => {
    const users = await User.find().select('-password').sort('__v');
    res.send(users)
})

//create a user
router.post('/', validator(validate), async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered, cannot use email address twice  ');


    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']))

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    await user.save();

    const token = user.generateAuthToken();

    res.header('X-Auth-Token', token).header('access-control-expose-headers', 'X-Auth-Token').send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
});

//update a user
router.put('/:id', [auth, validator(validate)], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id, _.pick(req.body, ['name', 'email', 'password', 'isAdmin']), { new: true });
    if (!user) return res.status(404).send('The user with the given Id was not found');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    await user.save();

    res.send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));

})

//delete a user

router.delete('/:id', [auth, admin], async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('The user with the given Id was not found');
    res.send(user);
})


//get a specific user
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).send('The user with the given Id was not found');
    res.send(user);
})


module.exports = router;