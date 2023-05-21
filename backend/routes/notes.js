const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all the notes using : "GET"/api/notes/fetchallnotes". No login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)

    } catch (error) {
        console.error(error);
        res.status(500).send("some error occoured")
    }
})

//ROUTE 2: Add a new note using : "POST"/api/notes/addnote".  login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 charachters').isLength({ min: 5 })], async (req, res) => {
        try {

            const { title, description, tag } = req.body;
            // If there are errors, return bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save()

            res.json(savedNote)
        } catch (error) {
            console.error(error);
            res.status(500).send("some error occoured")
        }
    })
//ROUTE 3: Update an existing note using : "PUT"/api/notes/updatenote".  login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {

        // create a newnote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // find the note to be updated and update it 
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error);
        res.status(500).send("some error occoured")
    }
})

//ROUTE 3: Delete an existing note using : "DELETE"/api/notes/deletenote".  login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {

        // find the note to be delete and delete it 
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }
        // allowed deleteion if user owens this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error);
        res.status(500).send("some error occoured")
    }
})
module.exports = router 