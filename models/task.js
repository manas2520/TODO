const mongoose = require('mongoose');
// here we are making a reference to the Schema so that we can easily refer to it again and again
const Schema = mongoose.Schema;

// Designing the task schema
const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isDone: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
    },
});

// creating model from schema
const Task = mongoose.model('Task', taskSchema);

// exporting the model
module.exports = Task;