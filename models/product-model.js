const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    // image: {type: },
    vendor: { type: String, required: true },
    quantity: { type: Number, required: true },
    price_per_item: { type: Number, required: true },
    expiring_date: { type: Date},
},{timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});

module.exports = mongoose.model('Products', ProductSchema);