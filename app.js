const express = require('express') ;
const app = express() ;

const jwt = require('jsonwebtoken') ;

app.get('/api', (req, res) => {
    res.send({
        message: 'Welcome to the API'
    }) ;
})

app.post('/api/post', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        } else{
            return res.json({
                message: 'Post request succeed',
                authData
            });
        }
    })
   
})

app.post('/api/login', (req, res) => {
    //Mock an user
    const user = {
        id: 1,
        username: 'Sam',
        email: 'sam@gmail.com'
    }; 
    // const token = jwt.sign({user}, 'secretkey') ;
    // return res.json(token) ;
    jwt.sign({user}, 'secretkey', {expiresIn: '180s'},  (err, token) => {
        return res.json( {token} )
    }) ;
}); 

// Format of Token
// Authorization: Bearer <access_token>

function verifyToken(req, res, next){
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        // Split the bearerHeader at the space
        const bearer = bearerHeader.split(' ');
        // Get token from an array
        const bearerToken = bearer[1];
        req.token = bearerToken;
        // Next middleware
        next();
    }else{
        res.sendStatus(403);
    }
}

app.listen(3000, () => console.log('Server started on port 3000')) ;