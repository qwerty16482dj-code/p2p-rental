import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import { useCurrency } from '../context/CurrencyContext'; 
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const MyItemsPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { convert } = useCurrency();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMyItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setItems(data || []);
      setLoading(false);
    };
    fetchMyItems();
  }, [user]);

  const handleDelete = async (itemId) => {
    if (!window.confirm(t('delete_confirm') || 'Delete this item?')) return;
    const { error } = await supabase.from('items').delete().eq('id', itemId);
    if (error) alert('Error: ' + error.message);
    else setItems(items.filter(item => item.id !== itemId));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 min-h-screen">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('my_items')}</h1>
        <Link to="/create" className="bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition shadow-sm">
           + {t('rent_out')}
        </Link>
      </div>

      {loading ? (
        <p className="text-slate-400 font-medium">{t('loading')}</p>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <p className="text-slate-500 mb-4 font-medium">{t('empty_items_message')}</p>
          <Link to="/create" className="text-blue-600 font-bold hover:underline text-sm">
            {t('create_first_item')}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 p-4 rounded-lg flex gap-5 hover:border-gray-300 transition-colors group items-start">
              
              {/* Фото (Строгий квадрат) */}
              <div className="w-28 h-20 bg-gray-100 rounded md:w-40 md:h-28 overflow-hidden flex-shrink-0 relative border border-gray-100">
                {item.photos?.[0] ? (
                  <img src={item.photos[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
              </div>

              {/* Инфо */}
              <div className="flex-1 min-w-0 py-1 flex flex-col justify-between h-20 md:h-28">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-900 truncate pr-4">{item.title}</h3>
                    <div className="font-bold text-slate-900 whitespace-nowrap">
                       {convert(item.price_per_day).full} 
                       <span className="text-xs font-normal text-slate-400 ml-1">/ {t('price_day').replace('/ ', '')}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.description}</p>
                  
                  <div className="mt-2 flex items-center gap-2">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                        {item.category ? t(`cat_${item.category}`) : 'OTHER'}
                     </span>
                  </div>
                </div>

                <div className="flex gap-4 mt-auto pt-2">
                  <Link to={`/item/${item.id}`} className="text-xs font-bold text-slate-600 hover:text-blue-600 uppercase tracking-wide transition-colors">
                    {t('view')}
                  </Link>
                  <button onClick={() => handleDelete(item.id)} className="text-xs font-bold text-slate-400 hover:text-red-600 uppercase tracking-wide transition-colors">
                    {t('delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default MyItemsPage;