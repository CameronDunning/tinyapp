// Imports
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const PORT = 8080;
const {
  urlDatabase,
  users,
  generateRandomString,
  checkNotEmptyInput,
  checkEmailExists,
  addNewUser,
  validLogin,
  getUserByEmail,
  urlsForUser
} = require("./db");

// Activate imports
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "user_id",
    keys: ["id"]
  })
);

// Routes
// Post
app.post("/login", (req, res) => {
  // res.session("user_id", req.body.user_id);
  let notEmpty = checkNotEmptyInput(req);
  let validEmail = checkEmailExists(req);
  if (notEmpty && validEmail) {
    if (validLogin(req)) {
      req.session.user_id = getUserByEmail(req.body.email, users);
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
  res.clearCookie("user_id.sig");
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  let notEmpty = checkNotEmptyInput(req);
  let validEmail = !checkEmailExists(req);
  if (notEmpty && validEmail) {
    req.session.user_id = addNewUser(req);
    res.redirect("/urls");
  } else if (!validEmail) {
    res.status(400).send("Email Already Exists");
  } else if (!notEmpty) {
    res.status(400).send("Invalid Entry");
  }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.session.user_id) {
    res.status(400).send("You need to log in");
  } else {
    let user = req.session.user_id.id;
    if (user === urlDatabase[req.params.shortURL].userID) {
      delete urlDatabase[req.params.shortURL];
      res.redirect("/urls");
    } else {
      res.status(400).send("You do not have access to this URL");
    }
  }
});

app.post("/urls/:shortURL", (req, res) => {
  if (!req.session.user_id) {
    res.status(400).send("You need to log in");
  } else {
    let user = req.session.user_id.id;
    if (user === urlDatabase[req.params.shortURL].userID) {
      let newLongURL = req.body.longURL;
      urlDatabase[req.params.shortURL].longURL = newLongURL;
      res.redirect("/urls");
    } else {
      res.status(400).send("You do not have access to this URL");
    }
  }
});

app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.status(400).send("You need to log in");
  } else {
    let newShortURL = generateRandomString();
    let newLongURL = req.body.longURL;
    urlDatabase[newShortURL] = {};
    urlDatabase[newShortURL].longURL = newLongURL;
    urlDatabase[newShortURL].userID = req.session.user_id.id;
    res.redirect(`/urls/${newShortURL}`);
  }
});

// Get
app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    const shortURL = req.params.shortURL;
    const longURL = urlDatabase[shortURL].longURL;
    res.redirect(longURL);
  } else {
    res.status(400).send("This short URL doesn't exist");
  }
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    user_id: req.session["user_id"]
  };
  if (req.session.user_id) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.session.user_id) {
    res.status(400).send("You are not logged in!");
  } else {
    let user = req.session.user_id.id;
    if (urlDatabase[req.params.shortURL]) {
      if (user === urlDatabase[req.params.shortURL].userID) {
        let templateVars = {
          shortURL: req.params.shortURL,
          longURL: urlDatabase[req.params.shortURL].longURL,
          user_id: req.session["user_id"]
        };
        res.render("urls_show", templateVars);
      } else {
        res.status(400).send("You do not have access to this URL");
      }
    } else {
      res.status(400).send("This shortened URL can not be found");
    }
  }
});

app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    let templateVars = { user_id: undefined };
    res.render("register", templateVars);
  }
});

app.get("/login", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    let templateVars = { user_id: undefined };
    res.render("login", templateVars);
  }
});

app.get("/urls", (req, res) => {
  let userURLs = {};
  if (req.session["user_id"]) {
    userURLs = urlsForUser(req.session["user_id"].id);
    let templateVars = {
      urls: userURLs,
      user_id: req.session["user_id"]
    };
    res.render("urls_index", templateVars);
  } else {
    let templateVars = { user_id: undefined };
    res.render("urls_index", templateVars);
    // res.redirect("/login");
  }
});

app.get("/", (req, res) => {
  if (req.session["user_id"]) {
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

// Listen
app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}!`);
});
