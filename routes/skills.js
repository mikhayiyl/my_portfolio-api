const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validator = require('../middleware/validate');
const objId = require('../middleware/validateObjectId');
const { Skill, validate } = require('../models/skill');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const skills = await Skill.find().sort('name');
    res.send(skills);
});

router.post('/', [auth, validator(validate)], async (req, res) => {
    let skill = await Skill.findOne({ title: req.body.title });
    if (skill) return res.status(400).send("skill already exists");

    skill = new Skill({
        title: req.body.title,
        percent: req.body.percent,
        skills: [req.body.skill]

    });
    skill = await skill.save();

    res.send(skill);
});

router.put('/:id', [objId, validator(validate), auth], async (req, res) => {
    let skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(400).send("skill does not exists");

    skill = await skill.update({
        title: req.body.title,
        percent: req.body.percent,
        skills: [...skill.skills, req.body.skill]
    })


    res.send(skill);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const skill = await Skill.findByIdAndRemove(req.params.id);

    if (!skill) return res.status(404).send('The skill with the given ID was not found.');

    res.send(skill);
});

router.get('/:id', async (req, res) => {
    const skill = await Skill.findById(req.params.id);

    if (!skill) return res.status(404).send('The skill with the given ID was not found.');

    res.send(skill);
});

module.exports = router;