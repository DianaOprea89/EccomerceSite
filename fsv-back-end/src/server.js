import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import path from 'path';
import bcrypt from 'bcrypt';
import cors from 'cors';
const jwt = require('jsonwebtoken');
require('dotenv').config();


const app = express();
const corsOptions = {
    origin: 'http://localhost:8080', // Replace with your frontend's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
let db;

// Connect to MongoDB once and use it across requests
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
console.log(`Connecting to: ${connectionString}`);
MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db('vue-db');
        console.log('Connected to MongoDB');

        // Run the migration script here
        const usersCollection = db.collection('users');

        async function runMigration() {
            try {
                const result = await usersCollection.updateMany({}, {
                    $set: {
                        name: '',
                        email: '',
                        password: '',
                        passwordConfirm: '',
                        newField: 'default value'
                    }
                });
                console.log('Documents updated:', result.modifiedCount);
            } catch (error) {
                console.error('Error updating documents:', error);
            }
        }



    })
    .catch(error => {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    });

app.use(bodyParser.json());

//app.use('/assets', express.static(path.join(__dirname, '../assets')));
//app.use(express.static(path.join(__dirname, '../assets')))



app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});
// Middleware to verify JWT token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
}



app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Protected route accessed' });
});



app.get('/api/products', async(req, res) => {
    try {
        const products = await db.collection('products').find({}).toArray();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/userData', async (req, res) => {
    const { email, password } = req.body;

    const user = await db.collection('users').findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    res.status(200).json({
        name: user.name,
        email: user.email,
        id: user.id,
        cartItems: user.cartItems
    });
});



app.post('/api/cart/add', async (req, res) => {

    const { email, password, productId } = req.body;

    const user = await db.collection('users').findOne({ email });
    if (!user) {
        return res.status(404).json('Could not find user!');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json('Unauthorized');
    }

    const product = await db.collection('products').findOne({ id: productId });

    if (!product) {
        return res.status(404).json('Could not find product!');
    }

    console.log("Product added to cart successfully");

    if (!user.cartItems.includes(productId)) {

        user.cartItems.push(productId);


        await db.collection('users').updateOne({ id: user.id }, {
            $set: { cartItems: user.cartItems },
        });
    }

    const updatedUser = await db.collection('users').findOne({ id: user.id });

    res.status(200).json(updatedUser.cartItems);
});




app.get('/api/users/:userId/cart', async(req, res) => {

    try {
        const userId = req.params.userId;
        const user = await db.collection('users').findOne({ id: userId });

        if (!user) {
            return res.status(404).json('Could not find user with id: ' + userId);
        }

        const userCartItems = user.cartItems;
        const productsInCart = [];

        for (const productId of userCartItems) {
            const product = await db.collection('products').findOne({ id: productId });

            if (product) {
                productsInCart.push(product);
            }
        }

        res.status(200).json(productsInCart);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/api/products/:productId', async (req, res) => {
    const { productId } = req.params;
    const product = await db.collection('products').findOne({ id: productId });
    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json('Could not find the product!');
    }

});




app.delete('/api/users/:userId/cart/:productId',  async (req, res) => {
    const { userId, productId } = req.params;

    const user = await db.collection('users').findOne({ id: userId });

    if (!user) {
        return res.status(404).json('Could not find user!');
    }

    await db.collection('users').updateOne({ id: userId }, {
        $pull: { cartItems: productId },
    });

    const products = await db.collection('products').find({ id: { $in: user.cartItems }}).toArray();
    res.status(200).json(products);
});

app.post('/api/register', async (req, res) => {
    try {
        const { id, name, email, password, passwordConfirm } = req.body;

        if (!name || !email || !password || !passwordConfirm) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }


        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id,
            name,
            email,
            password: hashedPassword,
            cartItems: []
        };

        await db.collection('users').insertOne(newUser);

        res.status(201).json({
            message: 'User registered successfully',
            user: { name, email }
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }

});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Received login request with email:', email);

    const user = await db.collection('users').findOne({ email });
    console.log('Found user:', user);

    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }


    //const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    res.status(200).json({
        message: 'Login successful',
        user: {
            name: user.name,
            email: user.email,
            cartItems: user.cartItems,
            id: user.id
        },
        //token: token,
    });
});




app.listen(8006, () => {
    console.log('Server is listening on port 8006');
});