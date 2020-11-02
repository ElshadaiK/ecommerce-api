const { pick } = require('lodash')

const productModel = require('../models/product-model');
const cartModel = require('../models/cart-model');

exports.All = async (req, res) => {

    try {

        let sort = {}
        if(req.query.sort) {
            sort[req.query.sort] = req.query.asc ? 1 :-1 
        }

        let query = {}

        if(req.query.filter) {
            let filter = JSON.parse(req.query.filter);
            query = pick(filter, ['name', 'price_per_item']) 
            
        }
        
        const options = {
            sort: Object.values(sort).length > 0 ? sort: {
                'created_at': -1
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
        const products = await productModel.findById(req.params.id)
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
        
        const product = await productModel.create({...req.body})

        res.json(product)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
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

exports.addToCart = async (req, res, next) => {
    const {user} = req
    const {itemId, quantity} = req.body
    try{

        if(user){
            const item = await productModel.findById(itemId);
            if(item){
                const user_id = user.data._id;
                if(item.quantity >= quantity){
                    const newlyAddedItems = {
                        item: itemId,
                        amount: quantity
                    }
                    let cart = await cartModel.findOne({user: user_id, status: 'pending'})
                    if(cart){
                        cart = await cartModel.create({user: user_id, status: 'pending'})
                    }else{
                        // If there is the item added in the cart before
                    }
                    const updatedCart = await cartModel.updateOne(
                        {user: user_id, status: 'pending'},
                        {$push: {items: newlyAddedItems}},
                        {new: true}
                    );
                    // Update the store
                    
                    res.json(updatedCart);
                    next();
                }
                else{
                    throw new Error(`There aren't enough quantities available. The maximun you can buy is ${item.quantity}`)
                }
            }
            else{
                throw new Error('Item not found') 
            }
        }
        else{
            throw new Error('You have to login first') 
        }

    }
    
    catch (err) {
      res.status(404).json({
          error: true,
          message: err.message
      });
    }
}

exports.purchase = async (req, res) => {
    const {user} = req
    const {itemId, quantity} = req.body
    try{

        if(user){

        }
        
        else{
            throw new Error('You have to login first') 
        }

    }
    
    catch (err) {
      res.status(404).json({
          error: true,
          message: err.message
      });
    }
}