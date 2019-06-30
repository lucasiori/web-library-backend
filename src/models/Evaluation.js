const mongoose = require('mongoose');

const EvaluationSchema = new mongoose.Schema({
    id_book: String,
    note: Number,
    comment: String
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Evaluation', EvaluationSchema);