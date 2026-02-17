import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Home({ addToCart, cart, updateQuantity }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="text-center py-20 text-slate-400">Loading essentials...</div>;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-slate-800">Shop for Daily Essentials</h1>
                <p className="text-sm text-slate-500">Best quality products at affordable prices.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {products.map(product => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        cart={cart}
                        addToCart={addToCart}
                        updateQuantity={updateQuantity}
                    />
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
                    <div className="text-4xl mb-3">🛍️</div>
                    <h3 className="text-lg font-bold text-slate-700">No products found</h3>
                    <p className="text-slate-400 text-sm">Check back later for fresh stock.</p>
                </div>
            )}
        </div>
    );
}
