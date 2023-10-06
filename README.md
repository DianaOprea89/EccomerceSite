# EccomerceSite
This is an eCommerce site I did from scratch after seeing 2 video trainings separately, one from Udemy, The Complete Nodejs MySQL Login System, and one from YouTube Creating and Hosting a Full-Stack E-Commerce Site | Vue JS, NodeJS, MongoDB, Postman, Express server
So on this eCommerce site,  you can register a user, on the register component, and after that login based on the user and password that you used when you registered. The information is saved in the database created using MongoDB,  and the products in the cart are added based on the user ID that is logged in  and the productID, if the product is already added to the cart the button with add to cart will become disabled. The message "Item is already in the cart!" will appear, this check is done against the database created in MongoDB:

 In order to start this project you need to open 3 terminals, and keep them open, 
 
     -one for the frontend - on the fsv-front-end folder, with the command npm start, 
     
     -one for the backend, on the fsv-back-end folder also with npm start,
     
     -and also on this folder fsv-back-end but different terminal we need to start our database with the  command mongod, also make sure to connect in mongoDB Compass so that you can use your database 
