const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Project, validate } = require('../models/project');
const objectId = require("../middleware/validateObjectId");
const validator = require("../middleware/validate");
const { Genre } = require('../models/genre');
const router = require("express").Router();

router.get('/', async (req, res) => {
    const projects = await Project.find().sort('-createdAt');
    res.send(projects);
});

router.post('/', [auth, validator(validate)], async (req, res) => {
    let project = await Project.findOne({ title: req.body.title });
    if (project) return res.status(400).send("project already exists");


    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");


    project = new Project({
        title: req.body.title,
        gitUrl: req.body.gitUrl,
        projectUrl: req.body.projectUrl,
        description: req.body.description,
        genre: {
            _id: genre._id,
            name: genre.name,
        },
    });

    if (req.body.image) { project.images.push(req.body.image) };
    if (req.body.feature) { project.features.push(req.body.feature) };
    if (req.body.technology) { project.technologies.push(req.body.technology) };

    await project.save();

    res.send(project);
});

router.put('/:id', [auth, objectId, validator(validate)], async (req, res) => {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(400).send("project does not exists");

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre.");



    await project.update({
        title: req.body.title,
        gitUrl: req.body.gitUrl,
        projectUrl: req.body.projectUrl,
        description: req.body.description,
        genre: {
            _id: genre._id,
            name: genre.name,
        },
    });

    res.send(project);
});
router.put('/features/:id', [auth, objectId], async (req, res) => {
    const project = await Project.findByIdAndUpdate(req.params.id, { $push: { features: req.body.feature } }, { new: true });
    if (!project) return res.status(404).send('The project with the given ID was not found.');
    res.send(project);
});
router.put('/images/:id', [auth, objectId], async (req, res) => {
    const project = await Project.findByIdAndUpdate(req.params.id, { $push: { images: req.body.image } }, { new: true });
    if (!project) return res.status(404).send('The project with the given ID was not found.');
    res.send(project);
});
router.put('/technologies/:id', [auth, objectId], async (req, res) => {
    const technology = await Project.findByIdAndUpdate(req.params.id, { $push: { technologies: req.body.technology } }, { new: true });
    if (!technology) return res.status(404).send('The technology with the given ID was not found.');
    res.send(technology);
});

router.delete('/:id', [auth, admin, objectId], async (req, res) => {
    const project = await Project.findByIdAndRemove(req.params.id);

    if (!project) return res.status(404).send('The project with the given ID was not found.');

    res.send(project);
});

router.get('/:id', objectId, async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).send('The project with the given ID was not found.');

    res.send(project);
});

module.exports = router;