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
            
                quantitiy: Joi.number()
                    .min(1)
                    .required(),
            
                expiring_date: Joi.date()
                    .format("YYYY-MM-DD")
                    .min(today())
                    .message('"date" cannot be earlier than today'),

                price_per_item : Joi.number()
                    .min(0)
                    .required()
            }),
        updateProduct: () => 
            Joi.object({
                email: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
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
