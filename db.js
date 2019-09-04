// Data
const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "userRandomID"
  }
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

// Functions
const generateRandomString = () => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const checkNotEmptyInput = input => {
  if (!input.body.email || !input.body.password) {
    return false;
  } else {
    return true;
  }
};

const checkEmailExists = input => {
  for (let user in users) {
    if (users[user].email === input.body.email) {
      return true;
    }
  }
  return false;
};

const addNewUser = newUser => {
  let newID = generateRandomString();
  users[newID] = {};
  users[newID].id = newID;
  users[newID].email = newUser.body.email;
  users[newID].password = newUser.body.password;
  return users[newID];
};

const validLogin = input => {
  for (let user in users) {
    if (users[user].email === input.body.email) {
      if (users[user].password === input.body.password) {
        return true;
      } else {
        return false;
      }
    }
  }
  return false;
};

const getUserObj = email => {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return;
};

module.exports = {
  urlDatabase,
  users,
  generateRandomString,
  checkNotEmptyInput,
  checkEmailExists,
  addNewUser,
  validLogin,
  getUserObj
};
