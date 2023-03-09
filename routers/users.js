const express = require('express');
const {db} = require('../db');
const {User} = require('../models/User');
const {Show} = require('../models/Show');
const router = express.Router();

//get route for all users in db - postman works
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll()
        res.status(200).json(users)
    } catch(error){
        console.error(error)
        res.status(404).send('No users in database')
    }
});

//get route for specific user - postman works
router.get('/:id', async (req, res) => {
    try {
        const foundUser = await User.findByPk(req.params.id)
        res.status(200).json(foundUser)
    } catch(error){
        console.error(error)
        res.status(404).send('Cannot find user')
    }
});

//get route for ALL shows with User specific id - postman works
router.get('/:id/shows', async (req, res) => {
    try {
        const specificUser = await User.findAll({
            where: {
                id: req.params.id
            },
            include: [
                {model: Show}
            ]
      })
      res.status(200).json(specificUser)
    } catch(error){
        console.error(error)
        res.status(404).send('No shows watched by user')
    }
});

//update/put a user's show - postman works (assigning userId to show)
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

        //get all shows that are assigned to user
        const usersWithShows = await user.getShows()

        res.status(200).json(usersWithShows)
    } catch(error){
        console.error(error)
        res.status(500).send('Cannot associate show to that user')
    }
});

module.exports = router;
