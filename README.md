#IOT 
Here API code is present with the python code.
There are multiple files:-
1. app.js :- file to just do the route functionality.
2. AuthController.js :- does all the authentication part of the API.
3. config.js :- contains the secret key for the creation of the data.
4. db.js :- database connection.
5. server.js :- it just start the server.
6. analog.js:- contains the analog schema.
7. digital.js :- contains the digital schema.
8. User.js :- contains the schema for user.
9. UserController :- controls the activity for the user.

Now i write the code according to our project need and i completely keep only client in my mind so 
no user can see the data or change the data. Only database handlers can see the data.

Now flow of the API:-
1. User need to register using url /api/auth/register , it will create a user with user id, name, email and password and stored in the databse.
2. Step one will be done only one time for one user.
3. If user wnats to send the data, they should first login using url /api/auth/login, it will create a token using secret key and user id in encrypted version and send back that token to user. Token will be expire in 24 hours so user need's to be login after every 24 hours and generate token. This token after login will be used to send data.
4. Now after login, user have token and their own user id, now user have to provide the token and user id in the header which will be url encoded form. If tokens and user id matches then only user can send the data using url /users/digital or 
/users/analog. Now if either of the token or url not matches with the data base and with each other user will not able to send the data and error will come that worng userid or authentication fail for token.
5. If everything is fine data will be stored in the respecitve collections with message data added.

I attached the screen shots outputs of all the possible cases.
