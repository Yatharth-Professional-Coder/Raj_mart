import { useState } from 'react';
import axios from 'axios';
import { Search, Package, Check, Clock, Truck, X } from 'lucide-react';

export default function TrackOrder() {
    const [searchQuery, setSearchQuery] = useState('');
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();

        // Validation: 10 digit phone OR 24 char hex Order ID
        const isPhone = /^\d{10}$/.test(searchQuery);
        const isOrderId = /^[0-9a-fA-F]{24}$/.test(searchQuery);

        if (!isPhone && !isOrderId) {
            setError('Please enter a valid 10-digit mobile number or Order ID');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/orders/track/${searchQuery}`);
            setOrders(res.data);
            if (res.data.length === 0) setError('No orders found for this details.');
        } catch (err) {
            setError('Failed to fetch orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-600 bg-green-50 border-green-200';
            case 'Cancelled': return 'text-red-600 bg-red-50 border-red-200';
            case 'Out for Delivery': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Confirmed': return 'text-purple-600 bg-purple-50 border-purple-200';
            default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <Check size={16} />;
            case 'Cancelled': return <X size={16} />;
            case 'Out for Delivery': return <Truck size={16} />;
            case 'Confirmed': return <Package size={16} />;
            default: return <Clock size={16} />;
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-slate-800 mb-3">Track Your Order</h1>
                <p className="text-slate-500">Enter your mobile number or Order ID to track status.</p>
            </div>

            <div className="card max-w-md mx-auto mb-10">
                <form onSubmit={handleTrack} className="flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Mobile Number or Order ID"
                        className="input-field flex-1 text-lg tracking-widest text-center placeholder:text-base placeholder:tracking-normal"
                        required
                    />
                    <button type="submit" disabled={loading} className="btn-primary !py-2 !px-4">
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search size={22} />}
                    </button>
                </form>
                {error && <div className="text-red-500 text-sm mt-3 text-center bg-red-50 p-2 rounded-lg border border-red-100">{error}</div>}
            </div>

            <div className="space-y-4">
                {orders && orders.map(order => (
                    <div key={order._id} className="card hover:border-rose-200 transition-colors">
                        <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
                            <div>
                                <div className="text-xs text-slate-400 font-mono">ORDER ID: {order._id}</div>
                                <div className="text-sm text-slate-500 mt-1">
                                    {new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                            <div className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-slate-700"><span className="font-bold text-slate-900">{item.quantity}x</span> {item.productName}</span>
                                    <span className="text-slate-500">₹{item.priceAtPurchase * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                            <div className="text-xs text-slate-500">
                                Delivery to: <span className="font-bold text-slate-700">{order.customerName}</span>
                            </div>
                            <div className="text-lg font-bold text-slate-900">
                                ₹{order.totalAmount}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
