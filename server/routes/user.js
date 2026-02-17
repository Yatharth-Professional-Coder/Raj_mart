const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');

// Get All Products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({ stock: { $gt: 0 } }); // Only show in-stock products? Or show all with Out of Stock badge? 
        // Requirement says "update available items", implies dynamic. Let's return all and handle UI.
        const allProducts = await Product.find();
        res.json(allProducts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Place Order
router.post('/orders', async (req, res) => {
    try {
        const { customerName, address, phone, items } = req.body;

        // Calculate total on server side for security
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) continue;

            // Check stock
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Not enough stock for ${product.name}` });
            }

            // Decrement stock
            product.stock -= item.quantity;
            await product.save();

            const price = product.price - (product.discount || 0); // Apply discount
            const itemTotal = price * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                productId: product._id,
                productName: product.name,
                quantity: item.quantity,
                priceAtPurchase: price
            });
        }

        // Delivery Charge Logic
        let deliveryCharge = 40;
        if (totalAmount >= 200) {
            deliveryCharge = 0;
        }

        const finalTotal = totalAmount + deliveryCharge;

        const order = new Order({
            customerName,
            address,
            phone,
            items: orderItems,
            totalAmount: finalTotal,
            deliveryCharge,
            status: 'Pending',
            paymentMethod: 'COD'
        });

        await order.save();
        res.status(201).json(order);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get Order Details (for confirmation page)
router.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
