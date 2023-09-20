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
let db; // We'll initialize this once and reuse it

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
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.post('/api/token/refresh', async (req, res) => {
    const { refreshToken } = req.body; // Getting refreshToken from request body

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        // Validate the existing refresh token
        const decodedRefreshToken = jwt.verify(refreshToken, 'yourRefreshSecretKeyHere'); // Ideally, replace 'yourRefreshSecretKeyHere' with a secret stored in env variables

        // If it's valid, generate a new access token
        const newAccessToken = jwt.sign({ id: decodedRefreshToken.id }, 'yourSecretKeyHere', { expiresIn: '1h' }); // Ideally, replace 'yourSecretKeyHere' with a secret stored in env variables

        // Send the new access token back to the client
        res.status(200).json({ accessToken: newAccessToken });

    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
});

app.get('/api/products', async (req, res) => {
    const products = await db.collection('products').find({}).toArray();
    res.status(200).json(products);

});

app.get('/api/users/:userId/cart', async (req, res) => {
    console.log('Fetching cart for userId:', req.params.userId); // Access userId directly
    const token = req.headers.authorization;
    const { userId } = req.params;
    const user = await db.collection('users').findOne({ id: userId });
    if (!user) return res.status(404).json('Could not find user!');

    const products = await db.collection('products').find({ id: { $in: user.cartItems }}).toArray();
    res.status(200).json(products);
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

app.post('/api/users/:userId/cart', async (req, res) => {
    const token = req.headers.authorization;

    try {
        const decodedToken = jwt.verify(token, 'yourSecretKeyHere');
        const userId = decodedToken.id;
        console.log(userId)

        const { productId } = req.body;

        const user = await db.collection('users').findOne({ id: userId });

        if (!user) {
            return res.status(404).json('Could not find user!');
        }

        await db.collection('users').updateOne({ id: userId }, {
            $addToSet: { cartItems: productId },
        });

        const products = await db.collection('products').find({ id: { $in: user.cartItems }}).toArray();
        res.status(200).json(products);
    } catch (error) {
        res.status(401).json('Unauthorized');
    }
});


app.delete('/api/users/:userId/cart/:productId', async (req, res) => {
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

        // Check if user already exists based on the email address
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Directly using a number as salt rounds

        const newUser = {
            id,
            name,
            email,
            password: hashedPassword,
            cartItems: []
        };

        // Insert the new user into the database
        await db.collection('users').insertOne(newUser);

        // Generate a JWT token for the user
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });


        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { name, email }
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error' });
    }

});
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.collection('users').findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user.id }, 'yourSecretKeyHere', { expiresIn: '1h' });

    // Return a success response along with user information (excluding password)
    res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            name: user.name,
            email: user.email,
            cartItems: user.cartItems,
            id:user.id
        }
    });
});


app.listen(8004, () => {
    console.log('Server is listening on port 8004');
});
