const router = require("express").Router();
const { Post } = require("../models/post");
const { validate, sharedPost } = require("../models/sharedPost");
const validator = require("../middleware/validate");
const auth = require("../middleware/auth");
const { User } = require("../models/user");



//share post
router.post("/", [auth, validator(validate)], async (req, res) => {
    let post = await sharedPost.findOne({ userId: req.body.userId, postId: req.body.postId });
    if (post) return res.status(400).send('Access denied!! The post  is already shared');



    post = new sharedPost(req.body)




    await post.save();


    res.send(post);

});



//remove post

router.delete("/:postId/:userId", async (req, res) => {
    const post = await sharedPost.deleteOne({ postId: req.params.postId, userId: req.params.userId });
    if (!post) return res.status(404).send("The post was not found")
    res.send(post);

});


module.exports = router;
