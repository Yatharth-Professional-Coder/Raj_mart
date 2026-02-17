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
                                <Link to="/admin" className="text-sm font-medium text-slate-500 hover:text-rose-600">
                                    Admin
                                </Link>
                            )}
                            <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                                <UserIcon size={16} />
                                <span>{user.username}</span>
                            </div>
                            <button onClick={logout} className="text-slate-400 hover:text-rose-600" title="Logout">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-rose-600">
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
