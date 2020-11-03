const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    image: {
        data: Buffer, 
        contentType: String 
    },
    vendor: { type: String, required: true },
    quantity: { type: Number, required: true },
    price_per_item: { type: Number, required: true },
    expiring_date: { type: Date},
},{timestamps: {createdAt: 'created_at', modifiedAt: 'modified_at'}
});

ProductSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Products', ProductSchema);