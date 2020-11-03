const Joi = require('joi');


exports.productFormRequest = schemaName => async (req,res,next) => {
    let validationObjects = {
        createProduct: () => 
            Joi.object({
                name: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
            
                vendor: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
            
                quantity: Joi.number()
                    .min(1)
                    .required(),
            
                expiring_date: Joi.date()
                    .min(Date.now())
                    .message('"date" cannot be earlier than today'),

                price_per_item : Joi.number()
                    .min(0)
                    .required(),
                file : Joi.string()
            }),
        updateProduct: () => 
            Joi.object({
                email: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
            }),
        addToCart: () => 
            Joi.object({
                itemId: Joi.string().required(),
                quantity: Joi.number().required(),
            }),
        purchase: () => 
            Joi.object({
                approval: Joi.string().required()
            }),
        removeFromCart: () => 
            Joi.object({
                itemId: Joi.string().required(),
                quantity_to: Joi.number().required(),
            }),
    }
    try {
       const {error } =  validationObjects[schemaName]().validate(req.body)
       if(!error) {
           return next();
       }
       throw new Error(error)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }

}
