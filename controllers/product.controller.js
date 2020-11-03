const { pick } = require('lodash');
const fs = require('fs'); 
const path = require('path'); 
const upload = require('../middlewares/upload')

const productModel = require('../models/product-model');

exports.All = async (req, res) => {

    try {

        let sort = {}
        if(req.query.sort) {
            sort[req.query.sort] = req.query.asc ? 1 :-1 
        }

        let query = {}

        if(req.query.filter) {
            let filter = JSON.parse(req.query.filter);
            query = pick(filter, ['name', 'vendor', 'price_per_item']) 
            
        }
        
        const options = {
            sort: Object.values(sort).length > 0 ? sort: {
                'price_per_item': 1
            },
            page: req.query.page || 1,
            limit: req.query.limit || 10
        }
        const products = await productModel.paginate(query,options)

        res.json(products)

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
    
}

exports.get = async (req, res) => {

    try {
        const products = await productModel.findById(req.query.id)
        res.json(products)
    } catch (error) {
        res.status(404).json({
            error: true,
            message: error
        })
    }

}

exports.create = async (req, res) => {
    try {
        const {file} = req.body
        let product;
        if(file){
            product = await productModel.create({...req.body, 
                img: { 
                    data: fs.readFileSync(path.join(__dirname + '/..' + '/uploads/' + req.file.filename)), 
                    contentType: 'image/png'
                }
            })
        }
        else{
            product = await productModel.create({...req.body})
        }

        res.json(product)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }

}

exports.update = async (req, res) => {

    try {
        let product = await productModel.findById(req.params.id)
        if(product) {
            product = await productModel.updateOne({_id: product._id}, req.body)
            return res.json(product)
        }

        throw new Error('User dosen\'t exist')
       

        
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }
}

exports.remove = async (req, res) => {
    try {
        let product = await productModel.findById(req.params.id)
        if(product) {
            await productModel.remove({
                _id: product._id
            })
            return res.json(product)
        }
        throw new Error('Product doesn\t exist')

    } catch (error) {
        
    }
}
