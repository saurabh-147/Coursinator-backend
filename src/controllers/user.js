const { admin } = require("../utils/db");
const User = require("../models/user");
const axios = require("axios");

const API_KEY = "AIzaSyDCcEl6t2za5TgSh7jtQ0U0zuPxmgyelfM";

exports.signup = (req, res) => {
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

  return admin
    .auth()
    .createUser({
      email: userInfo.email,
      password: userInfo.password,
      displayName: userInfo.name,
      disabled: false,
    })
    .then((newUser) => {
      let user = new User(newUser.uid, newUser.displayName, newUser.email);

      user.save();
      return res.json({ created: true, user: newUser });
    })
    .catch((err) => {
      return res.json({ created: false, error: err.message });
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  let payload = {
    email: email,
    password: password,
    returnSecureToken: true,
  };
  return axios
    .post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      payload
    )
    .then((response) => {
      response.data.uid = response.data.localId;

      return res.json({ signedIn: true, user: response.data });
    })
    .catch((err) => {
      res.json({ signedIn: false, err: err.response.data.error.message });
    });
};
