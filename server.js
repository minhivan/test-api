const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const {getPosts, getPostsByUser, getSinglePosts} = require('./controllers/post.controller')
const {getSingleUser, getUser} = require('./controllers/user.controller')




// Instantiating the express app
const app = express();


// See the react auth blog in which cors is required for access
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

// Setting up bodyParser to use json and set it to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const TOKEN = '78296248978335a6cbf24c4915a08a5a6905df73c3824d3b38c23f8d721a351a27c74b3418354bf3f02b527e53dbb22c63bf2a541196de4412f65a02d5fcbe9d'
// INstantiating the express-jwt middleware
const jwtMW = exjwt({
    secret: TOKEN, algorithms: ['HS256']
});


// MOCKING DB just for test
let users = [
    {
        id: 1,
        username: 'test',
        password: 'test123'
    },
    {
        id: 2,
        username: 'test2',
        password: 'asdf12345'
    }
];

// LOGIN ROUTE
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Use your DB ORM logic here to find user and compare password
    for (let user of users) { // I am using a simple array users which i made above
        if (username == user.username && password == user.password /* Use your password hash checking logic here !*/) {
            //If all credentials are correct do this
            let token = jwt.sign({ id: user.id, username: user.username }, TOKEN, { expiresIn: 129600 }); // Sigining the token
            res.json({
                success: true,
                token
            });
            break;
        }
        else {
            res.status(401).json({
                success: false,
                token: null,
                err: 'Username or password is incorrect'
            });
        }
    }
});

app.get('/', jwtMW /* Using the express jwt MW here */, (req, res) => {
    res.json({
        success: true,
        message: "You are authenticated"
    }); //Sending some response when authenticated
});


// USER ENDPOINTS
app.get('/users', jwtMW /* Using the express jwt MW here */, async (req, res) => {
    try {
        let users = await getUser()
        res.json({
            success: true,
            data: users
        }); //Sending some response when authenticated
    } catch (e) {
        res.status(404).json({
            success: false,

            message: e.message
        });
    }

});

app.get('/users/:id', jwtMW /* Using the express jwt MW here */, async (req, res) => {
    try {
        const user_id = req.params.id;
        let data = await getSingleUser(user_id)
        res.json({
            success: true,
            data
        }); //Sending some response when authenticated
    } catch (e) {
        res.status(404).json({
            success: false,
            message: e.message
        });
    }
});


// POST ENDPOINTS
app.get('/posts', jwtMW /* Using the express jwt MW here */, async (req, res) => {
    try {
        let data = await getPosts()
        res.json({
            success: true,
            data
        }); //Sending some response when authenticated
    } catch (e) {
        res.status(404).json({
            success: false,
            err: e.message,
            message: "Not Found"
        });
    }

});

app.get('/posts/:id', jwtMW /* Using the express jwt MW here */, async (req, res) => {
    try {
        const post_id = req.params.id;
        let data = await getSinglePosts(post_id)
        res.json({
            success: true,
            data
        });
    } catch (e) {
        res.status(404).json({
            success: false,
            message: e.message
        });
    }
});


app.use(function (req, res, next) {
    // Invalid request
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Error handling 
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
        res.status(401).send(err);
    }
    else {
        next(err);
    }
});




// Starting the app on PORT 3000
const PORT = 3000;
app.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`Magic happens on port ${PORT}`);
});