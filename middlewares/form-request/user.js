const Joi = require('joi');


exports.userFormRequest = schemaName => async (req,res,next) => {
    let validationObjects = {
        createUser: () => 
            Joi.object({
                username: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .required(),
            
                password: Joi.string().required()
                    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            
                repeat_password: Joi.ref('password'),
            
                email: Joi.string()
                    .email(),
                plate_number : Joi.string().required().min(5)
            }),
        updateUser: () => 
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
