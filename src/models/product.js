'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        require: [true, 'Slug is required'],
        trim: true,
        index: true,
        unique: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    active: {
        type: Boolean,
        require: true,
        default: true
    },
    tags: [{
        type: String,
        require: true
    }],
    image: {
        type: String,
        //required: true,
        trim: true
    }
});

module.exports = mongoose.model('Product', schema);