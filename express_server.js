// Imports
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const PORT = 8080;

// Activate imports
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Data
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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

const checkValidEmail = input => {
  for (let user in users) {
    if (users[user].email === input.body.email) {
      return false;
    }
  }
  return true;
};

const addNewUser = newUser => {
  let newID = generateRandomString();
  users[newID] = {};
  users[newID].id = newID;
  users[newID].email = newUser.body.email;
  users[newID].password = newUser.body.password;
};

// Routes
// Post
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  let notEmpty = checkNotEmptyInput(req);
  let validEmail = checkValidEmail(req);
  if (notEmpty && validEmail) {
    addNewUser(req);
    res.cookie("username", req.body.email);
    res.redirect("/urls");
  } else if (!validEmail) {
    res.status(400).send("Email Already Exists");
  } else if (!notEmpty) {
    res.status(400).send("Invalid Entry");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  let newLongURL = req.body.longURL;
  urlDatabase[req.params.shortURL] = newLongURL;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  let newShortURL = generateRandomString();
  let newLongURL = req.body.longURL;
  urlDatabase[newShortURL] = newLongURL;
  res.redirect(`/urls/${newShortURL}`);
});

// Get
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = { username: undefined };
  res.render("register", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

// Listen
app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}!`);
});
