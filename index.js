const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const PORT = process.ev.PORT || 3001

const cors = require('cors')
app.use(cors())

var morgan = require('morgan')
app.use(morgan((tokens, req, res) => {
    return req.method + ' ' + req.path + ' ' + JSON.stringify(req.body)
}))

app.use(bodyParser.json())

let notes = [{
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "SOMEONE",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "someOne",
        "number": "39-44-5323523",
        "id": 3
    },
    {
        "name": "SomeOne",
        "number": "39-44-5323523",
        "id": 4
    },
    {
        "name": "Some one",
        "number": "39-44-5323523",
        "id": 5
    },
    {
        "name": "Someone",
        "number": "39-44-5323523",
        "id": 6
    }
];

app.get('/', (request, response) => {
    response.send('<h1>homepage</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(notes)
})

app.post('/api/persons', (request, response) => {
    const maxID = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
    const note = request.body
    if (!note.name) {
        return response.status(400).json({
            error: 'Missing Name'
        })
    } else if (!note.number) {
        return response.status(400).json({
            error: 'Missing Number'
        })
    }
    note.id = maxID + 1;
    notes = notes.concat(note)
    response.json(note)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

app.get('/info', (request, response) => {
    var currentTime = new Date()
    var day = new Intl.DateTimeFormat('en-US', {
        weekday: 'long'
    }).format(currentTime)
    var month = new Intl.DateTimeFormat('en-US', {
        month: 'long'
    }).format(currentTime)
    var dd = String(currentTime.getDate()).padStart(2, '0');
    var yyyy = currentTime.getFullYear();
    var hours = String(currentTime.getHours()).padStart(2, '0')
    var minutes = String(currentTime.getMinutes()).padStart(2, '0')
    currentTime = day + ' ' + month + ' ' + dd + ' ' + yyyy + ' ' + hours + ':' + minutes;

    response.send(`<h3>Phonebook has information for ${notes.length} people.<h3><br/>${currentTime}`)
})

//bodyParser is an example of middleware.
//creating own middleware
const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'Non existent endpoint'
    })
}
app.use(unknownEndpoint)



app.listen(PORT, () => {
    console.log(`Running server on port ${PORT}`)
})