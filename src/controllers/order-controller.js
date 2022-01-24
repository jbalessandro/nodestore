'use strict'
const Order = require('../models/order');
const guid = require('guid');
const repository = require('../repositories/order-repository');
const authService = require('../services/auth-service');

exports.get = async (req, res, next) => {
    try {
        const data = await repository.get();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Error while getting orders'
        });
    }
}

exports.post = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);
        
        const order = {
            customer: data.id,
            number: guid.raw().substring(0,6),
            items: req.body.items
        };
        console.log(order);

        await repository.create({order});

        res.status(201).send({
            message: 'Order has been created successfuly'
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: 'Error while create order'
        });
    }
}