import { observable, toJS } from 'mobx';
import {get} from 'ajax';

class BookStore {

    @observable books;
    @observable show = false;
    @observable loading = false;
    @observable newBookModal = {};
    constructor() {
        this.bookCopy = null; //used to make changes
        this.deleteBook = null; //used to delete the book
    }
    bookDAO(){
        this.newBookModal ={
        "Book Title": "",
        "Author Name": "",
        "Published Date": new Date().toISOString()
    }
    }
    getBooksFromServer() {
        get("src/mockServer/books.json", null, (response)=>{
            this.books = response;
        });
    }
    showDelete(book){
        this.show = true;
        this.deleteBook = book;
    }
    hideDelete(){
        this.show = false;
        this.deleteBook= null;
    }
    addNewBookModal(){
        this.show = true;
        this.bookDAO();

    }
    deleteBookFromServer(){
        this.loading = true;
        const book =this.deleteBook;
        //mock delete
        const promise = new Promise(resolve=>{
            setTimeout(()=>{
                const response = {code: 200};
                resolve(response);
            },800);
        });
        promise.then(response=>{
            this.loading = false;
            if (response.code === 200){
                this.books.remove(book);
                this.show = false;
                this.deleteBook = null;
            }else{
                //error handling
            }
        });
        promise.catch(error=>{
            //error handling
            this.loading = false;
        });
        return promise;

    }
    saveNewBook(book){
        this.loading = true;
        const promise = new Promise(resolve=>{
            setTimeout(()=>{
                const _book = toJS(book); // deep copy
                _book.id = Math.round(Math.random()*10000) + 120;
                const response = {data: _book, code: 200 };
                resolve(response);
            },800);
        });
        promise.then(response=>{
            this.loading = false;
            if (response.code === 200){
                this.closeModal();
                this.books.push(response.data);
            }else{
                //error handling
            }
        });
        promise.catch(error=>{
            //error handling
        })

    }
    editBook(book){
        this.show = true;
        this.bookCopy = book;
        const promise = new Promise(resolve=>{
           this.discardChanges = resolve;
        });
        return promise;
    }
    closeModal(){
        this.show = false;
        this.bookCopy = null;
        this.deleteBook = null;
        this.newBookModal = {};
    }
    cancelChanges(){
        this.bookCopy = null;
        if (typeof (this.discardChanges) === "function"){
            this.discardChanges(true);
        }
    }
    saveBook(){
        //mock backend call with promise
        this.loading = true;
        const book = this.bookCopy;
        const delay = 800;
        const promise = new Promise((resolve)=>{
            setTimeout(()=>{
                const response = {code: 200, data: toJS(book)};
                resolve(response)
            },delay);
        });
        promise.then(response=>{
            this.loading = false;
            if (response.code === 200){
                this.show = false;
                const book = response.data;
                let originalBookIndex = this.books.findIndex(_book=>{
                    return _book.id === book.id;
                });
                if (originalBookIndex >= 0){
                    this.books[originalBookIndex] = book;
                    this.closeModal();
                } else{
                    //error handling
                }
            }else{
                //error handling
            }
        });
        return promise;

    }

}

export default new BookStore();
