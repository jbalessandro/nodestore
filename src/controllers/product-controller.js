'use strict';
const Product = require('../models/product');
const ValidationContract = require('../validators/fuent-validator');
const repository = require('../repositories/product-repository');
const azure = require('azure-storage');
const guid = require('guid');
const config = require('../config');
const { restart } = require('nodemon');

exports.get = async (req, res, next) => {
    try {
        const data = await repository.get();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Error while get products'
        });
    }
}

exports.getBySlug = async (req, res, next) => {
    try {
        const data = await repository.getBySlug(req.params.slug);
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send({
            message: 'Error',
            data: error
        });
    }
}

exports.getByTag = async (req, res, next) => {
    try {
        const data = await repository.getByTag(req.params.tag);
        return res.status(200).send(data);
    } catch (error) {
        res.status(400).send({
            message: 'Error',
            data: error
        });
    }
}

exports.getById = async (req, res, next) => {
    try {
        const data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send({
            message: 'Error',
            data: error
        });
    }
}

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'Title should has at least 3 characters');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        // Blob Service
        // const blobService = azure.createBlobService(config.containerConnectionString);

        // let fileName = guid.raw().toString() + '.jpg';
        // let rawdata = req.body.image;
        // let matches = rawdata.match('/^data:([A-Za-z-+\/]+);base64,(.+)$/');
        // let type = matches[1];
        // let buffer = new Buffer(matches[2], 'base64');

        // // Save image
        // await blobService.createBlockBlobFromText('product-images', fileName, buffer, {
        //     contentType: type,            
        // }, function (error, result, response) {
        //     if (error) {
        //         fileName = 'default-product.png'
        //     }
        // });

        await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
            //image: 'https://nodestr.blob.core.windows.net/product-images/' + fileName
            images: 'test.jpg'
        });

        res.status(201).send({
            message: 'Product has been created successfuly'
        });
    } catch (error) {
        res.status(400).send({
            message: 'Error during product creation',
            data: error
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        await repository.update(req.body);
        res.status(200).send({
            message: 'Product udpated'
        });
    } catch (error) {
        res.status(400).send({
            message: 'Error during product updating',
            data: error
        });
    }
};

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.params.id);
        res.status(200).send({
            message: 'Product deleted'
        });
    } catch (error) {
        res.status(400).send({
            message: 'Error while deleting product',
            data: error
        });
    }
};