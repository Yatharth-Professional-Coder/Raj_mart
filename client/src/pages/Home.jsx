import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Home({ addToCart, cart, updateQuantity }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/products`);
                setProducts(res.data);
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Extract categories
    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p => p.category === selectedCategory);

    if (loading) return <div className="text-center py-20 text-slate-400">Loading essentials...</div>;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-800">Shop for Daily Essentials</h1>
                <p className="text-sm text-slate-500">Best quality products at affordable prices.</p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-200'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300 hover:text-rose-600'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {filteredProducts.map(product => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        cart={cart}
                        addToCart={addToCart}
                        updateQuantity={updateQuantity}
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                    <div className="text-4xl mb-3">🛍️</div>
                    <h3 className="text-lg font-bold text-slate-700">No products found</h3>
                    <p className="text-slate-400 text-sm">Check back later for fresh stock.</p>
                </div>
            )}
        </div>
    );
}
