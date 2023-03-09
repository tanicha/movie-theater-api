const express = require('express');
const {Show} = require('../models/Show');
const {sequelize} = require('../db');
const router = express.Router();

//get route for all shows in db
router.get('/', async (req, res) => {
    try {
        const shows = await Show.findAll()
        res.status(200).json(shows)
    } catch {
        console.error(error)
        res.status(404).send('No shows in our database')
    }
});

//get route with show of specific id
router.get('/:id', async (req, res) => {
    try {
        const foundShow = await Show.findByPk(req.params.id)
        res.status(200).json(foundShow)
    } catch {
        console.error(error)
        res.status(404).send('No shows with that ID')
    }
});

//get route for shows with specific genre
router.get('/genres/:genre', async (req, res) => {
    try {
        const foundGenre = await Show.findAll({
            where: {
                genre: req.params.genre
            }
        })
        res.status(200).json(foundGenre)
    } catch {
        console.error(error)
        res.status(404).send(`No shows with the genre of ${req.params.genre}`)
    }
});

//update/patch route for shows with specific endpoint
router.patch('/:id/:status', async (req, res) => {
    try {
        const foundShow = await Show.findByPk(req.params.id)
        const updatedShow = await foundShow.update({
            status: req.params.status
        })
        res.status(200).json(updatedShow)
    } catch {
        console.error(error)
        res.status(500).send('Could not update show')
    }
});

//update/patch status route on specific show from (cancelled -> on-going) OR (on-going -> cancelled)
router.patch('/:id/updates', async (req, res) => {
    try {
        const foundShow = await Show.findByPk(req.params.id)
        if (foundShow.status === 'cancelled'){
            await foundShow.update({
                status: 'on-going'
            })
        } else {
            await foundShow.update({
                status: 'cancelled'
            })
        }
        res.status(200).json(updatedStatus)
    } catch {
        console.error(error)
        res.status(500).send('Could not update status of show')
    }
});

//delete route for deleting specific show
router.delete('/:id', async (req, res) => {
    try {
        await Show.destory({
            where: {
                id: req.params.id
            }
        })
        res.send('Show has been deleted!')
    } catch {
        console.error(error)
        res.status(404).send('Error deleting show')
    }
});

module.exports = router;

