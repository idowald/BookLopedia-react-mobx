import React from 'react';
import {Button, Modal} from "react-bootstrap";
import {ToastDanger} from 'react-toastr-basic';
import Loading from 'react-loading-animation';
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator'
import NewBookForm from "./newBookForm";

@observer
export default class BookModal extends React.Component {

    constructor(props) {
        super();
    }


    componentDidMount() {
    }

    componentWillUnmount() {
    }
    @autobind
    handleHide(){
        this.props.BookStore.closeModal();
    }
    @autobind
    saveBook(){
        this.props.BookStore.saveBook();
    }
    @autobind
    cancel(){
        this.props.BookStore.cancelChanges();
        this.props.BookStore.closeModal();
    }
    @autobind
    deleteBook(){
        this.props.BookStore.deleteBookFromServer();
    }
    createNewBook(){
        const book =this.props.BookStore.newBookModal;
        if(!book["Book Title"].length){
            return ToastDanger("Can't save with empty title");
        }
        if (!book["Author Name"].length){
            return ToastDanger("Can't save with empty author name");
        }
        if (!book["Published Date"] || book["Published Date"].hasOwnProperty("value")
                || Object.prototype.toString.call(new Date(book["Published Date"])) !== '[object Date]') {
            return ToastDanger("Invalid date");
        }
        this.props.BookStore.saveNewBook(book);

    }
    render() {
        const {t, BookStore} = this.props;
        const showNewBookModal = BookStore.newBookModal.hasOwnProperty("Book Title");

        return (
            <div className="BookModal">
            <Modal
          show={this.props.BookStore.show}
          onHide={this.handleHide}
          dialogClassName="custom-modal-book"
        >
          <Modal.Header closeButton>
            <Modal.Title id="book-modal">
                {BookStore.bookCopy && "Are you sure you want to edit book?"}
                {BookStore.deleteBook && "Are you sure you want to delete book?"}
                {showNewBookModal && "Create a new book"}
            </Modal.Title>
          </Modal.Header>
                <Modal.Body>
                    {showNewBookModal && <NewBookForm book={BookStore.newBookModal}/>}
                </Modal.Body>
          <Modal.Footer>
              {BookStore.loading && <Loading/>}
              {showNewBookModal && <Button onClick={()=>this.createNewBook()} bsStyle="info">Create new book</Button>}
              {BookStore.bookCopy && <Button onClick={this.saveBook} bsStyle="primary">Save</Button> }
              {BookStore.deleteBook &&<Button onClick={this.deleteBook} bsStyle="danger">OK</Button> }
            <Button onClick={this.cancel}>Cancel</Button>
          </Modal.Footer>
        </Modal>
            </div>
        );
    }
}

