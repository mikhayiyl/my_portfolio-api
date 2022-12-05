const router = require("express").Router();
const _ = require("lodash");
const { validate, Comment } = require("../models/comment");
const validator = require("../middleware/validate");
const objId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const { Post } = require("../models/post");


//get post comments
router.get('/:id', [auth], async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("The post with  the given Id does not exist");

    const comments = await Comment.find({ postId: post._id })

    res.send(comments)
})

// comment a post

router.post('/', [auth, validator(validate)], async (req, res) => {
    const post = await Post.findById(req.body.postId);
    if (!post) return res.status(404).send("Invalid post");
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).send("Invalid user");

    const comment = new Comment({
        user: {
            _id: user._id,
            username: user.username,
            profilePicture: user.profilePicture
        },
        postId: post._id,
        text: req.body.text
    })

    await comment.save()

    res.send(comment)

})


//delete comment
router.delete('/:id', [auth, objId], async (req, res) => {
    const comment = await Comment.findByIdAndRemove(req.params.id)
    if (!comment) return res.status(404).send("The comment with Id " + req.params.id + " does not exist");
    res.send(comment)
});
//reported  comment
router.put('/:id', [auth, objId], async (req, res) => {
    const comment = await Comment.findByIdAndUpdate(req.params.id, { spam: true }, { new: true });
    if (!comment) return res.status(404).send("The comment with Id " + req.params.id + " does not exist");
    res.send(comment)
});


//like a comment 

router.put('/likes/:id', [auth, validator(validate), objId], async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).send("Invalid comment");


    if (!comment.likes.includes(req.body.userId)) {

        await comment.updateOne({ $push: { likes: req.body.userId } })
        res.send('Liked a comment');
    }
    else {

        await comment.updateOne({ $pull: { likes: req.body.userId } });

        res.send('Unliked a comment')
    }


})

//reply a comment

router.put('/replies/:id', [auth, validator(validate), objId], async (req, res) => {
    const comment = await Comment.findByIdAndUpdate(req.params.id, { $push: { replies: req.body.replies } }, { new: true });
    if (!comment) return res.status(404).send("Invalid comment");

    res.send(comment)
});



module.exports = router;