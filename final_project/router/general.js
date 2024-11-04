const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios')

const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn]

  if (book) {
    return res.status(200).json(book);   
  } else {
    return res.status(404).json({ message: 'Book not found '})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const response = [];

  for (let id in books) {
      if (books[id].author === author) {
        response.push(books[id]);
      }
  }
  
  if (response.length) {
    return res.status(200).json(response);
  } else {
    return res.status(404).json(response)
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const response = [];

  for (let id in books) {
      if (books[id].title === title) {
        response.push(books[id]);
      }
  }
  
  if (response.length) {
    return res.status(200).json(response);
  } else {
    return res.status(404).json(response)
  }});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn]

  if (book) {
    return res.status(200).json(book.reviews);   
  } else {
    return res.status(404).json({ message: 'Book not found '})
  }
});

public_users.get("/server/asyncbooks", async function (req,res) {
  try {
    let response = await axios.get("http://localhost:5000/");
    console.log(response.data);
    return res.status(200).json(response.data);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Error getting book list"});
  }
});

public_users.get("/server/asyncbooks/isbn/:isbn", function (req,res) {
  let {isbn} = req.params;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
  .then(function(response){
    console.log(response.data);
    return res.status(200).json(response.data);
  })
  .catch(function(error){
      console.log(error);
      return res.status(500).json({message: "Error while fetching book details."})
  })
});

public_users.get("/server/asyncbooks/author/:author", function (req,res) {
  let {author} = req.params;
  axios.get(`http://localhost:5000/author/${author}`)
  .then(function(response){
    console.log(response.data);
    return res.status(200).json(response.data);
  })
  .catch(function(error){
      console.log(error);
      return res.status(500).json({message: "Error while fetching book details."})
  })
});

public_users.get("/server/asyncbooks/title/:title", function (req,res) {
  let {title} = req.params;
  axios.get(`http://localhost:5000/title/${title}`)
  .then(function(response){
    console.log(response.data);
    return res.status(200).json(response.data);
  })
  .catch(function(error){
      console.log(error);
      return res.status(500).json({message: "Error while fetching book details."})
  })
});

module.exports.general = public_users;
