const { admin, db } = require("../../utils/db");
const User = require("../../models/user");
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
  try{
    newUser = await admin.auth().createUser({
      email: userInfo.email,
      password: userInfo.password,
      displayName: userInfo.name,
      disabled: false,
    })
    let user = new User(newUser.uid, newUser.displayName, newUser.email, userInfo.role);
    user.save();
    newUser.role = userInfo.role

  }
  catch(err){
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
  let user,userData;
  try{
    user = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      payload
    )
    user.data.uid = user.data.localId;
    userData = await User.get({id:user.data.localId})

  }
  catch(err){
    let errorMessage="Erorr Fetching User Details! Please Try later."
    if(err.hasOwnProperty("response")) errorMessage=err.response.data.error.message
    return res.json({ signedIn: false, err: errorMessage });
  }
  return res.json({ signedIn: true, user: {...userData,...user.data} });
};
