# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).
Users can register, log in, and add urls that they wish to be shortened and then review a list of all the ursl that they have added.
shortURL visits are tracked for timestamp created and clicks.
Clicking the links will bring users to the associated website.
To allow anyone to use the shortened url, use /u/[shortened url]

## Final Product

!["Main URL page"](https://github.com/CameronDunning/tinyapp/blob/master/docs/URLs.png?raw=true)
!["Log-in page"](https://github.com/CameronDunning/tinyapp/blob/master/docs/Log-in.png?raw=true)
!["Speific URL page"](https://github.com/CameronDunning/tinyapp/blob/master/docs/short_URLs.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
