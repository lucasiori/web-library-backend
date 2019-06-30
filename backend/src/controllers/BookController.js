const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const Book = require('../models/Book');

module.exports = {
    async index(req, res) {
        const books = await Book.find().sort('title');

        return res.json(books);
    },

    async get(req, res) {
        try {
            const book = await Book.findById(req.params.id, (err, obj) => {
                if (err) { return res.status(204).send() }
            });

            return res.json(book);
        } catch (error) {
            return res.status(500).send(error);
        }
    },

    async save(req, res) {
        try {
            const { title, author } = req.body;

            if (!title || !author || !req.file) {
                return res.status(400).send("Por favor informe os dados corretamente!");
            }

            await sharp(req.file.path)
                .resize(200, 200)
                .jpeg({ quality: 70 })
                .toFile(path.resolve(req.file.destination, 'resized', req.file.filename));

            fs.unlinkSync(req.file.path);

            const book = new Book({
                title,
                author,
                image: req.file.filename
            });

            book.save((err, obj) => {
                if (err) { return res.status(500).send("Erro ao inserir registro!"); }
            });

            return res.json(book);
        } catch (error) {
            return res.status(500).send(error);
        }
    },

    async update(req, res) {
        try {
            const book = { title, author } = req.body;

            if (!title || !author) {
                return res.status(400).send("Por favor informe os dados corretamente!");
            }

            var fileNameImage;

            if (req.file) {
                await sharp(req.file.path)
                    .resize(200, 200)
                    .jpeg({ quality: 70 })
                    .toFile(path.resolve(req.file.destination, 'resized', req.file.filename));

                fs.unlinkSync(req.file.path);

                fileNameImage = req.file.filename;
            } else {
                const savedBook = await Book.findById(req.params.id);

                if (savedBook) { fileNameImage = savedBook.image };
            }

            Book.findByIdAndUpdate(
                req.params.id,
                { ...book, image: fileNameImage },
                { new: true },
                (err, response) => {
                    if (err) { return res.status(500).send("Erro ao atualizar registro!"); }

                    return res.send("Registro atualizado com sucesso!");
                }
            );
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    },

    async delete(req, res) {
        try {
            const book = await Book.findById(req.params.id, {});

            if (!book) { return res.status(500).send("Registro não encontrado"); }

            Book.findByIdAndRemove(req.params.id, (err, response) => {
                if (err) { return res.error("Erro ao excluir registro!"); }

                const path_name = path.resolve(
                    __dirname, '..', '..', 'uploads', 'resized', book.image
                );

                fs.unlinkSync(path_name);

                return res.send("Registro excluído com sucesso!");
            });
        } catch (error) {
            return res.status(500).send(error);
        }
    }
};