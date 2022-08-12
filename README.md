# Expense Manager Api v1.0
Expense Manager is Restful API which is used to manage expenses and income.

### Overview:
* this API was builded Nodejs and MongoDB.
* it uses Authentication JWT to protect the API.
* User can Login through email and password and PIN.
* Get all expenses and income.

### Installation:
Make sure to have Nodejs and Mongodb in your system.
* clone this repository and run the following command:
```terminal
npm install
```
* create `.env` file in root directory and add inside `.env` file these variables `SECRET_ACCESS_TOKEN` passing rondom String, and also `Mongodb_LocalServer` passing your local mongodb server link.
* Run API server using following command:
```terminal
nodemon
```

### How can we use this API endpoints?
first you need to create an account and login to get access token, calling this endpoint `/api/v1/auth/login` with following body:
```json
{
    "username": "your_username",
    "password": "your_password"
}
```
or you can login with pin to get access token, calling this endpoint `/api/v1/auth/loginWithPin` with following body:
```json
{
    "pin_Number": "your_pin"
}
```
after you get access token, you can call any endpoint of this API, but you need to add `Authorization` header with access token.


### Contribute this API
you can contribute this API by creating a pull request on this repository by forking, adding your code and submit a pull request, but make sure to add new ideas and features.

### Authors
* [Zaki Ahmed](https://www.github.com/zakiahmed2020)
* [Abdorizak Abdalla](https://www.github.com/abdorizak)

### License
* [MIT License](#license)

