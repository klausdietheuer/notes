const notesRouter = require('express').Router()
const Notes = require('../models/note')

notesRouter.get('/', (request, response) => {
    Notes.find({}).then(notes => {
        response.json(notes)
    })
})

notesRouter.get('/:id', (request, response, next) => {
    Notes.findById(request.params.id)
         .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
         .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
    const body = request.body

    const note = new Notes({
        content: body.content,
        important: body.important || false,
    })

    note.save()
        .then(savedNote => {
            response.json(savedNote)
        })
        .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
    Notes.findByIdAndDelete(request.params.id)
         .then(() => {
            response.status(204).end()
        })
         .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
    const {content, important} = request.body

    Notes.findById(request.params.id)
         .then(note => {
            if (!note) {
                return response.status(404).end()
            }

            note.content = content
            note.important = important

            return note.save().then((updatedNote) => {
                response.json(updatedNote)
            })
        })
         .catch(error => next(error))
})

module.exports = notesRouter