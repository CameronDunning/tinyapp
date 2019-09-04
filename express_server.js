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
const {
  urlDatabase,
  users,
  generateRandomString,
  checkNotEmptyInput,
  checkEmailExists,
  addNewUser,
  validLogin,
  getUserObj,
  urlsForUser
} = require("./db");

// Routes
// Post
app.post("/login", (req, res) => {
  // res.cookie("user_id", req.body.user_id);
  let notEmpty = checkNotEmptyInput(req);
  let validEmail = checkEmailExists(req);
  if (notEmpty && validEmail) {
    if (validLogin(req)) {
      let user = getUserObj(req.body.email);
      res.cookie("user_id", user);
      res.redirect("/urls");
    } else {
      res.status(403).send("Invalid Login");
    }
  } else if (!validEmail) {
    res.status(403).send("Email not found");
  } else if (!notEmpty) {
    res.status(400).send("Invalid Entry");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  let notEmpty = checkNotEmptyInput(req);
  let validEmail = !checkEmailExists(req);
  if (notEmpty && validEmail) {
    user_id = addNewUser(req);
    res.cookie("user_id", user_id);
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
  urlDatabase[req.params.shortURL].longURL = newLongURL;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  let newShortURL = generateRandomString();
  let newLongURL = req.body.longURL;
  urlDatabase[newShortURL] = {};
  urlDatabase[newShortURL].longURL = newLongURL;
  urlDatabase[newShortURL].userID = req.cookies.user_id.id;
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
    user_id: req.cookies["user_id"]
  };
  if (req.cookies.user_id) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.cookies.user_id) {
    res.redirect("/login");
  } else {
    let user = req.cookies.user_id.id;
    if (user === urlDatabase[req.params.shortURL].userID) {
      let templateVars = {
        shortURL: req.params.shortURL,
        longURL: urlDatabase[req.params.shortURL],
        user_id: req.cookies["user_id"]
      };
      res.render("urls_show", templateVars);
    } else {
      res.status(400).send("You do not have access to this URL");
    }
  }
});

app.get("/register", (req, res) => {
  let templateVars = { user_id: undefined };
  res.render("register", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = { user_id: undefined };
  res.render("login", templateVars);
});

app.get("/urls", (req, res) => {
  let userURLs = {};
  if (req.cookies["user_id"]) {
    userURLs = urlsForUser(req.cookies["user_id"].id);
  }
  let templateVars = {
    urls: userURLs,
    user_id: req.cookies["user_id"]
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
