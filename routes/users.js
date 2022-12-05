const router = require("express").Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { validate, User } = require("../models/user");
const validator = require("../middleware/validate");
const admin = require("../middleware/admin");
const objId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");


//get all users

router.get("/", [auth], async (req, res) => {
  const users = await User.find().sort('-createdAt').select('-__v');
  res.send(users);
});

//specific user

router.get("/:id", [auth, objId], async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .sort("username");
  if (!user)
    return res.status(404).send("The user with the given Id is not found");
  res.send(user);
});


//Register a new user
router.post("/", [validator(validate)], async (req, res) => {

  if (req.body.password !== req.body.password2) return res.status(400).send("Passwords do not match");
  let username = await User.findOne({
    username: req.body.username,
  });
  let email = await User.findOne({
    email: req.body.email,
  });
  if (username) return res.status(400).send("Username Already in use");
  if (email) return res.status(400).send("Email Already in use");

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  const token = user.generateAuthToken();

  const registeredUser = _.pick(user, ["_id", "username", "email"])

  res.status(200)
    .header("access-control-expose-headers", "x-auth-token")
    .header("x-auth-token", token)
    .send({ registeredUser, token });
});


//update User details

router.put(
  "/:id",
  [auth, objId],
  async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!user)
      return res.status(404).send("The user with the given Id is not found");

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    res.send(_.pick(user, ["username", "email"]));
  }
);

//Friends request

router.put("/request/:id", [auth, objId], async (req, res) => {
  const currentUser = await User.findById(req.params.id);
  if (!currentUser)
    return res.status(404).send("The user with the given Id is not found");
  const friend = await User.findById(req.body.userId);
  if (!friend)
    return res.status(404).send("The friend with the given Id is not found");

  if (req.params.id === req.body.userId)
    return res.status(401).send("Access denied! You cannot add yourself");

  if (currentUser.friends.includes(req.body.userId))
    return res.status(403).send("Access denied! Already friends with this user");

  if (friend.friendRequests.includes(req.params.id))
    return res.status(403).send("Access denied! Request already sent");

  await friend.updateOne({ $push: { friendRequests: req.params.id } });
  res.send("Friend request sent");
});
// Cancel Friends request

router.put("/cancel/:id", [auth, objId], async (req, res) => {
  const currentUser = await User.findById(req.params.id);
  if (!currentUser)
    return res.status(404).send("The user with the given Id is not found");
  const friend = await User.findById(req.body.userId);
  if (!friend)
    return res.status(404).send("The friend with the given Id is not found");

  if (currentUser.friendRequests.includes(req.body.userId))
    await currentUser.updateOne({ $pull: { friendRequests: req.body.userId } });
  if (friend.friendRequests.includes(req.params.id))
    await friend.updateOne({ $pull: { friendRequests: req.params.id } });
  res.send("Friend request cancelled");
});

//Accept friend request

router.put("/friend/:id", [auth, objId], async (req, res) => {
  const currentUser = await User.findById(req.params.id);
  if (!currentUser)
    return res.status(404).send("The user with the given Id is not found");
  const friend = await User.findById(req.body.userId);
  if (!friend)
    return res.status(404).send("The friend with the given Id is not found");

  if (req.params.id === req.body.userId)
    return res.status(401).send("Access denied! You cannot add yourself");
  if (currentUser.friends.includes(req.body.userId))
    return res.status(403).send("Access denied! Already friends with this user");

  await currentUser.updateOne({ $push: { friends: req.body.userId } });
  await friend.updateOne({ $push: { friends: req.params.id } });
  await currentUser.updateOne({ $pull: { friendRequests: req.body.userId } });
  res.send("You are now freinds with this user");
});

//unfriend users

router.put("/unfriend/:id", [auth, objId], async (req, res) => {
  const currentUser = await User.findById(req.params.id);
  if (!currentUser)
    return res.status(404).send("The user with the given Id is not found");
  const friend = await User.findById(req.body.userId);
  if (!friend)
    return res.status(404).send("The friend with the given Id is not found");

  if (req.params.id === req.body.userId)
    return res.status(403).send("Access denied! You cannot unfriend yourself");
  if (!currentUser.friends.includes(req.body.userId))
    return res.status(403).send("Access denied! This user is not your friend");

  await currentUser.updateOne({ $pull: { friends: req.body.userId } });
  await friend.updateOne({ $pull: { friends: req.params.id } });

  res.send("This user is no longer your friend");
});


//follow

router.put("/follow/:id", [auth, objId], async (req, res) => {
  const currentUser = await User.findById(req.params.id);
  if (!currentUser) return res.status(404).send("The user with the given Id is not found");
  const followUser = await User.findById(req.body.userId);
  if (!followUser) return res.status(404).send("The user with the given Id is not found");

  if (req.params.id === req.body.userId)
    return res.status(401).send("Access denied! You cannot follow yourself");

  if (!currentUser.following.includes(followUser._id)) await currentUser.updateOne({ $push: { following: followUser._id } });


  if (!followUser.followers.includes(currentUser._id)) await followUser.updateOne({ $push: { followers: currentUser._id } });

  res.send("You are now following this user");
});

//unfollow user

router.put("/unfollow/:id", [auth, objId], async (req, res) => {
  const currentUser = await User.findById(req.params.id);
  if (!currentUser) return res.status(404).send("The user with the given Id is not found");
  const followUser = await User.findById(req.body.userId);
  if (!followUser)
    return res.status(404).send("The user with the given Id is not found");


  if (req.params.id === req.body.userId)
    return res.status(403).send("Access denied! You cannot unfollow yourself");

  if (!currentUser.following.includes(req.body.userId))
    return res.status(403).send("Access denied! You do not follow this user");

  const response = await currentUser.updateOne({ $pull: { following: followUser._id } });
  await followUser.updateOne({ $pull: { followers: currentUser._id } });
  res.send("You no longer follow this user");
});

//delete user

router.delete("/:id", [auth, objId], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user)
    return res.status(404).send("The user with the given Id is not found");
  res.send(user);
});




//get friends

router.get("/friends/:id", [auth, objId], async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("The user with the given Id is not found");


  const friends = await Promise.all(
    user.friends.map(friendId => {
      return User.findById(friendId);
    })
  )

  res.send(friends);
});
//get following

router.get("/following/:id", [auth, objId], async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("The user with the given Id is not found");


  const following = await Promise.all(
    user.following.map(friendId => {
      return User.findById(friendId);
    })
  )

  res.send(following);
});
//get followers

router.get("/followers/:id", [auth, objId], async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("The user with the given Id is not found");


  const followers = await Promise.all(
    user.followers.map(friendId => {
      return User.findById(friendId);
    })
  )

  res.send(followers);
});

//friends Requests
router.get("/friendRequests/:id", [auth, objId], async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("The user with the given Id is not found");

  const usersRequests = await Promise.all(
    user.friendRequests.map(Id => {
      return User.findById(Id);
    })

  );

  res.send(usersRequests);
});


//all users who are not friends & have  not sent requests

router.get("/verify/:id", [auth, objId], async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("The user with the given Id is not found");

  const allUsers = await User.find();

  const users =
    allUsers.map(u => {
      if (!user.friends.includes(u._id) && !user.friendRequests.includes(u._id)) return u;
    }).filter(u => u !== undefined)


  res.send(users);
});

module.exports = router;
