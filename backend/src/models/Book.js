const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    image: String,
    evaluation_average: { type: Number, default: 0 },
    evaluation_number: { type: Number, default: 0 },
    positive_evaluation: { type: Number, default: 0},
    neutral_evaluation: { type: Number, default: 0},
    negative_evaluation: { type: Number, default: 0}
}, {
        timestamps: true
    }
);

module.exports = mongoose.model('Book', BookSchema);