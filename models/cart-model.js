const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    items: [{}],
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    total_price: { type: Number},
    status: {type: String}
},{timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});

module.exports = mongoose.model('Carts', cartSchema);