// Array of book 
const books = [
    {
        isbn: "9780060838676",
        title: "Their Eyes Were Watching God",
        price: 9.99,
        image: "9780060838676.jpg"
    },
    {
        isbn: "9780061350177",
        title: "Mules and Men",
        price: 12.00,
        image: "9780061350177.jpg"
    },
    {
        isbn: "9780062004833",
        title: "Dust Tracks on a Road",
        price: 13.59,
        image: "9780062004833.jpg"
    }
];

// Function to get all books
function getAllBooks() {
    return books;
}

// Function to get book by ISBN
function getBooksByISBN(isbn) {
    return books.find(book => book.isbn === isbn);
}

// Function to calculate total price with tax
function calculateTotalPrice(price, quantity) {
    const TAX_RATE = 1.0175;
    return price * quantity * TAX_RATE;
}

module.exports = {getAllBooks, getBooksByISBN, calculateTotalPrice};