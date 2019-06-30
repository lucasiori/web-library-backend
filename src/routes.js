const express = require('express');
const multer = require('multer');
const uploaderConfig = require('./config/uploader');
const BookController = require('./controllers/BookController');
const EvaluationController = require('./controllers/EvaluationController');

const routes = new express.Router()
const uploader = multer(uploaderConfig);

routes.get('/book', BookController.index);
routes.get('/book/:id', BookController.get);
routes.post('/book', uploader.single('image'), BookController.save);
routes.put('/book/:id', uploader.single('image'), BookController.update);
routes.delete('/book/:id', BookController.delete);

routes.get('/evaluation/:id_book', EvaluationController.index);
routes.post('/evaluation/:id_book', uploader.none(), EvaluationController.save);

module.exports = routes;