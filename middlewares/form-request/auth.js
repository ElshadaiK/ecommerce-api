const Joi = require('joi');
const Joi_Num = Joi.extend(require('joi-phone-number'));


exports.authFormRequest = schemaName => async (req,res,next) => {
    let validationObjects = {
        loginUser: () => 
            Joi.object({
                email: Joi.string().required()
                    .email(),
            
                password: Joi.string().required()
                    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            }),
        createUser: () => 
            Joi.object({
                name: Joi.string()
                    .alphanum()
                    .min(3)
                    .max(30)
                    .pattern(new RegExp('^[a-zA-Z]{4,}(?: [a-zA-Z]+){0,2}$'))
                    .required(),
            
                password: Joi.string().required()
                    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            
                repeat_password: Joi.ref('password'),
            
                email: Joi.string().required()
                    .email(),
                
                phone_no : Joi_Num.string().phoneNumber().required(),
                
            }),
        forgetPassword: () => 
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
