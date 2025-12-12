import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../../context/CurrencyContext';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { currency, setCurrency } = useCurrency();

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const currencyRef = useRef(null);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currencies = [
    { code: 'RUB', symbol: '₽', label: 'RUB' },
    { code: 'USD', symbol: '$', label: 'USD' },
    { code: 'UAH', symbol: '₴', label: 'UAH' },
  ];

  const currentCurrency = currencies.find(c => c.code === currency) || currencies[0];

  return (
    // ИЗМЕНЕНИЕ: z-[1100] чтобы быть выше карты (у карты z-index ~1000)
    <header className="h-16 border-b border-gray-200 bg-white/90 backdrop-blur-xl flex items-center justify-between px-6 fixed top-0 w-full z-[1100] transition-all duration-300">
      
      {/* ЛОГОТИП */}
      <Link to="/" className="text-lg font-bold tracking-tighter text-slate-900 hover:opacity-70 transition-opacity flex items-center gap-1">
        <div className="w-5 h-5 bg-slate-900 rounded-sm"></div>
        <span>P2P RENTAL</span>
      </Link>

      {/* ПРАВАЯ ЧАСТЬ */}
      <div className="flex items-center gap-6">

        {/* Язык */}
        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 hidden sm:flex border border-gray-100">
          {['en', 'ru', 'uk'].map((lng) => (
             <button 
               key={lng}
               onClick={() => changeLanguage(lng)} 
               className={`h-7 px-3 rounded-md text-[10px] font-bold uppercase transition-all ${
                 i18n.language.startsWith(lng) 
                   ? 'bg-white text-slate-900 shadow-sm border border-gray-200' 
                   : 'text-gray-400 hover:text-gray-600'
               }`}
             >
               {lng}
             </button>
          ))}
        </div>

        {/* Валюта */}
        <div className="relative hidden sm:block" ref={currencyRef}>
          <button 
            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-black transition-colors"
          >
            <span>{currentCurrency.code}</span>
            <span className="text-gray-400 font-normal">| {currentCurrency.symbol}</span>
          </button>
          
          {isCurrencyOpen && (
            <div className="absolute top-full mt-4 right-0 bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden min-w-[140px] z-[1200] animate-fade-in p-1">
              {currencies.map((c) => (
                <button 
                  key={c.code} 
                  onClick={() => { setCurrency(c.code); setIsCurrencyOpen(false); }} 
                  className={`w-full text-left px-3 py-2 text-xs font-medium rounded-md flex items-center justify-between transition-colors ${currency === c.code ? 'bg-gray-50 text-black' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <span>{c.label}</span><span className="text-gray-400">{c.symbol}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* МЕНЮ ПОЛЬЗОВАТЕЛЯ */}
        {user ? (
          <div className="flex items-center gap-6 border-l pl-6 border-gray-200 h-8">
            <div className="hidden md:flex items-center gap-6">
              <Link to="/my-items" className="text-xs font-semibold text-slate-500 hover:text-slate-900 uppercase tracking-wide transition-colors">{t('my_items')}</Link>
              <Link to="/bookings" className="text-xs font-semibold text-slate-500 hover:text-slate-900 uppercase tracking-wide transition-colors">{t('bookings')}</Link>
            </div>

            <Link 
              to="/create" 
              className="bg-slate-900 text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition shadow-sm flex items-center gap-2"
            >
              <span className="text-base leading-none mb-[1px]">+</span> 
              <span className="hidden lg:inline">{t('rent_out')}</span>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-600 transition-colors"
              title={t('logout')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        ) : (
          <Link to="/auth" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition shadow-sm uppercase tracking-wide">
            {t('login')}
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;