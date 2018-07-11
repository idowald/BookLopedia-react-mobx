# BookloPedia

A mobx + react + react-bootstrap + ajax example of CRUD a list of books + DatePicker + Toastrs + computed

## Getting Started

1. Download/clone all files
2. In the file run cmd and 
```
npm install
```
3. Run the application
```
npm start
```

### Bugs/not prepared features

1. Error handling from "mock server" i did aren't complete.
2. DatePicker library has a problem- when using the keyboard to write an invalid date- it will throw an error to console. but it won't affect the application life.



### Features
-all CRUD- update/delete/create books
-using computed to optimize validation tests
-when changing a book and pressing "edit" and then press "cancel"- it will discard changes in the row.
-filter from title specail characters and making first character uppercase and the rest lower (in each word)


