
import React from 'react';
import {observer} from 'mobx-react';
import {Button, PageHeader, Table} from "react-bootstrap";
import BookRow from "./bookRow";
import Loading from 'react-loading-animation';


@observer
export default class BookTable extends React.Component {


    constructor(props) {
        super();

    }


    componentDidMount() {
    }
    componentWillMount(){
        this.props.BookStore.getBooksFromServer();
    }

    componentWillUnmount() {
    }
    delete(book){
        this.props.BookStore.showDelete(book);
    }
    render() {
        const {t} = this.props;
        const {books} = this.props.BookStore;
        return (
            <div className="bookTable">
                <PageHeader>
                    BookLopedia
                </PageHeader>
                <div style={{margin: "0px 10px 10px 10px"}}>
                <Button onClick={()=>this.props.BookStore.addNewBookModal()} bsStyle="info">Add new book </Button>
                </div>
                <div  style={{maxHeight: "800px", overflowY: "scroll", margin: "0px 10px 0px 10px"}}>
                    {this.props.BookStore.mainRefresh && <Loading/>}
            <Table striped bordered condensed hover responsive>
                <thead>
                <tr>
                    <th style={{width:"10px"}}>#</th>
                    <th>ID</th>
                    <th>Book Title</th>
                    <th>Author Name</th>
                    <th>Published Date</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {books && books.map((book, index)=>
                    <BookRow key={book.id} book={book} index={index} BookStore={this.props.BookStore}
                    deleteRow={()=>this.delete(book)}/>
                )}
                </tbody>
            </Table>
                </div>
            </div>
        );
    }
}
