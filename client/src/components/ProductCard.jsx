import { Plus, Minus } from 'lucide-react';

export default function ProductCard({ product, cart = [], addToCart, updateQuantity }) {
    const cartItem = cart.find(item => item._id === product._id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const discountPrice = product.price - (product.discount || 0);
    const hasDiscount = product.discount > 0;

    return (
        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-col gap-2 hover:shadow-md transition-shadow">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-50 mb-2">
                <img
                    src={product.imageUrl || "https://placehold.co/200"}
                    alt={product.name}
                    className="w-full h-full object-cover"
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

            <div className="mt-auto">
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-bold text-sm">₹{discountPrice}</span>
                    {hasDiscount && <span className="text-xs text-slate-400 line-through">₹{product.price}</span>}
                </div>

                {quantity === 0 ? (
                    <button
                        onClick={() => addToCart(product)}
                        className="w-full py-1.5 px-3 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg border border-rose-100 uppercase tracking-wide hover:bg-rose-100 transition-colors"
                    >
                        Add
                    </button>
                ) : (
                    <div className="flex items-center justify-between bg-rose-600 text-white rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(product._id, -1)} className="p-0.5 hover:bg-rose-700 rounded">
                            <Minus size={14} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                        <button onClick={() => updateQuantity(product._id, 1)} className="p-0.5 hover:bg-rose-700 rounded">
                            <Plus size={14} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
