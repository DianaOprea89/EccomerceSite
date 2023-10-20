# EccomerceSite
This is an eCommerce site I created from scratch after completing two separate video trainings: one from Udemy, "The Complete Nodejs MySQL Login System," and another from YouTube titled "Creating and Hosting a Full-Stack E-Commerce Site | Vue JS, NodeJS, MongoDB, Postman, Express server."

So, on this eCommerce site, I have used VueJS, NodeJS with Express, and MongoDB. On this site, you can register as a new user using the registration component. Afterward, you can log in using the user and password you provided during registration. The information is saved in the database created using MongoDB. The products in the cart are added based on the userID of the logged-in user and the productID of the selected product. If the product is already in the cart, the button will display an additional message, "Successfully added to the cart."

Clicking the Cart button will display the CartPage Component, which contains all the products the connected user has in their cartItems. You can also remove items from the cart and adjust the quantity of products by clicking the up and down arrows. You can add or remove as many products as you want. However, if you remove the last item (count=0), the product will be completely removed from the cart.

To start this project, you need to run a npm install in order to install all dependencies and after that you need  to open three terminals:

- One for the frontend in the "fsv-front-end" folder, using the command "npm start."
- One for the backend in the "fsv-back-end" folder, also using "npm start."
- Another terminal in the "fsv-back-end" folder is needed to start our database with the command "mongod." Make sure to connect to MongoDB Compass so that you can access your database.


