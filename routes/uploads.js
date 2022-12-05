const express = require('express');
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { Post } = require('../models/post');
const { User } = require('../models/user');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "routes/public")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
});



const upload = multer({ storage });



router.post("/", upload.single("file"), async (req, res, next) => {

    const post = new Post({
        userId: req.body.id,
        description: req.body.desc,

        media: {
            name: req.file.originalname.endsWith(".mp4") ? "video" : "image",
            filename: req.file.filename,
        }
    })


    await post.save();

    res.send(post)

});

router.put("/", upload.single("file"), async (req, res) => {

    const user = req.body.name === "profile" ? await User.findByIdAndUpdate(req.body.id, {
        profilePicture: req.file.filename, $push: { images: { image: req.file.filename, type: "profile" } }
    }, { new: true }) : await User.findByIdAndUpdate(req.body.id, {
        coverPicture: req.file.filename, $push: { images: { image: req.file.filename, type: "cover" } }
    }, { new: true });

    res.send(user)

});




module.exports = router;
