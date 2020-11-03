const productModel = require('../models/product-model');
const cartModel = require('../models/cart-model');

exports.addToCart = async (req, res, next) => {
    const {user} = req
    const {itemId, quantity} = req.body
    try{

        if(user){
            const item = await productModel.findById(itemId);
            if(item){
                const user_id = user.data._id;
                if(item.quantity == 0) throw new Error("Store out of the item you requested")
                if(item.quantity >= quantity){
                    const newlyAddedItems = {
                        item: itemId,
                        amount: quantity
                    }
                    const remaining_amount = item.quantity - quantity;
                    let items_found = false
                    let available_items;
                    let cart = await cartModel.findOne({user: user_id, status: 'pending'})
                    if(!cart){
                        // If there is no cart with pending state
                        cart = await cartModel.create({user: user_id, status: 'pending'})
                    }else{
                        // If there is the item added in the cart before
                        available_items = cart.items
                        const found = available_items.findIndex(available_item => available_item.item == itemId)
                        if(found !== -1){
                            items_found = true
                            available_items[found].amount = +available_items[found].amount + +quantity 
                            }
                    }
                    // Updating the cart
                    let updatedCart;
                    if(!items_found){
                        updatedCart = await cartModel.findOneAndUpdate(
                            {user: user_id, status: 'pending'},
                            {$push: {items: newlyAddedItems}},
                            {new: true}
                        );
                    }
                    else{
                        // If the item is already there 
                        updatedCart = await cartModel.findOneAndUpdate(
                            {user: user_id, status: 'pending'},
                            {items: available_items},
                            {new: true}
                        )
                    }
                    // Update the store
                    const updated_item = await productModel.updateOne(
                        {_id: itemId},
                        {quantity: remaining_amount}
                        );
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

exports.removeFromCart = async (req, res, next) => {
    const {user} = req
    const {itemId, quantity_to} = req.body
    try{

        if(user){
            const user_id = user.data._id
            const item = await productModel.findById(itemId);
            const cart = await cartModel.findOne({user: user_id, status: 'pending'})

            if(!cart) throw new Error("You don't have a cart");


            available_items = cart.items

            const found = available_items.findIndex(available_item => available_item.item == itemId)
            if(found !== -1){

                if(quantity_to >= available_items[found].amount) throw new Error("You don't have this amount of item in your cart")

                // update cart
                const store_amount = item.quantity + (+available_items[found].amount - quantity_to)
                
                let updatedCart;
                if(quantity_to != 0){
                    available_items[found].amount = +quantity_to
                    updatedCart = await cartModel.findOneAndUpdate(
                        {user: user_id, status: 'pending'},
                        {items: available_items},
                        {new: true}
                    )                
                }
                else{
                    updatedCart = await cartModel.findOneAndUpdate(
                        {user: user_id, status: 'pending'},
                        {$pull: {items: available_items[found]}},
                        {new: true}
                    );
                }

                // update store
                const updated_item = await productModel.updateOne(
                    {_id: itemId},
                    {quantity: store_amount}
                    );
                
                res.json(updatedCart)
                next;
            }
            else{
                throw new Error("Item not found in your cart")
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

exports.getCart = async (req, res, next) => {
    const {user} = req
    try{

        if(user){
            const user_id = user.data._id
            const cart = await cartModel.findOne({user: user_id, status: 'pending'}).populate({path: 'items.item', model: 'Products', select: 'name'})
            if(!cart) throw new Error("You don't have a cart");
            res.json(cart)
            next()
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

exports.getTotal = async (req, res, next) => {
    const {user} = req
    try{

        if(user){
            const user_id = user.data._id
            const cart = await cartModel.findOne({user: user_id, status: 'pending'})
            if(!cart) throw new Error("You don't have a cart");
            const available_items = cart.items
            let total = 0;
            for (let index = 0; index < available_items.length; index++) {
                const itemId = available_items[index].item
                const product = await productModel.findById(itemId);
                total += (product.price_per_item) * (+available_items[index].amount)
                
            }
            const updatedCart = await cartModel.findOneAndUpdate(
                {user: user_id, status: 'pending'},
                {total_price: total},
                {new: true}
            );
            res.json(updatedCart)
            next()
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

exports.clear = async (req, res, next) => {
    const {user} = req
    try{
        if(user){
            const user_id = user.data._id;
            const cart = await cartModel.findOne({user: user_id, status: 'pending'})
            if(cart){
                const items_in_cart = cart.items
                // Update cart
                updatedCart = await cartModel.findOneAndUpdate(
                    {user: user_id, status: 'pending'},
                    {items: [], total_price: 0},
                    {new: true}
                )
                // Update Store
                for (let index = 0; index < items_in_cart.length; index++) {
                    const itemId = items_in_cart[index].item
                    const itemAmount = items_in_cart[index].amount
                    const item = await productModel.findById(itemId);
                    const remaining_amount = +itemAmount + item.quantity
                    let updated_item = await productModel.updateOne(
                        {_id: itemId},
                        {quantity: remaining_amount}
                        );
                }

                res.json(updatedCart);
                next();
            }
            else{
                throw new Error("You don't have a cart")
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