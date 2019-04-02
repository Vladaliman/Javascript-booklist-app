//Book Class: Represents a Book

class Book{
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//User interface Class: Handels UI Tasks

class UI {
    static displayBooks(){
        const books = Store.getBooks();
       
        //looping and calling a method that adds the book to the books variable
        books.forEach((book)=> UI.addBookToList(book));
    }
    //createing the book adding method
        static addBookToList(book){
        
        //grabing the tbody DOM element by id
            const list = document.querySelector('#book-list');
        
        //createing table row (tr) element
            const row = document.createElement('tr');
        
        //seting the content of the row variable
            row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href ="#" class="btn btn-danger btn-sm delete">X</a></td>
            `;
            //adding the row to the list
            list.appendChild(row);
        }
    //Adding the remove Book function
        static deleteBook(el) {
            // checking if the Book(elem) has the delete class
            if(el.classList.contains('delete')){
                //selecting the row element by selecting parents
                el.parentElement.parentElement.remove();
            }
        }
    //Createing the alert div for the Validation    
        static showAlert(message, className){
            const div = document.createElement('div');
            div.className = `alert alert-${className}`;
            div.appendChild(document.createTextNode(message));
            
            //inserting the div element in the DOM
            const container = document.querySelector('.container');
            const form = document.querySelector('#book-form');
            container.insertBefore(div, form);
            
            //Make the alert go away after a few seconds
            setTimeout(() => document.querySelector('.alert').remove(), 3000);
        }

    //createing the clear field method after the add of a new Book
        static clearFields(){
            const title = document.querySelector('#title').value ='';
            const author = document.querySelector('#author').value ='';
            const isbn = document.querySelector('#isbn').value ='';
        }
    }

//Storage Class: Handles Storage(local storage)

    class Store{
        // geting the book 
        static getBooks() {
            let books;
            if (localStorage.getItem('books') === null){
                books = [];
            } else {
                books = JSON.parse(localStorage.getItem('books'))
            }

            return books
        }
        // adding it to local storage
        static addBook(book){
            const books = Store.getBooks();
            books.push(book);
            localStorage.setItem('books', JSON.stringify(books))
        }
        // removeing the book from storage
        static removeBook(isbn){
            const books = Store.getBooks();

            //looping threw the books and removeing the book if isbn matches
            books.forEach((book, index)=>{
                if(book.isbn === isbn){
                    books.splice(index, 1);
                }
            });

            localStorage.setItem('books', JSON.stringify(books))
        }

    }

//Event: Display Book

    document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a Book

    //selecting the form and adding a event listener to the submit event
    document.querySelector('#book-form').addEventListener('submit', 
    (e)=>{
        
        //Prevent default behaviour of submit event
        e.preventDefault();
        
        //Get form values
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const isbn = document.querySelector('#isbn').value;
        
        //Validate Book
        if (title ==='' || author ==='' || isbn ===''){
            UI.showAlert('Please fill in all the fields', 'danger');
        }else{
            //Createing the book object useing the Book class
            const book = new Book(title, author, isbn);

            //Add book to UI useing the function from UI
            UI.addBookToList(book);

            //Add book to local storage
            Store.addBook(book);
            
            //Show success message
            UI.showAlert('Book added', 'success');

            //Clear input fields
            UI.clearFields();
        }
        
    })

//Event: Remove a Book (from UI and from local storage)
    
    //Remove book from UI
    document.querySelector('#book-list').addEventListener('click', (e)=>{
        UI.deleteBook(e.target);

    //Remove book from Storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

        //Show success message
        UI.showAlert('Book removed', 'success');
    });
