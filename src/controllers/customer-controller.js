'use strict'
const Customer = require('../models/customer');
const repository = require('../repositories/customer-repository');
const ValidationContract = require('../validators/fuent-validator');
const md5 = require('md5');
const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

exports.get = async (req, res, next) => {
    try {
        const data = await repository.get();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: 'Error while getting customers'
        });
    }
}

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'Title should has at least 3 characters');
    contract.isEmail(req.body.email, 'Invalid email');
    contract.hasMinLen(req.body.password, 6, 'Password should has at least 6 characters');

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles: ['user']
        });

        // I do not want to send email since I do not have sendgrid key
        //emailService.send(req.body.email, 'Welcome to Node Store', global.EMAIL_TMPL.replace('{0}', req.body.name));

        res.status(201).send({
            message: 'Customer has been created successfuly'
        });
    } catch (error) {
        res.status(400).send({
            message: 'Error while create customer'
        });
    }
}

exports.authenticate = async (req, res, next) => {
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if (!customer) {
            res.status(404).send({
                message: 'Invalid user or password'
            });
            return;
        }

        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email, 
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (error) {
        res.status(400).send({
            message: 'Error while create customer'
        });
    }
}

exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const customer = await repository.getById(data.id);

        if (!customer) {
            res.status(401).send({
                message: 'Not authorized'
            });
            return;
        }

        const newToken = await authService.generateToken({
            id: customer._id,
            email: customer.email, 
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: newToken,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (error) {
        res.status(400).send({
            message: 'Error while create customer'
        });
    }
}