const express = require('express');
const {Show} = require('../models/Show');
const {db} = require('../db');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const e = require('express');

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
        res.status(404).send('Cannot find show with given ID')
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
        res.status(404).send('No shows in the given genre')
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

//put route for updating the rating for shows with specific endpoint - postman works
router.put('/:id/watched',[check("rating").not().isEmpty().trim()], async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            res.json({errors: errors.array()})
        } else {
            const foundShow = await Show.findByPk(req.params.id)
            await foundShow.update({
                rating: req.body.rating
            })
            res.status(200).json(foundShow)
        }
    } catch(error){
        console.error(error)
        res.status(500).send('Cannot update show')
    }
});

//put route for updating status on specific show from (cancelled -> on-going) OR (on-going -> cancelled) - postman works
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

/* TANI NOTE:

    the router above is different from below:
    
    the router ABOVE will change a show that already has a status of 'on-going' OR 'cancelled' TO the opposite status (meaning there are only two options - 'on-going' OR 'cancelled') 

    the router BELOW will be to update/change a show's status manually - using req.body 

    (instructions in coding rooms was a bit confusing, so i added two routes to cover each instruction)
*/

//put route for updating status manually - using req.body - postman works
router.put('/:id',[check("status").not().isEmpty().trim().isLength({min: 5, max: 25})], async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            res.json({errors: errors.array()})
        } else {
            const show = await Show.findByPk(req.params.id)
            await show.update({
                status: req.body.status
            })
            res.status(200).json(show)
        }
    } catch(error){
        console.log(error)
        res.status(404).send('Cannot update status')
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

