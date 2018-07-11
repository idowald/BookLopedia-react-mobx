
import React from 'react';
import BookTable from "./bookTable/bookTable";
import BookStore from "./bookTable/bookStore";
import BookModal from "./bookTable/bookModal";
import ToastrContainer from 'react-toastr-basic'


export default class App extends React.Component {


    constructor(props) {
        super();
    }


    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        const {t} = this.props;
        return (
            <div className="App">
                <ToastrContainer />
                <BookModal BookStore={BookStore}/>
                <BookTable BookStore={BookStore}/>
            </div>
        );
    }
}
