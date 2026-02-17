import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Minus, ArrowLeft } from 'lucide-react';

export default function Cart({ cart, updateQuantity, removeFromCart, setCart }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);

    const subtotal = cart.reduce((acc, item) => {
        const price = item.price - (item.discount || 0);
        return acc + (price * item.quantity);
    }, 0);

    const deliveryCharge = subtotal >= 200 ? 0 : 40;
    const total = subtotal + deliveryCharge;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setLoading(true);
        try {
            const orderData = {
                customerName: formData.name,
                phone: formData.phone,
                address: formData.address,
                items: cart.map(item => ({
                    productId: item._id,
                    quantity: item.quantity
                }))
            };

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/orders`, orderData);
            setCart([]); // Clear cart
            navigate('/order-success', { state: { order: res.data } });
        } catch (err) {
            alert('Order failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
                <button onClick={() => navigate('/')} className="btn-primary mt-4">Browse Products</button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold">Review Cart</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="card">
                        {cart.map(item => {
                            const price = item.price - (item.discount || 0);
                            return (
                                <div key={item._id} className="flex gap-3 py-3 border-b last:border-0 border-slate-100">
                                    <img src={item.imageUrl} className="w-16 h-16 object-cover rounded bg-slate-50" />
                                    <div className="flex-1">
                                        <div className="text-xs text-slate-500">{item.unit}</div>
                                        <div className="font-semibold text-sm">{item.name}</div>
                                        <div className="font-bold mt-1">₹{price * item.quantity}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-rose-50 text-rose-600 rounded-lg">
                                            <button onClick={() => updateQuantity(item._id, -1)} className="p-1 px-2 hover:bg-rose-100 rounded-l">-</button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, 1)} className="p-1 px-2 hover:bg-rose-100 rounded-r">+</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="card space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Item Total</span>
                            <span className="font-medium">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Delivery Charge</span>
                            <span className={deliveryCharge === 0 ? "text-green-600 font-bold" : "font-medium"}>
                                {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                            </span>
                        </div>
                        {deliveryCharge > 0 && (
                            <div className="bg-blue-50 text-blue-700 text-xs p-2 rounded">
                                Add items worth ₹{200 - subtotal} more for free delivery!
                            </div>
                        )}
                        <div className="border-t pt-2 mt-2 flex justify-between text-base font-bold">
                            <span>Grand Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="card">
                        <h2 className="font-bold mb-4">Delivery Details</h2>
                        <form onSubmit={handlePlaceOrder} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="Enter your full name" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                                <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="input-field" placeholder="10-digit mobile number" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Delivery Address</label>
                                <textarea required rows="3" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="input-field resize-none" placeholder="Complete address (House No, Street, Landmark)" />
                            </div>

                            <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                Payment Method: <span className="font-bold text-slate-800">Cash on Delivery (COD)</span>
                            </div>

                            <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 text-lg shadow-xl shadow-rose-200/50 mt-2">
                                {loading ? 'Placing Order...' : (
                                    <span className="flex items-center justify-center gap-2">
                                        Place Order <span className="text-white/80">•</span> ₹{total}
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
