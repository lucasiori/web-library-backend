const Evaluation = require('../models/Evaluation');
const Book = require('../models/Book');

const constant = require('../constant/Constant');

module.exports = {
    async index(req, res) {
        const evaluations = await Evaluation.find({ id_book: req.params.id_book }).sort('-createdAt');

        return res.json(evaluations);
    },

    async save(req, res) {
        try {
            const id_book = req.params.id_book;
            const { note, comment } = req.body;

            if (!id_book) {
                return res.status(400).send("Parâmetros não informados!");
            }

            if (!note) {
                return res.status(400).send("Por favor informe os dados corretamente!")
            }

            const evaluation = new Evaluation({ id_book, note, comment });

            evaluation.save((err, obj) => {
                if (err) { return res.status(500).send("Erro ao salvar avaliação para o livro!"); }
            });

            const book = await Book.findById(id_book);

            const sum_evaluation = parseInt(book.evaluation_average) * parseInt(book.evaluation_number);

            book.evaluation_number += 1;
            book.evaluation_average = parseInt((sum_evaluation + parseInt(note)) / parseInt(book.evaluation_number))

            if (note <= constant.LIMIT_NEGATIVE_EVALUATION) {
                book.negative_evaluation += 1;
            } else if (note > constant.LIMIT_NEGATIVE_EVALUATION
                && note <= constant.LIMIT_NEUTRAL_EVALUATION) {
                book.neutral_evaluation += 1;
            } else {
                book.positive_evaluation += 1;
            }

            await book.save((err, obj) => {
                if (err) {
                    return res.status(500).send("Erro ao atualizar dados de avaliação do livro!");
                }
            });

            return res.json(book);
        } catch (error) {
            return res.status(500).send(error);
        }
    },
};