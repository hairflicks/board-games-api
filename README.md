# Welcome to my board game API

**info** 

This project aims to host a working board game api using node, express and psql. It creates a database of categories,comments,reviews and users which can then be accessed through different endpoints eg: /api/reviews. Queries can also be used on certain endpoints to narrow down results. Please refer to endpoints.js if you wish to see all available endpoints (or /api endpoint on hosted version)



**setup**

Please run npm install to being with to install all required packages.
To use this project locally please add a .env.development and .env.test file to set the names of your development and test databases respectively. This names can be seen/changed in setup.sql. Set them by writing PGDATABASE=<database_name> in the .env files. 
Once completed you can create your database by running "npm run setup-dbs" in the terminal. To populate the databases with development data type "npm run seed". 
If you wish to run tests to make sure everything is setup correctly then use the command "npm run test" (this will also seed your test database with test data for you)

[Hosted version of API](https://board-games-api-89zv.onrender.com/api "Hosted api")

**warning**

Please make sure you have Node.js v19.8.1 and Postgres V14.7