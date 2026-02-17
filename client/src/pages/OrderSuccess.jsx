import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccess() {
    const { state } = useLocation();
    const order = state?.order;

    if (!order) return <div className="p-10 text-center">No order found. <Link to="/">Go Home</Link></div>;

    return (
        <div className="max-w-md mx-auto text-center py-10">
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle size={40} />
                </div>
            </div>

            <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-slate-500 mb-8">Thank you for shopping with Raj Mart.</p>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-left mb-6">
                <div className="flex justify-between mb-4 pb-4 border-b border-slate-100">
                    <div>
                        <div className="text-xs text-slate-400 uppercase">Order ID</div>
                        <div className="font-mono text-sm font-bold">{order._id.slice(-6).toUpperCase()}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-slate-400 uppercase">Amount</div>
                        <div className="font-bold text-sm">₹{order.totalAmount}</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-bold text-slate-700">Delivery To:</div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {order.customerName}<br />
                        {order.address}<br />
                        Phone: {order.phone}
                    </p>
                </div>
            </div>

            <Link to="/" className="inline-block w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">
                Continue Shopping
            </Link>
        </div>
    );
}
