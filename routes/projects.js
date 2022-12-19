const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Project, validate } = require('../models/project');
const objectId = require("../middleware/validateObjectId");
const validator = require("../middleware/validate");
const router = require("express").Router();

router.get('/', async (req, res) => {
    const projects = await Project.find().sort('-createdAt');
    res.send(projects);
});

router.post('/', [auth, validator(validate)], async (req, res) => {
    const genre = await Project.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");


    let project = new Project({
        title: req.body.title,
        url: req.body.url,
        description: req.body.description,
        feature: req.body.feature,
        images: [req.body.image],
        genre: {
            _id: genre._id,
            name: genre.name,
        },
    });

    await project.save();

    res.send(project);
});

router.put('/:id', [auth, objectId, validator(validate)], async (req, res) => {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!project) return res.status(404).send('The project with the given ID was not found.');

    res.send(project);
});

router.delete('/:id', [auth, admin, objectId], async (req, res) => {
    const project = await Project.findByIdAndRemove(req.params.id);

    if (!project) return res.status(404).send('The project with the given ID was not found.');

    res.send(project);
});

router.get('/:id', async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).send('The project with the given ID was not found.');

    res.send(project);
});

module.exports = router;