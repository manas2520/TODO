const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Task = require('./models/task');

// establishing mongoose connection
mongoose.connect('mongodb://localhost:27017/todo')
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.log('Mongoose error encountered');
        console.log(err);
    });

// basic setup

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// command to parse object bodies of post request
app.use(express.urlencoded({ extended: true }));
// command used to implement methods like patch,delete,put as the form can only submit GET and POST requests
app.use(methodOverride('_method'));


// ------------------------------------------Routes-------------------------------------------------------

// viewing all tasks
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find({});
    res.render('tasks/index', { tasks });
});

// adding new task (2 step procedure)
// Step 1 : Render the form
app.get('/tasks/new', (req, res) => {
    res.render('tasks/new');
});
// Step 2 : Post data from the form
app.post('/tasks', async (req, res) => {
    const task = new Task(req.body.task);
    await task.save();
    res.redirect(`/tasks`);
});


// updating a task (2 step procedure)
// Step 1 : Render the form
app.get('/tasks/:id/edit', async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    res.render('tasks/edit', { task });
});
// Step 2 : Post data from the form
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, { ...req.body.task });
    res.redirect('/tasks');
});


// deleting a task
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.redirect('/tasks');
});

// viewing priority-wise tasks
app.get('/tasks/sorted', async (req, res) => {
    const tasks = await Task.find({});
    res.render('tasks/sorted', { tasks });
});




// listening port
app.listen(3000, () => {
    console.log('Listening on port 3000');
});