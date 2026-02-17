import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar({ cart }) {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const { user, logout } = useAuth();

    return (
        <nav className="sticky top-0 z-50 glass bg-white/80 border-b border-slate-200">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
                    Raj Mart
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            {user.role === 'admin' && (
                                <Link to="/admin" className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-rose-100 hover:text-rose-600 transition-colors">
                                    Admin Panel
                                </Link>
                            )}
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <div className="w-8 h-8 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center text-rose-600">
                                    <UserIcon size={16} />
                                </div>
                                <div className="hidden md:block text-sm">
                                    <div className="text-xs text-slate-400 font-medium">Hello,</div>
                                    <div className="font-bold text-slate-700 leading-none">{user.username}</div>
                                </div>
                            </div>
                            <button onClick={logout} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all" title="Logout">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="px-5 py-2 text-sm font-bold text-slate-700 hover:text-rose-600 border border-slate-200 rounded-full hover:border-rose-200 hover:bg-rose-50 transition-all">
                            Login
                        </Link>
                    )}

                    <Link to="/cart" className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag text-slate-700">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse border-2 border-white">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
