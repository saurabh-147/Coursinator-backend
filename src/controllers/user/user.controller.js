const { admin } = require("../../utils/db");
const User = require("../../models/user");
const { uploadFile } = require("../../utils/storageServices");
const axios = require("axios");

const API_KEY = "AIzaSyDCcEl6t2za5TgSh7jtQ0U0zuPxmgyelfM";

exports.signup = async (req, res) => {
  let userInfo = req.body;

  if (!userInfo.email) {
    return res.status(422).json({
      error: "Email is mandatory",
    });
  }
  if (!userInfo.name) {
    return res.status(422).json({
      error: "Name is mandatory",
    });
  }
  let newUser;
  try {
    newUser = await admin.auth().createUser({
      email: userInfo.email,
      password: userInfo.password,
      displayName: userInfo.name,
      disabled: false,
    });
    let user = new User(newUser.uid, newUser.displayName, newUser.email, userInfo.role, userInfo.color);
    user.save();
    newUser = { ...newUser, ...user.toJson() };
  } catch (err) {
    return res.json({ created: false, error: err.message });
  }

  return res.json({ created: true, user: newUser });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  let payload = {
    email: email,
    password: password,
    returnSecureToken: true,
  };
  let user, userData;
  try {
    user = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, payload);
    user.data.uid = user.data.localId;
    userData = await User.get({ id: user.data.localId });
  } catch (err) {
    let errorMessage = "Erorr Fetching User Details! Please Try later.";
    if (err.hasOwnProperty("response")) errorMessage = err.response.data.error.message;
    return res.json({ signedIn: false, err: errorMessage });
  }
  return res.json({ signedIn: true, user: { ...userData, ...user.data } });
};

exports.updateProfile = async (req, res) => {
  let { id, name, email, college, degree, graduationYear, field } = req.body;
  let updated_values = { name, email, college, degree, graduationYear, field };
  let profile_img = req.file || null;
  let profile_picture = null;
  try {
    if (profile_img) {
      console.log("Updating profile pic...");
      profile_picture = await uploadFile("profile_picture", profile_img.mimetype.split("/")[1], profile_img.buffer, id);
      if (profile_picture) updated_values.profile_picture = profile_picture;
    }

    await User.update(id, updated_values);
  } catch (err) {
    res.json({ updated: false, error: err });
  }
  res.json({ updated: true, values: updated_values });
};
