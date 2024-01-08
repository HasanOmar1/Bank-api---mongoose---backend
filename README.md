# Bank-API-Backend

I have created a backend server for my frontend Bank website using MongoDB atlas / Mongoose.

I have used Postman for the endpoints with a port of 9999.

I have Clients and I have users [for signing-in/out]

### Clients info:

I have json data with users , each user has :

- ID
- Name
- Cash
- Credit
- isActive

---

### Users info:

- Name
- Email
- Password

## Links:

- Backend Link : https://bank-api-backend-using-mongoose.onrender.com/
- Frontend Link : https://bank-mongoose-frontend.netlify.app/

---

# What can you do in this server for the clients & How?

- You can get all of the Clients info.

```json
( /api/v1/bank )
```

- You can get a specific client info by typing his ID.

```json
(/api/v1/bank/[id of the client])
```

- You can get all of the Clients who has lower/equal amount of cash in the bank.

```json
(api/v1/bank/filter-cash/less-than?cash=[x amount])
```

- You can get all of the Clients who has higher/equal amount of cash in the bank.

```json
(api/v1/bank/filter-cash/more-than?cash=[x amount])
```

- You can sort Clients by cash , for descending order :

```json
(/api/v1/bank/sort-high)
```

- You can sort Clients by cash , for ascending order :

```json
(/api/v1/bank/sort-low)
```

### Protected Routes

- You can create a new client.
- You can delete a client.

- You can deposit cash to a specific client.
- You can update the credit of a specific client.

- A client can withdraw money from his bank account.
- A client can transfer money from his bank account to someone else's bank account.

---

# What can you do in this server for the users & How?

- You can get all of the Users info. (GET)

```json
( /api/v1/users )
```

- You can get a specific user info by his Token. (GET) [Protected]

```json
(/api/v1/users/token [then add the token])
```

- You can create a new user. (POST)

```json
(/api/v1/users/create)
```

- You can delete a user. (DELETE)

```json
(/api/v1/users/[id of user])
```

---

## Things to know:

- When a user withdraws money from his account , first he will withdraw from his cash and if he doesn't have anymore cash
  he will withdraw from his credit.

- When a user transfers money from his bank account to another user , he will transfer using cash and if he doesn't have cash anymore he will transfer his credit , and the other user will always get the money as credit and not as cash.

- You cannot deposit , withdraw and transfer from/to inActive Clients!

---

## How to:

I have mentioned above how to GET Clients info , in this section i will be putting the URLs for the other endpoints.
You can try these endpoints in Postman like i did.

- Create a user: /api/v1/bank then put the user info in the body. [name , cash , credit]
- Delete a user: /api/v1/bank/ [user id]
- Deposit cash to a user: /api/v1/bank/deposit-cash/ [user id] ?cash=[amount of cash]
- Update credits of a user: /api/v1/bank/update-credit/ [user id] ?credit=[amount of credit]
- Withdraw money : /api/v1/bank/withdraw/ [user id] ?money=[amount of money]
- Transfer money: /api/v1/bank/transfer/from/ [sender id] /to/ [recipient id] ?money=[amount of money]
