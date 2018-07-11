
import React from 'react';
import {FormControl, FormGroup} from "react-bootstrap";
import DatePicker from "react-16-bootstrap-date-picker";

import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';

@observer
export default class NewBookForm extends React.Component {

    @observable book;
    @observable touchedTitle = false;
    @observable touchedAuthor = false;
    @observable touchedDate = false;

    constructor(props) {
        super();
    }

    componentWillMount(){
        this.book = this.props.book;
    }
    componentDidMount() {
    }

    componentWillUnmount() {
        this.book = null;
    }
    changeInput(key, value){
        this.book[key] = value;
    }
    @computed
    get titleValidation(){
        if (this.touchedTitle) {
            if (this.book["Book Title"].length === 0) {
                return "error";
            } else {
                return "success";
            }
        }
    }
    @computed
    get authorValidation(){
        if (this.touchedAuthor) {
            if (this.book["Author Name"].length === 0) {
                return "error";
            } else {
                return "success";
            }
        }
    }
    @computed
    get dateValidation(){
        if (this.touchedDate) {
            if (this.book["Published Date"] && !this.book["Published Date"].hasOwnProperty("value")
                && Object.prototype.toString.call(new Date(this.book["Published Date"])) === '[object Date]') {
                return "success"
            } else {
                return "error";
            }
        }
    }
    render() {
        const {t} = this.props;
        return (
            <div className="newBookForm">
                <FormGroup
                    validationState={this.titleValidation}>
                    <FormControl
                        type="text"
                        placeholder="Title"
                        value={this.book["Book Title"]}
                        onChange={(e)=>{
                            this.touchedTitle = true
                            this.changeInput("Book Title", e.target.value);
                        }}
                        />
                </FormGroup>
                <FormGroup
                    validationState={this.authorValidation}>
                    <FormControl
                        type="text"
                        placeholder="Author"
                        value={ this.book["Author Name"]}
                        onChange={(e)=>{
                            this.touchedAuthor = true
                            this.changeInput("Author Name", e.target.value);
                        }}
                        />
                </FormGroup>
                <FormGroup
                    validationState={this.dateValidation}>
                    <DatePicker
                        id={this.datePickerId}
                        style={{width: "100px"}}
                        showClearButton={false}
                        value={ this.book["Published Date"]}
                        onChange={(value) => {
                            this.touchedDate = true;
                            this.changeInput("Published Date", value);
                        }
                        }
                        onBlur={(e)=> this.changeInput("Published Date", e.target)}
                    />
                </FormGroup>
            </div>
        );
    }
}

