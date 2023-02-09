const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const objId = require('../middleware/validateObjectId');
const { Link, validate } = require('../models/link');
const express = require('express');
const router = express.Router();

const validator = require("../middleware/validate");



router.get('/', async (req, res) => {
    const links = await Link.find();
    res.send(links);
});

router.post('/', [auth, validator(validate)], async (req, res) => {

    let link = new Link(req.body);
    link = await link.save();

    res.send(link);
});

router.put('/:id', [objId, auth], async (req, res) => {

    const link = await Link.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });

    if (!link) return res.status(404).send('The link with the given ID was not found.');

    res.send(link);
});

router.delete('/:id', [objId, auth, admin], async (req, res) => {
    const link = await Link.findByIdAndRemove(req.params.id);

    if (!link) return res.status(404).send('The link with the given ID was not found.');

    res.send(link);
});

router.get('/:id', objId, async (req, res) => {
    const link = await Link.findById(req.params.id);

    if (!link) return res.status(404).send('The link with the given ID was not found.');

    res.send(link);
});

module.exports = router;