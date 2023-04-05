const express = require("express");
const { User } = require("../model/usersSchema");
const router = express.Router();

// Get all user details
router.get("/userdetails", async (req, res) => {
  try {
    const userDetails = await User.find();
    //console.log(userDetails);
    res.json(userDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/userdetails/:id", async (req, res) => {
  const params = req.params;
  console.log(params);
  try {
    const userDetails = await User.findOne({ username: params.id });
    //console.log(userDetails);
    res.json(userDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/getUserdetailsByUsername", async (req, res) => {
  const { username } = req.body;
  try {
    const userDetails = await User.findOne({ username: username });
    //console.log(userDetails);
    res.json(userDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single user's details by their user ID
router.get("/userdetails/:userId", async (req, res) => {
  try {
    const userDetails = await User.findOne({
      userId: req.params.userId,
    });
    res.json(userDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new user's details
router.post("/userdetails", async (req, res) => {
  const userDetails = new User({
    userId: req.body.userId,
    fullName: req.body.fullName,
    photo: req.body.photo,
    profession: req.body.profession,
    areaOfInterest: req.body.areaOfInterest,
  });

  try {
    const newUserDetails = await userDetails.save();
    res.status(201).json(newUserDetails);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//update a old user's details

router.post("/updateUserdetails", async (req, res) => {
  const { username, data } = req.body;
  try {
    const userDetails = await User.findOneAndUpdate(
      { username },
      { $set: { ...data } },
      { new: true }
    );
    res.status(200).json(userDetails);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating user details" });
  }
});

// add a new resource of a user

router.post("/addResource", async (req, res) => {
  const { username, docname, docDesc } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // Add the new resource to the user's resources array
    user.resources.push({
      docname,
      docDesc,
    });

    // Save the updated user document
    const updatedUser = await user.save();
    console.log(updatedUser);

    res.json({ success: true, message: "Resource added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
