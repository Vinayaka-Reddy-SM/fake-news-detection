import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDark]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <span className="font-bold text-xl tracking-tight">Fake News Detector</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {token ? (
              <>
                <Link to="/analyze" className="hover:text-primary transition-colors font-medium">Analyze</Link>
                <Link to="/dashboard" className="hover:text-primary transition-colors font-medium">Dashboard</Link>
                <Link to="/history" className="hover:text-primary transition-colors font-medium">History</Link>
              </>
            ) : null}
            
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {token ? (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200 dark:border-gray-700">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                  <User size={16} />
                </div>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary py-1.5 text-sm">Login</Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            {token ? (
              <>
                <Link to="/analyze" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>Analyze</Link>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link to="/history" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setIsMenuOpen(false)}>History</Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-left w-full block px-3 py-2 rounded-md text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 rounded-md text-primary font-medium" onClick={() => setIsMenuOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
