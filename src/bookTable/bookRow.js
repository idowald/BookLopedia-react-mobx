import React from 'react';
import "./bookRowStyle.less";
import {Button, FormControl, FormGroup} from "react-bootstrap";
import DatePicker from "react-16-bootstrap-date-picker";
import {ToastDanger} from 'react-toastr-basic';

import {observable, toJS, when, computed} from "mobx"
import {observer} from 'mobx-react';
import common from "../common";

//Using Pure component for better rendering
@observer
export default class BookRow extends React.PureComponent {

    @observable editCopyBook;

    constructor(props) {
        super();
        this.datePickerId = props.book.id + "_datepicker";
    }


    componentDidMount() {
    }

    componentWillUnmount() {
    }
    editBook(){

        if (this.dateValidation === "error" ){
            return ToastDanger("Invalid date");
        }
        if (this.authorValidation === "error" ){
            return ToastDanger("Invalid author name");
        }
        if (this.titleValidation === "error"){
            return ToastDanger("Invalid title");
        }
        const copyJSONString = (JSON.stringify(this.editCopyBook));
        const originalJSONString =JSON.stringify(this.props.book);
        if (this.editCopyBook && originalJSONString !== copyJSONString) {
            const canceledCallback = this.props.BookStore.editBook(this.editCopyBook);
            canceledCallback.then(canceled=>{
               if (canceled){
                   this.editCopyBook = null;
               }
            });
        }else{
            //throw alert "nothing changed"
            ToastDanger("Nothing changed");
        }

    }
    @computed
    get titleValidation(){
        if (this.editCopyBook && this.editCopyBook["Book Title"] !== this.props.book["Book Title"]){
            if (this.editCopyBook["Book Title"].length ===0){
                return "error";
            }else{
                return "success";
            }
        }
    }
    @computed
    get authorValidation(){
        if (this.editCopyBook && this.editCopyBook["Author Name"] !== this.props.book["Author Name"]){
            if (this.editCopyBook["Author Name"].length ===0){
                return "error";
            }else{
                return "success";
            }
        }
    }
    @computed
    get dateValidation(){
        if(this.editCopyBook && this.editCopyBook["Published Date"] !== this.props.book["Published Date"]){
            if (this.editCopyBook["Published Date"] && !this.editCopyBook["Published Date"].hasOwnProperty("value")
                && Object.prototype.toString.call(new Date(this.editCopyBook["Published Date"])) === '[object Date]'){
                return "success"
            }else{
                return "error";
            }
        }
    }
    changeInput(key, value){
        //only change input when editCopy is ready otherwise changes might overide
        when(()=>{
            return this.editCopyBook;
        },()=>{
            this.editCopyBook[key] = value;
            this.changed = true;
        });
    }

    @computed
    get filterTitle(){
        let value;
        if (this.editCopyBook){
            value = this.editCopyBook["Book Title"];
        }else{
            value = this.props.book["Book Title"];
        }
        const copyValue = value.replace(/[^a-zA-Z\d\s:]/g, ""); //replace all non alpha-numerics in empty string
        //convert first chars to upper and other to lower
        const wordsArray = copyValue.split(" ");
            wordsArray.forEach((word, index)=>{
               wordsArray[index] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            });

        return wordsArray.join(" ");

    }
    render() {
        const {t} = this.props;
        return (
            <tr className="BookRow" onClick={()=>{
                //if condition to make a copy only once
                if (!this.editCopyBook){
                    //deep BookCopy
                    this.editCopyBook = toJS(this.props.book);
                }
            }}>
                <td> {this.props.index} </td>
                <td>      {this.props.book.id}</td>
                <td>
                    <FormGroup
                        validationState={this.titleValidation}>
                        <FormControl
                            type="text"
                            placeholder="Title"
                            value={this.filterTitle}
                            onChange={(e)=>{
                                this.changeInput("Book Title", e.target.value);
                            }}/>
                    </FormGroup>
                </td>
                <td><FormGroup
                    validationState={this.authorValidation}>
                    <FormControl
                        type="text"
                        placeholder="Author"
                        value={this.editCopyBook?  this.editCopyBook["Author Name"] : this.props.book["Author Name"]}
                        onChange={(e)=>{
                            this.changeInput("Author Name", e.target.value);
                        }}/>
                </FormGroup>
                </td>
                <td>
                    <FormGroup
                        validationState={this.dateValidation}>
                        <DatePicker
                            id={this.datePickerId}
                            maxDate={common.tomorrowDate.toISOString()}
                            style={{width: "100px"}}
                            showClearButton={false}
                            value={this.editCopyBook?  this.editCopyBook["Published Date"] : this.props.book["Published Date"]}
                            onChange={(value) => {
                                this.changeInput("Published Date", value);
                            }
                            }
                            onBlur={(e)=> this.changeInput("Published Date", e.target)}
                        />
                    </FormGroup>
                </td>
                <td><Button
                    onClick={()=> this.editBook()}>Edit</Button>
                    <Button onClick={this.props.deleteRow.bind(this)}>Delete</Button>
                </td>
            </tr>
        );
    }
}

