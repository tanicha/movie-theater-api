const express = require('express');
const {User} = require('../models/User');
const {Show} = require('../models/Show');
const {sequelize} = require('../db');
const router = express.Router();

//get route for all users in db
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll()
        res.status(200).json(users)
    } catch {
        console.error(error)
        res.status(404).send('No users in database')
    }
});

//get route for specific user
router.get('/:id', async (req, res) => {
    try {
        const foundUser = await User.findByPk(req.params.id)
        res.status(200).json(foundUser)
    } catch {
        console.error(error)
        res.status(404).send('Cannot find user')
    }
});

//get route for ALL shows with User specific id
router.get('/:id/shows', async (req, res) => {
    try {
        const foundUser = await User.findByPk(req.params.id)
        const showsWatchedByUser = foundUser.findAll({
            include: [
                {model: Show}
            ]
        })
        res.status(200).json(showsWatchedByUser)
    } catch {
        console.error(error)
        res.status(404).send('No shows watched by user')
    }
});

//update/patch a user's show 
router.put('/:id/shows/:showId', async (req, res) => {
    try {
        //get both ids
        const id = req.params.id
        const showId = req.params.showId

        //find the user and show
        const user = await User.findByPk(id)
        const show = await Show.findByPk(showId)

        //create association
        await user.addShow(show)

        res.status(200).send('Show has been added to user`s list!')
    } catch {
        console.error(error)
        res.status(500).send('Cannot associate show to that user')
    }
})
