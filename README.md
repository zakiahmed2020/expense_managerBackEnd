## Expense Manager Api v1.0
Expense Manager is Restful API which is used to manage expenses and income.

### Overview:
* Nodejs JavaScript.
* Authentication using JWT.
* User can Login through email and password and PIN.
* Get all expenses and income.

### Installation:
Make sure to have Nodejs and Mongodb in your system.
* Download this repository and run the following command:
```terminal
npm install
```
* create `.env` file in root directory and add inside `.env` file these variables `SECRET_ACCESS_TOKEN` passing rondom String, and also `Mongodb_LocalServer` passign your local mongodb server link.
* Run API server using following command:
```terminal
nodemon
```