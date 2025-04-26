const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

const { visitURL } = require('../bot/bot.js');

const db = {};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function escapeString(unsafe) {
  return JSON.stringify(unsafe).slice(1, -1)
  .replace(/\\/g, '\\\\')
  .replace(/</g, '\\x3C')
  .replace(/>/g, '\\x3E')
  .replace(/'/g, "\\'")
  .replace(/\r/g, '\\r')
  .replace(/\n/g, '\\n')
  .replace(/\t/g, '\\t')
  .replace(/\f/g, '\\f');
}

app.get('/', (req, res) => {
  res.render('note');
});

app.post('/notes', (req, res) => {
  const note = req.body.note;
  const id = uuidv4();
  db[id] = note;
  res.redirect(`/notes/${id}`);
});

app.get('/notes/:id', (req, res) => {
  const id = req.params.id;
  const note = db[id] || "Note not found";
  
  const escaped = escapeString(note);
  
  res.render('note-detail', { noteId: id, note: escaped, id: id });
});

app.get('/notes', (req, res) => {
  res.render('notes-list', { notes: db });
});

app.get('/report/:id', (req, res) => {
  const noteId = req.params.id;
  
  if (!db[noteId]) {
    return res.status(404).send('Note not found');
  }
  
  const noteUrl = `http://localhost:${port}/notes/${noteId}`;
  
  setTimeout(() => {
    visitURL(noteUrl)
      .catch(err => console.error(`Error having bot visit note ${noteId}:`, err));
  }, 1000);
  
  res.send(`
    <html>
      <head>
        <meta http-equiv="refresh" content="3;url=/notes">
        <title>Report Submitted</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
          }
          .message {
            background-color: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <h1>Report Submitted</h1>
        <div class="message">
          Thank you for reporting this note. An admin will review it shortly.
        </div>
        <p>Redirecting back to notes list in 3 seconds...</p>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});