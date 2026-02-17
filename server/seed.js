const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
// Fallback if .env is in root or different place during dev
if (!process.env.MONGODB_URI) require('dotenv').config();

const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');


const products = [
    // Dairy & Bread
    { name: 'Amul Taaza Fresh Toned Milk', price: 54, discount: 2, stock: 50, category: 'Dairy & Bread', imageUrl: 'https://www.jiomart.com/images/product/original/490001885/amul-taaza-fresh-toned-milk-1-l-product-images-o490001885-p590001538-0-202203151532.jpg', unit: '1 L' },
    { name: 'Amul Salted Butter', price: 56, discount: 0, stock: 30, category: 'Dairy & Bread', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/104864_8-amul-butter-pasteurised.jpg', unit: '100 g' },
    { name: 'Brittania 100% Whole Wheat Bread', price: 50, discount: 5, stock: 20, category: 'Dairy & Bread', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/40003150_4-britannia-bread-100-whole-wheat.jpg', unit: '450 g' },
    { name: 'Amul Masti Spiced Buttermilk', price: 15, discount: 0, stock: 100, category: 'Dairy & Bread', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/161864_8-amul-masti-spiced-buttermilk.jpg', unit: '200 ml' },
    { name: 'Paneer (Fresh)', price: 95, discount: 10, stock: 25, category: 'Dairy & Bread', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/40045447_4-fresho-malai-paneer.jpg', unit: '200 g' },

    // Snacks & Munchies
    { name: 'Lays India\'s Magic Masala', price: 20, discount: 0, stock: 100, category: 'Snacks', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/294297_16-lays-potato-chips-indias-magic-masala-flavour-best-quality-crunchy.jpg', unit: '52 g' },
    { name: 'Kurkure Masala Munch', price: 20, discount: 0, stock: 100, category: 'Snacks', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/294324_9-kurkure-namkeen-masala-munch.jpg', unit: '82 g' },
    { name: 'Coca-Cola Soft Drink', price: 40, discount: 2, stock: 60, category: 'Snacks', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/251023_11-coca-cola-soft-drink-original-taste.jpg', unit: '750 ml' },
    { name: 'Cadbury Dairy Milk Silk', price: 80, discount: 5, stock: 40, category: 'Snacks', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/281358_16-cadbury-dairy-milk-silk-chocolate.jpg', unit: '60 g' },
    { name: 'Good Day Cashew Cookies', price: 30, discount: 5, stock: 50, category: 'Snacks', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/265749_14-britannia-good-day-cookies-cashew.jpg', unit: '200 g' },

    // Fruits & Vegetables
    { name: 'Fresh Tomato (Hybrid)', price: 38, discount: 10, stock: 100, category: 'Vegetables', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/10000203_16-fresho-tomato-local.jpg', unit: '1 kg' },
    { name: 'Onion (Medium)', price: 45, discount: 0, stock: 100, category: 'Vegetables', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/10000148_30-fresho-onion.jpg', unit: '1 kg' },
    { name: 'Potato (New Crop)', price: 30, discount: 0, stock: 100, category: 'Vegetables', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/40048457_9-fresho-potato-new-crop.jpg', unit: '1 kg' },
    { name: 'Banana (Robusta)', price: 42, discount: 5, stock: 50, category: 'Vegetables', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/10000031_21-fresho-banana-robusta.jpg', unit: '1 kg' },
    { name: 'Green Chilli', price: 10, discount: 0, stock: 30, category: 'Vegetables', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/10000069_14-fresho-green-chilli-medium.jpg', unit: '100 g' },

    // Personal Care
    { name: 'Dettol Original Soap', price: 62, discount: 4, stock: 40, category: 'Personal Care', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/40001099_8-dettol-original-soap.jpg', unit: '125 g (Pack of 4)' },
    { name: 'Colgate Strong Teeth Toothpaste', price: 110, discount: 10, stock: 30, category: 'Personal Care', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/40228308_4-colgate-strong-teeth-anticavity-toothpaste-with-arginine-calcium-boost-technology.jpg', unit: '200 g' },
    { name: 'Sunsilk Black Shine Shampoo', price: 290, discount: 40, stock: 20, category: 'Personal Care', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/279140_9-sunsilk-shampoo-stunning-black-shine.jpg', unit: '650 ml' },
    { name: 'Dove Cream Beauty Bar', price: 65, discount: 0, stock: 30, category: 'Personal Care', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/40158434_4-dove-cream-beauty-bathing-bar-with-moisturising-cream.jpg', unit: '100 g (Pack of 3)' },
    { name: 'Himalaya Purifying Neem Face Wash', price: 170, discount: 15, stock: 25, category: 'Personal Care', imageUrl: 'https://www.bigbasket.com/media/uploads/p/l/40003058_6-himalaya-purifying-neem-face-wash.jpg', unit: '150 ml' },
];

const seedDB = async () => {
    try {
        console.log('Loading environment variables...');
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('Error: MONGODB_URI is undefined in .env');
            console.error('Current Directory:', __dirname);
            process.exit(1);
        }

        console.log('Connecting to DB at:', uri.split('@')[1]); // Log only host for safety
        await mongoose.connect(uri);
        console.log('Connected to DB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Products Cleared');

        // Insert new products
        await Product.insertMany(products);
        console.log('Products Imported!');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
