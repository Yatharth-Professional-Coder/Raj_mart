import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function ProductCard({ product, cart = [], addToCart, updateQuantity }) {
    const cartItem = cart.find(item => item._id === product._id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const discountPrice = product.price - (product.discount || 0);
    const hasDiscount = product.discount > 0;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // Use images array if available, otherwise fallback to imageUrl, then placeholder
    const images = product.images && product.images.length > 0 ? product.images : [product.imageUrl || "https://placehold.co/200"];

    useEffect(() => {
        if (images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [images.length]);

    return (
        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-col gap-2 hover:shadow-md transition-shadow">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-50 mb-2">
                <img
                    src={images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-opacity duration-500"
                />
                {hasDiscount && (
                    <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg">
                        {Math.round((product.discount / product.price) * 100)}% OFF
                    </div>
                )}
            </div>

            <div className="flex-1">
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{product.unit}</div>
                <h3 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2 md:line-clamp-none h-10 md:h-auto">
                    {product.name}
                </h3>
            </div>

            <div className="mt-auto pt-3">
                <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="font-bold text-slate-900">₹{discountPrice}</span>
                    {hasDiscount && <span className="text-xs text-slate-400 line-through">₹{product.price}</span>}
                </div>

                {quantity === 0 ? (
                    <button
                        onClick={() => addToCart(product)}
                        className="w-full py-2 px-3 bg-rose-50 text-rose-600 text-sm font-bold rounded-xl border border-rose-100/50 hover:bg-rose-600 hover:text-white transition-all duration-300 active:scale-95"
                    >
                        ADD
                    </button>
                ) : (
                    <div className="flex items-center justify-between bg-rose-600 text-white rounded-xl px-1 py-1 shadow-md shadow-rose-200">
                        <button onClick={() => updateQuantity(product._id, -1)} className="p-1.5 hover:bg-rose-700 rounded-lg transition-colors">
                            <Minus size={16} />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                        <button onClick={() => updateQuantity(product._id, 1)} className="p-1.5 hover:bg-rose-700 rounded-lg transition-colors">
                            <Plus size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
