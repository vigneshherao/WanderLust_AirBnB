const Joi = require('joi');

const listingValidate = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("",null),
        description: Joi.string().required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
    }).required(),
});

const reviewSchema = Joi.object({
    review: Joi.object({
        comments: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required(),
});

module.exports = { listingValidate, reviewSchema };