import React, { createContext, useState, useContext, useEffect } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const rates = {
    RUB: 1,
    USD: 0.011,
    UAH: 0.41,
  };

  const symbols = {
    RUB: '₽',
    USD: '$',
    UAH: '₴',
  };

  const detectCurrency = () => {
    const lang = navigator.language || navigator.userLanguage; 
    if (lang.includes('ru')) return 'RUB';
    if (lang.includes('uk') || lang.includes('ua')) return 'UAH';
    return 'USD';
  };

  const [currency, setCurrency] = useState(localStorage.getItem('currency') || detectCurrency());

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const convert = (amountInRub) => {
    const rate = rates[currency] || 1;
    const converted = Math.round(amountInRub * rate);
    return {
      value: converted,
      symbol: symbols[currency] || '₽',
      full: `${converted} ${symbols[currency] || '₽'}`
    };
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);