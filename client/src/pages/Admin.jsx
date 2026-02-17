import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Truck, Check, X, Edit, Trash2, List, Plus, Minus } from 'lucide-react';

export default function Admin() {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        name: '', price: '', discount: '', stock: '', images: [], unit: 'pc', category: ''
    });
    const [tempImageUrl, setTempImageUrl] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);

    // Category State
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/products`);
        setProducts(res.data);
    };

    const fetchOrders = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders`);
        setOrders(res.data);
    };

    const fetchCategories = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/categories`);
        setCategories(res.data);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddImage = () => {
        if (tempImageUrl) {
            setFormData({ ...formData, images: [...formData.images, tempImageUrl] });
            setTempImageUrl('');
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            discount: product.discount,
            stock: product.stock,
            images: product.images && product.images.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : []),
            unit: product.unit,
            category: product.category
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setFormData({ name: '', price: '', discount: '', stock: '', images: [], unit: 'pc', category: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Use the first image as imageUrl for backward compatibility if needed, but backend handles it
            const productData = {
                ...formData,
                imageUrl: formData.images[0] || '' // Fallback
            };

            if (editingProduct) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/products/${editingProduct._id}`, productData);
                alert('Product Updated!');
                setEditingProduct(null);
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products`, productData);
                alert('Product Added!');
            }

            fetchProducts();
            setFormData({ name: '', price: '', discount: '', stock: '', images: [], unit: 'pc', category: '' });
        } catch (err) {
            alert(editingProduct ? 'Error updating product' : 'Error adding product');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Are you sure?')) return;
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/products/${id}`);
        fetchProducts();
    };

    const updateOrderStatus = async (id, status) => {
        await axios.patch(`${import.meta.env.VITE_API_URL}/api/admin/orders/${id}/status`, { status });
        fetchOrders();
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/categories`, { name: newCategory });
            fetchCategories();
            setNewCategory('');
            alert('Category Added!');
        } catch (err) {
            alert('Error adding category');
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!confirm('Are you sure?')) return;
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/categories/${id}`);
        fetchCategories();
    };

    return (
        <div className="font-sans">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <div className="flex gap-4 mb-6 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`pb-2 px-4 font-medium ${activeTab === 'products' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500'}`}
                >
                    Product Management
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`pb-2 px-4 font-medium ${activeTab === 'categories' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500'}`}
                >
                    Categories
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`pb-2 px-4 font-medium ${activeTab === 'orders' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-slate-500'}`}
                >
                    Order Management
                </button>
            </div>

            {activeTab === 'products' && (
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <div className="card sticky top-24">
                            <h2 className="text-lg font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange} className="input-field" required />
                                <div className="grid grid-cols-2 gap-2">
                                    <input name="price" type="number" placeholder="Price (₹)" value={formData.price} onChange={handleInputChange} className="input-field" required />
                                    <input name="discount" type="number" placeholder="Discount (₹)" value={formData.discount} onChange={handleInputChange} className="input-field" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleInputChange} className="input-field" required />
                                    <input name="unit" placeholder="Unit (e.g., 1 kg)" value={formData.unit} onChange={handleInputChange} className="input-field" />
                                </div>
                                <select name="category" value={formData.category} onChange={handleInputChange} className="input-field" required>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>

                                {/* Image Upload Section */}
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            placeholder="Image URL"
                                            value={tempImageUrl}
                                            onChange={(e) => setTempImageUrl(e.target.value)}
                                            className="input-field flex-1"
                                        />
                                        <button type="button" onClick={handleAddImage} className="bg-slate-200 p-2 rounded hover:bg-slate-300">
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="relative group">
                                                <img src={img} alt="preview" className="w-full h-16 object-cover rounded border" />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(idx)}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {editingProduct && (
                                        <button type="button" onClick={handleCancelEdit} className="flex-1 btn-secondary bg-gray-200 hover:bg-gray-300 text-gray-800">
                                            Cancel
                                        </button>
                                    )}
                                    <button type="submit" className="flex-1 btn-primary bg-slate-800 hover:bg-slate-900">
                                        {editingProduct ? 'Update Product' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-3">
                        {products.map(p => (
                            <div key={p._id} className="bg-white p-3 rounded-lg border flex items-center gap-4">
                                <img src={p.images?.[0] || p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded" />
                                <div className="flex-1">
                                    <div className="font-bold">{p.name}</div>
                                    <div className="text-sm text-slate-500">Stock: {p.stock} | ₹{p.price}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditClick(p)} className="text-blue-500 hover:bg-blue-50 p-2 rounded">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDeleteProduct(p._id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'categories' && (
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <div className="card">
                            <h2 className="text-lg font-bold mb-4">Add Category</h2>
                            <form onSubmit={handleAddCategory} className="flex gap-2">
                                <input
                                    placeholder="Category Name"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="input-field flex-1"
                                    required
                                />
                                <button type="submit" className="btn-primary bg-slate-800 hover:bg-slate-900">Add</button>
                            </form>
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        {categories.map(cat => (
                            <div key={cat._id} className="bg-white p-3 rounded-lg border flex justify-between items-center">
                                <span className="font-medium">{cat.name}</span>
                                <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white p-4 rounded-xl border border-slate-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="font-bold text-lg">{order.customerName}</div>
                                    <div className="text-sm text-slate-500">{order.phone}</div>
                                    <div className="text-xs text-slate-400 mt-1">{order._id}</div>
                                </div>
                                <select
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                    className={`p-2 rounded-lg font-bold text-xs uppercase tracking-wide border ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-slate-100 text-slate-700'
                                        }`}
                                >
                                    {['Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1 mb-4 bg-slate-50 p-3 rounded text-sm">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between">
                                        <span>{item.quantity} x {item.productName}</span>
                                        <span className="font-mono">₹{item.priceAtPurchase * item.quantity}</span>
                                    </div>
                                ))}
                                <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between font-bold">
                                    <span>Total (Inc. Delivery ₹{order.deliveryCharge})</span>
                                    <span>₹{order.totalAmount}</span>
                                </div>
                            </div>

                            <div className="text-sm text-slate-600">
                                Create At: {new Date(order.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
