'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config')
const app = express();
app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({ extended: false }));

// cors
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// routes
const indexRoutes = require('./routes/index');
const productRoutes = require('./routes/product');
const customerRoutes = require('./routes/customer-route');
const orderRoutes = require('./routes/order-route');
app.use('/', indexRoutes);
app.use('/products', productRoutes);
app.use('/customers', customerRoutes);
app.use('/orders', orderRoutes);

// database
mongoose.connect(config.connectionString);

// models
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');

module.exports = app;