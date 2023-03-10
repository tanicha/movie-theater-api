const express = require('express');
const app = express();
const {db} = require('./db');
const seedData = require('./seed')

//importing routers
const showsRouter = require('./routers/shows');
const usersRouter = require('./routers/users');

//server port
const port = 3000;

//allowing req.body material
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//connecting endpoint routers
app.use('/shows', showsRouter);
app.use('/users', usersRouter);

//creating port for local host address
app.listen(port, () => {
    db.sync()
    console.log(`Listening on port http://localhost:${port}`)
});