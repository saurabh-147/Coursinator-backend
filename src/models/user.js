const { auth } = require("firebase-admin");
const { admin, db } = require("../utils/db");

class User {
  constructor(id, name, email, role) {
    this.id = id
    this.name = name
    this.email = email
    this.role = role
  }
  static async get(conditions=null){
    let query;
    if(conditions === null){
        query = db.collection('Users')
    }
    else if(conditions.hasOwnProperty('id')){
      query = db.collection('Users').doc(conditions.id)
    }
    else{
      query = db.collection('Users')
      conditions.forEach((key,value)=>{
          query = query.where(key,"==",value)
      })
    }
    let doc = await query.get();
    let userdata = doc.data()
    userdata.id = conditions.id
    return userdata;
  }

  save() {
    if (this.id === null || this.name === null || this.email === null || this.role === null)
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
