import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../../context/CurrencyContext'; 

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', flag: '🇷🇺' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', flag: '🇺🇦' },
  // Евро удалено
];

const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); 

  const currentCurrency = currencies.find(c => c.code === currency) || currencies[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-50 inline-block" ref={dropdownRef}>
      
      {/* КНОПКА ОТКРЫТИЯ */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 select-none
          ${isOpen 
            ? 'bg-black text-white border-black shadow-md' 
            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        <span className="text-xl leading-none">{currentCurrency.flag}</span> 
        <span className="text-sm font-bold">{currentCurrency.code}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" height="12" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {/* ВЫПАДАЮЩИЙ СПИСОК */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden z-[10000] animate-fade-in-down"
        >
           <div className="py-1">
            {currencies.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setCurrency(c.code);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0
                  ${currency === c.code ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}
                `}
              >
                <span className="text-xl leading-none">{c.flag}</span>
                <div className="flex flex-col">
                  <span className={`text-sm leading-tight ${currency === c.code ? 'font-bold text-black' : 'font-medium text-gray-900'}`}>
                    {c.code}
                  </span>
                  <span className="text-[10px] text-gray-500 leading-tight">{c.name}</span>
                </div>
                
                {currency === c.code && (
                  <span className="ml-auto text-green-500 font-bold text-lg">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;