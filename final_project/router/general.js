const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Send JSON response with formatted books data
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      res.send(JSON.stringify(books, null, 4));
      resolve("Success!");
    }, 100)
  })

  myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      res.send(books[isbn]);
      resolve("Success!");
    }, 100)
  })

  myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let bookResp = [];
      for (const book in books) {
        if (books[book].author == author) {
          bookResp.push(books[book]);
        }
      }
      res.send(bookResp);
      resolve("Success!");
    }, 100)
  })

  myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {

      const title = req.params.title;
      let bookResp = [];
      for (const book in books) {
        if (books[book].title == title) {
          bookResp.push(books[book]);
        }
      }
      res.send(bookResp);
      resolve("Success!");
    }, 100)
  })

  myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let bookResp = [];
  bookResp.push("Reviews for " + books[isbn].title + ": " + books[isbn].reviews);
  res.send(bookResp);
});

// Add a book review
public_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // Extract email parameter from request URL
  const isbn = req.params.isbn;
  console.log(isbn);
  let book = books[isbn];  // Retrieve friend object associated with email

  if (book) {  // Check if friend exists
    let review = req.body.review;
    // Add similarly for firstName
    // Add similarly for lastName

    // Update DOB if provided in request body
    if (review) {
      book["reviews"] = review;
    }
    // Add similarly for firstName
    // Add similarly for lastName

    books[isbn] = book;  // Update friend details in 'friends' object
    res.send(`Review added to book with ISBN ${isbn}.`);
  } else {
    // Respond if friend with specified email is not found
    res.send("Unable to find book!");
  }
});

public_users.delete("/:isbn", (req, res) => {
  // Extract email parameter from request URL
  const isbn = req.params.isbn;

  if (isbn) {
    // Delete friend from 'friends' object based on provided email
    delete books[isbn];
  }

  // Send response confirming deletion of friend
  res.send(`Book with ISBN ${isbn} deleted.`);
});

module.exports.general = public_users;
