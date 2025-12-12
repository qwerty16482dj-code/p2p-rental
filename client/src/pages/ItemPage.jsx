import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import { useCurrency } from '../context/CurrencyContext';
import { supabase } from '../lib/supabase';
import BookingWidget from '../components/features/Product/BookingWidget';

const ItemPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { convert } = useCurrency();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const { data } = await supabase.from('items').select(`*, profiles(full_name, rating, avatar_url)`).eq('id', id).single();
      if (data) setItem(data);
    };
    fetchItem();
  }, [id]);

  if (!item) return <div className="p-20 text-center text-slate-400 font-bold uppercase">{t('loading')}</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen">
      <nav className="mb-8">
        <Link to="/" className="text-xs font-bold uppercase tracking-wide text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          {t('back_to_search')}
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* ФОТО */}
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
             {item.photos?.[0] ? (
                <img src={item.photos[0]} alt={item.title} className="w-full h-full object-cover" />
             ) : (
                <div className="flex items-center justify-center w-full h-full text-slate-300 uppercase font-bold tracking-widest">No Image</div>
             )}
          </div>

          <div className="border-b border-gray-100 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2">{item.title}</h1>
            <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                <span className="bg-gray-100 px-3 py-1 rounded text-slate-700 uppercase text-xs font-bold tracking-wide">
                    {item.category ? t(`cat_${item.category}`) : 'OTHER'}
                </span>
                <span>•</span>
                <span>ID: {item.id.slice(0,8)}</span>
            </div>
          </div>

          <div className="flex gap-10">
            {/* Владелец */}
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 overflow-hidden border border-gray-200">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">{t('owner')}</p>
                 <p className="font-bold text-slate-900">{item.profiles?.full_name || 'User'}</p>
               </div>
            </div>
            {/* Рейтинг */}
            <div className="flex items-center gap-4 border-l border-gray-100 pl-10">
                <div>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">{t('rating')}</p>
                 <p className="font-bold text-slate-900 flex items-center gap-1">
                    <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    5.0
                 </p>
               </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-wide">{t('description')}</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-base font-light">
              {item.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА (Виджет) */}
        <div className="lg:col-span-1">
          <BookingWidget itemId={item.id} pricePerDay={item.price_per_day} />
        </div>
      </div>
    </div>
  );
};
export default ItemPage;