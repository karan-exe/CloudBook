const express = require('express');
const router = express.Router();
const { query, validationResult, body } = require('express-validator');

var fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Notes')
// const mongoose = require('mongoose');

// const { ObjectId } = mongoose.Types;
//const userId = new mongoose.Types.ObjectId(req.user.id);

//Route 1: get all notes using GET using http://localhost:3000/api/note/fetchallnotes Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        // console.log({user:req.user.id})
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured")
    }
})
//Route 2: Add notes using POST using http://localhost:3000/api/note/addnote  Login required
router.post('/addnote', fetchuser, [
    body('title', 'enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id

        })
        const savednote = await note.save()
        res.json(savednote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured")
    }

})

//Route 3: update note using PUT using http://localhost:3000/api/note/updatenote Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // create a newNote object
        const newNote = {}
        if (title) {
            { newNote.title = title }
        }
        if (description) {
            { newNote.description = description }
        }
        if (tag) {
            { newNote.tag = tag }
        }
        //check if user who wants to update this note is their's note only then allow them

        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).send("Not found") }
        //Allow updation if only user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        // find by user id and update the note
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured")
    }
})
//Route 4: delete note using DELETE using http://localhost:3000/api/note/updatenote Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //check if user who wants to delete this note is their's note only then allow them
        let note = await Note.findById(req.params.id)
        if (!note) { return res.status(404).send("Not found") }
        //Allow deletion if only user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }
        // find by id and deleted the note
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "success": "note has been deleted", note: note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured")
    }
})

module.exports = router  