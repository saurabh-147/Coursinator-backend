const { auth } = require("firebase-admin");
const { admin, db } = require("../utils/db");

class User {
  constructor(id, name, email) {
    (this.id = id), (this.name = name), (this.email = email), (this.role = 0);
  }
  static getData(uid) {
    admin
      .auth()
      .getUser(uid)
      .then((userRecord) => {
        return userRecord;
      })
      .catch((error) => {
        console.log("Error fetching user data:", error);
      });
  }

  save() {
    if (this.id === null || this.name === null || this.email === null)
      throw new Error("Fields can't be empty");
    else {
      return db.collection("Users").doc(this.id).set({
        name: this.name,
        email: this.email,
        role: this.role,
      });
    }
  }
}

module.exports = User;
