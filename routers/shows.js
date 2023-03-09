const express = require('express');
const {Show} = require('../models/Show');
const {db} = require('../db');
const router = express.Router();

//get route for all shows in db - postman works
router.get('/', async (req, res) => {
    try {
        const shows = await Show.findAll()
        res.status(200).json(shows)
    } catch(error){
        console.error(error)
        res.status(404).send('No shows in our database')
    }
});

//get route with show of specific id - postman works
router.get('/:id', async (req, res) => {
    try {
        const foundShow = await Show.findByPk(req.params.id)
        res.status(200).json(foundShow)
    } catch(error){
        console.error(error)
        res.status(404).send('No shows with that ID')
    }
});

//get route for shows with specific genre - postman works
router.get('/genres/:genre', async (req, res) => {
    try {
        const foundGenre = await Show.findAll({
            where: {
                genre: req.params.genre
            }
        })
        res.status(200).json(foundGenre)
    } catch(error){
        console.error(error)
        res.status(404).send(`No shows with the genre of ${req.params.genre}`)
    }
});

//post route for creating new show - postman works
router.post('/', async (req, res) => {
    try {
        const newShow = await Show.create({
            title: req.body.title,
            genre: req.body.genre,
            rating: req.body.rating,
            status: req.body.status
        })
        res.status(200).json(newShow)
    } catch {
        console.error(error)
        res.status(404).send('Cannot create show')
    }
})

//update/put route for rating for shows with specific endpoint - postman works
router.put('/:id/watched', async (req, res) => {
    try {
        const foundShow = await Show.findByPk(req.params.id)
        await foundShow.update({
            rating: req.body.rating
        })
        res.status(200).json(foundShow)
    } catch(error){
        console.error(error)
        res.status(500).send('Could not update show')
    }
});

//update/put status route on specific show from (cancelled -> on-going) OR (on-going -> cancelled) - postman works
router.put('/:id/updates', async (req, res) => {
    try {
        const updatedStatus = await Show.findByPk(req.params.id)
        if (updatedStatus.status === 'cancelled'){
            await updatedStatus.update({
                status: 'on-going'
            })
        } else {
            await updatedStatus.update({
                status: 'cancelled'
            })
        }
        res.status(200).json(updatedStatus)
    } catch(error){
        console.error(error)
        res.status(500).send('Cannot update status of show')
    }
});

//delete route for deleting specific show - postman works
router.delete('/:id', async (req, res) => {
    try {
        await Show.destroy({
            where: {
                id: req.params.id
            }
        })
        res.send('Show has been deleted!')
    } catch(error){
        console.error(error)
        res.status(404).send('Error deleting show')
    }
});

module.exports = router;

