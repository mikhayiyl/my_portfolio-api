const router = require("express").Router();
const { Post } = require("../models/post");
const { validate, savePost } = require("../models/savedPost");
const validator = require("../middleware/validate");
const auth = require("../middleware/auth");



//save post
router.post("/", [auth, validator(validate)], async (req, res) => {
    let savedPost = await savePost.findOne({ userId: req.body.userId, postId: req.body.postId });
    if (savedPost) return res.status(400).send('Access denied!! The post  is already saved');

    savedPost = new savePost(req.body)


    await savedPost.save();


    res.send(savedPost);

});

//savedPosts

router.get("/:id", async (req, res) => {
    const savedPosts = await savePost.find({ userId: req.params.id });
    const posts = await Promise.all(
        savedPosts.map(post => {
            return Post.findById(post.postId).sort('-createdAt');
        })
    );

    res.send(posts);
});


//remove savedPost

router.delete("/:postId/:userId", async (req, res) => {
    const post = await savePost.deleteOne({ postId: req.params.postId, userId: req.params.userId });
    if (!post) return res.status(404).send("The post was not found")
    res.send(post);

});


module.exports = router;
