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
  addNewUser
} = require("./db");

// Routes
// Post
app.post("/login", (req, res) => {
  // res.cookie("user_id", req.body.user_id);
  let notEmpty = checkNotEmptyInput(req);
  let validEmail = checkEmailExists(req);
  if (notEmpty && validEmail) {
    user_id = addNewUser(req);
    res.cookie("user_id", user_id);
    res.redirect("/urls");
  } else if (!validEmail) {
    res.status(400).send("Email Already Exists");
  } else if (!notEmpty) {
    res.status(400).send("Invalid Entry");
  }
  res.redirect("/urls");
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

app.post("/register", (req, res) => {
  let notEmpty = checkNotEmptyInput(req);
  let validEmail = checkEmailExists(req);
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
    user_id: req.cookies["user_id"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user_id: req.cookies["user_id"]
  };
  res.render("urls_show", templateVars);
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
  let templateVars = {
    urls: urlDatabase,
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
