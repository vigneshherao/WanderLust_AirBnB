const Joi = require('joi');

module.exports = schemaValidate = Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().required,
        description:Joi.string().required,
        country:Joi.string().required(),
        location:Joi.string().required(),
    }).required(),
})