import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import { useCurrency } from '../context/CurrencyContext'; 
import MapView from '../components/features/Map/MapView';
import { useGeoSearch } from '../hooks/useGeoSearch';

// --- НАБОР SVG ИКОНОК ---
const Icons = {
  All: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  Photo: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>,
  Consoles: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>,
  Bikes: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>, // Заглушка, можно найти точнее
  Scooters: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  Laptops: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>,
  Camping: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" /></svg>,
  Tools: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>,
  Other: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>,
};

const SearchPage = () => {
  const { t } = useTranslation();
  const { convert } = useCurrency();
  const navigate = useNavigate();
  
  const [activeCategory, setActiveCategory] = useState('cat_all'); 
  const [bounds, setBounds] = useState(null);
  const { items, loading } = useGeoSearch(bounds);

  // Категории теперь содержат компонент иконки (svg)
  const categories = [
    { icon: Icons.All, dbName: 'All', key: 'cat_all' },
    { icon: Icons.Photo, dbName: 'photo', key: 'cat_photo' },
    { icon: Icons.Consoles, dbName: 'consoles', key: 'cat_consoles' },
    { icon: Icons.Bikes, dbName: 'bikes', key: 'cat_bikes' },
    { icon: Icons.Scooters, dbName: 'scooters', key: 'cat_scooters' },
    { icon: Icons.Laptops, dbName: 'laptops', key: 'cat_laptops' },
    { icon: Icons.Camping, dbName: 'camping', key: 'cat_camping' },
    { icon: Icons.Tools, dbName: 'tools', key: 'cat_tools' },
    { icon: Icons.Other, dbName: 'other', key: 'cat_other' },
  ];
  
  const filteredItems = useMemo(() => {
    const activeDbName = categories.find(c => c.key === activeCategory)?.dbName;
    if (activeDbName === 'All') return items;
    return items.filter(item => item.category === activeDbName);
  }, [items, activeCategory]);

  return (
    <div className="flex h-screen flex-col md:flex-row bg-white overflow-hidden">
      
      {/* ЛЕВАЯ КОЛОНКА */}
      <div className="w-full md:w-[45%] lg:w-[40%] h-1/2 md:h-full flex flex-col border-r border-gray-200 shadow-2xl z-20 relative bg-white">
        
        {/* ХЕДЕР СПИСКА */}
        <div className="pt-8 px-8 pb-4 bg-white z-30 flex-shrink-0">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">
            {t('rent_items')}
          </h1>
          
          {/* СТРОГИЕ КАТЕГОРИИ (SVG) */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-8 px-8">
            {categories.map((cat, i) => (
              <button 
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-200 whitespace-nowrap
                  ${activeCategory === cat.key 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                    : 'bg-white text-slate-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {/* Иконка */}
                <span className={activeCategory === cat.key ? 'text-white' : 'text-slate-400'}>
                  {cat.icon}
                </span>
                
                <span className="text-sm font-semibold">
                  {t(cat.key)}
                </span>
              </button>
            ))}
          </div>

          <div className="h-px w-full bg-gray-100 mt-4 mb-4"></div>
          
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            {loading ? t('loading') : `${t('found')}: ${filteredItems.length}`}
          </p>
        </div>
        
        {/* СПИСОК */}
        <div className="flex-1 overflow-y-auto px-8 pb-20 hover:scrollbar-thin scrollbar-thumb-gray-200">
          
          {!loading && filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-300 text-center animate-fade-in">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-3xl opacity-50">
                 {Icons.All}
               </div>
              <p className="text-lg font-medium text-slate-900">{t('empty')}</p>
              <p className="text-sm">{t('move_map')}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => navigate(`/item/${item.id}`)}
                className="group cursor-pointer flex flex-col gap-3 animate-fade-in"
              >
                {/* ФОТО (Строгий прямоугольник) */}
                <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden relative isolate border border-gray-100">
                  {item.photos?.[0] ? (
                    <img 
                      src={item.photos[0]} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-300 text-sm">No Photo</div>
                  )}
                  
                  {/* Цена (Минимализм) */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur shadow-sm px-3 py-1.5 rounded-md text-sm font-bold text-slate-900">
                    {convert(item.price_per_day).full}
                  </div>
                </div>

                {/* ИНФО */}
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight text-base mb-1">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                     <span className="bg-gray-100 px-2 py-0.5 rounded text-slate-600">
                        {item.category && t(`cat_${item.category}`) || t('cat_other')}
                     </span>
                     <span>•</span>
                     <span>⭐ 5.0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА: КАРТА */}
      <div className="w-full md:w-[55%] lg:w-[60%] h-1/2 md:h-full relative bg-gray-50">
        <MapView items={filteredItems} onBoundsChange={setBounds} />
      </div>
    </div>
  );
};

export default SearchPage;