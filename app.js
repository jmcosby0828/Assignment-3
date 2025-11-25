const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { getAllBooks, getBooksByISBN, calculateTotalPrice } = require("./books");

const app = express();
const PORT = 3000;

const {engine} = require("express-handlebars");

// Set up handlebars view engine
app.engine("hbs", engine({
    extname: ".hbs",
    defaultLayout: "main"
}));

app.set("view engine", "hbs"); 
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({extended: false})); // parse form data

app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get("/", (req, res) => {
    const books = getAllBooks();
    res.render("books", {books});
});

// Order form route
app.get("/order", (req, res) => {
    const books = getAllBooks();
    res.render("order", {
        books, 
        errors: {},
        quantityInput: ""
    });
});

// Handle order submission
app.post("/order", 
    extractParameters,
    validateParameters,
    findBook,
    computeTotal,
    displayReceipt
);

//Function ro extract parameters from request
function extractParameters(req, res, next) {
    req.isbn = req.body.isbn;
    req.quantityInput = req.body.quantity;
    next();
}

// Function to validate parameters
function validateParameters(req, res, next) {
    const errors = {}; // object to hold validation errors
    const books = getAllBooks();

    // Check if a book is selected
    if (req.isbn === "none" || !req.isbn)
    {
        errors.isbn = "Must select a book!";
    }

    // Validate quantity
    const quantity = parseFloat(req.quantityInput);
    if (isNaN(quantity) || quantity < 1 || !Number.isInteger(quantity))
    {
        errors.quantity = "Must purchase at least one copy!";
    }

    // Redisplay form with errors if any
    if (Object.keys(errors).length > 0) {
        return res.render("order", {
            books, 
            errors,
            quantityInput: req.quantityInput
        });
    }

    req.quantity = quantity;
    next();
}

// Function to find book by ISBN
function findBook(req, res, next) {
    const book = getBooksByISBN(req.isbn);
    if (!book) {
        return res.status(400).send("<h3>Error: Book not found.</h3>"); 
    }
    req.book = book;
    next();
}

// Function to compute total price
function computeTotal(req, res, next) {
    req.total = calculateTotalPrice(req.book.price, req.quantity);
    next();
}

// Function to output receipt
function displayReceipt(req, res) {
    // Ensure total is valid before formatting
    const totalToDisplay = (typeof req.total === 'number' && !isNaN(req.total)) 
        ? req.total.toFixed(2) 
        : "0.00";
    
    res.render("receipt", {
        book: req.book,
        quantity: req.quantity,
        total: totalToDisplay
    });
}

app.use((req, res) => {
    res.status(404).send("File not found");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Server Error");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
