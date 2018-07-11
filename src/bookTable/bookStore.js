import { observable, toJS } from 'mobx';
import {get} from 'ajax';
import {ToastSuccess, ToastDanger} from 'react-toastr-basic';


class BookStore {

    @observable books;
    @observable show = false;
    @observable loading = false;
    @observable newBookModal = {};
    @observable mainRefresh = false;
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
        this.mainRefresh = true;
        get("src/mockServer/books.json", null, (response)=>{
            this.books = response;
            this.mainRefresh = false;
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
                ToastSuccess("Book deleted");
            }else{
                //error handling
                ToastDanger("Book wasn't deleted- error");
            }
        });
        promise.catch(error=>{
            //error handling
            this.loading = false;
            ToastDanger("Book wasn't deleted- error");
        });
        return promise;

    }
    saveNewBook(book){
        this.loading = true;
        const promise = new Promise((resolve, reject)=>{
            setTimeout(()=>{
                const _book = toJS(book); // deep copy
                _book.id = Math.round(Math.random()*10000) + 120;
                let response;
                if (this.books.find(bookItem=>
                        bookItem["Book Title"] === _book["Book Title"])){
                    response = {error_message: "error- existing book with same title!", code: 500};
                }else{
                    response = {data: _book, code: 200 };
                }
                resolve(response);
            },800);
        });
        promise.then(response=>{
            this.loading = false;
            if (response.code === 200){
                this.closeModal();
                this.books.push(response.data);
                ToastSuccess("New book created");
            }else{
                //error handling
                if (response.error_message){
                    ToastDanger(response.error_message);
                }else{
                    ToastDanger("Book wasn't created- error");
                }
            }
        });
        promise.catch(error=>{
            //error handling
            this.loading = false;
            ToastDanger("Book wasn't created- error");
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
        //mock update call
        //mock backend call with promise
        this.loading = true;
        const book = this.bookCopy;
        const delay = 800;
        const promise = new Promise((resolve)=>{
            setTimeout(()=>{
                let response;
                if (this.books.find(bookItem=>
                        bookItem["Book Title"] === book["Book Title"] && bookItem.id !== book.id )){
                    response = {error_message: "error- existing book with same title!", code: 500};
                }else{
                    response = {data: toJS(book), code: 200 };
                }
                resolve(response)
            },delay);
        });
        const errorHandler =(error)=>{
            this.loading = false;
            if (error.error_message){
                        ToastDanger(error.error_message);
                    }else{
                        ToastDanger("Book wasn't updated- error");
                    }
        };
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
                    ToastSuccess("Book was updated");
                } else{
                    errorHandler(response);
                }
            }else{
                //error handling
                errorHandler(response);
            }
        });
        promise.catch(errorHandler);
        return promise;

    }

}

export default new BookStore();
