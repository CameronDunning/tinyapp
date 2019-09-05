// Imports
const bcrypt = require("bcrypt");
const { getFormattedDate } = require("./helpers");

// Data
const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  sgq3y6: {
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
  let password = bcrypt.hashSync(newUser.body.password, 10);
  users[newID] = {};
  users[newID].id = newID;
  users[newID].email = newUser.body.email;
  users[newID].password = password;
  return users[newID];
};

const validLogin = input => {
  for (let user in users) {
    if (users[user].email === input.body.email) {
      if (bcrypt.compareSync(input.body.password, users[user].password)) {
        return true;
      } else {
        return false;
      }
    }
  }
  return false;
};

const getUserByEmail = (email, database) => {
  for (let user in database) {
    if (database[user].email === email) {
      return database[user];
    }
  }
  return;
};

const urlsForUser = id => {
  let output = {};
  for (let elem in urlDatabase) {
    if (urlDatabase[elem].userID === id) {
      output[elem] = urlDatabase[elem];
    }
  }
  return output;
};

const newURL = (longURL, id, database) => {
  let newShortURL = generateRandomString();
  let date = getFormattedDate();
  database[newShortURL] = {};
  database[newShortURL].longURL = longURL;
  database[newShortURL].userID = id;
  database[newShortURL].datestamp = date;
  database[newShortURL].count = 0;
  database[newShortURL].countUnique = [];
  return newShortURL;
};

module.exports = {
  urlDatabase,
  users,
  generateRandomString,
  checkNotEmptyInput,
  checkEmailExists,
  addNewUser,
  validLogin,
  getUserByEmail,
  urlsForUser,
  newURL
};
