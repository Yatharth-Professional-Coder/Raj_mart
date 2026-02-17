const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    imageUrl: { type: String }, // Kept for backward compatibility, but UI will prefer images[0]
    images: [{ type: String }], // Array of image URLs
    category: { type: String },
    unit: { type: String, default: 'pc' },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
