import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext'; // <--- Добавили импорт валюты

// --- НАБОР SVG ИКОНОК ---
const Icons = {
  Photo: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>,
  Consoles: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>,
  Bikes: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>,
  Scooters: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  Laptops: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg>,
  Camping: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" /></svg>,
  Tools: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>,
  Other: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" /></svg>,
};

const CreateItemPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currency } = useCurrency(); // <--- Подключили валюту
  
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [categoryKey, setCategoryKey] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  
  const [location, setLocation] = useState({ lat: 55.75, lng: 37.61 });
  const [locStatus, setLocStatus] = useState('');

  const categories = [
    { icon: Icons.Photo, dbName: 'photo', key: 'cat_photo' },
    { icon: Icons.Consoles, dbName: 'consoles', key: 'cat_consoles' },
    { icon: Icons.Bikes, dbName: 'bikes', key: 'cat_bikes' },
    { icon: Icons.Scooters, dbName: 'scooters', key: 'cat_scooters' },
    { icon: Icons.Laptops, dbName: 'laptops', key: 'cat_laptops' },
    { icon: Icons.Camping, dbName: 'camping', key: 'cat_camping' },
    { icon: Icons.Tools, dbName: 'tools', key: 'cat_tools' },
    { icon: Icons.Other, dbName: 'other', key: 'cat_other' },
  ];
  
  const handleGetLocation = (e) => {
    e.preventDefault();
    setLocStatus('...');
    if (!navigator.geolocation) {
      setLocStatus('N/A');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocStatus('OK');
      },
      () => setLocStatus('Error')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert(t('login') + ' first!');
    if (!categoryKey) return alert('Choose category');
    if (!imageFile) return alert('Add photo');
    setLoading(true);

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('item-photos').upload(filePath, imageFile);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('item-photos').getPublicUrl(filePath);

      const dbCategory = categories.find(c => c.key === categoryKey)?.dbName || 'other';

      // ВАЖНО: Мы сохраняем число как есть. 
      // Если вы ввели 100 при выбранном UAH, сохранится 100. 
      // При просмотре другие увидят конвертированную цену.
      
      const { error: insertError } = await supabase.from('items').insert([
        {
          owner_id: user.id,
          category: dbCategory,
          title,
          description,
          price_per_day: parseInt(price),
          photos: [publicUrl],
          latitude: location.lat,
          longitude: location.lng,
          location: `POINT(${location.lng} ${location.lat})` 
        }
      ]);

      if (insertError) throw insertError;
      setShowSuccess(true);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) return (
    <div className="min-h-screen flex items-center justify-center p-6 text-center bg-gray-50">
       <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
         <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
         </div>
         <h2 className="text-2xl font-bold mb-2 text-slate-900">{t('success_item')}</h2>
         <p className="text-gray-500 mb-6">{t('success_item_message')}</p>
         <button onClick={() => navigate('/')} className="w-full bg-slate-900 text-white py-3 px-8 rounded-xl font-bold hover:bg-slate-800 transition">{t('find_items')}</button>
       </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 tracking-tight">{t('rent_out')}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {/* КАТЕГОРИИ */}
        <div>
          <label className="block font-bold mb-4 text-xs uppercase tracking-wider text-slate-500">{t('category')}</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategoryKey(cat.key)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 group
                  ${categoryKey === cat.key 
                    ? 'border-slate-900 bg-slate-900 text-white shadow-lg transform scale-[1.02]' 
                    : 'border-gray-200 hover:border-slate-300 hover:bg-gray-50 text-slate-600'
                  }`}
              >
                <span className={`mb-2 ${categoryKey === cat.key ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {cat.icon}
                </span>
                <span className="text-xs font-semibold">{t(cat.key)}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* ПОЛЯ ВВОДА */}
        <div className="space-y-6">
            <div>
              <label className="block font-bold mb-2 text-xs uppercase tracking-wider text-slate-500">{t('item_title')}</label>
              <input 
                type="text" 
                required 
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium" 
                placeholder="GoPro Hero 11..."
                value={title} 
                onChange={e => setTitle(e.target.value)} 
              />
            </div>

            <div>
              <label className="block font-bold mb-2 text-xs uppercase tracking-wider text-slate-500">{t('description')}</label>
              <textarea 
                required 
                rows="4" 
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium resize-none" 
                placeholder="..."
                value={description} 
                onChange={e => setDescription(e.target.value)} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block font-bold mb-2 text-xs uppercase tracking-wider text-slate-500">{t('price_per_day')}</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            required 
                            className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-bold text-lg" 
                            placeholder="0"
                            value={price} 
                            onChange={e => setPrice(e.target.value)} 
                        />
                        {/* ДИНАМИЧЕСКАЯ ВАЛЮТА И ПЕРЕВОД */}
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                            {currency} {t('price_day')}
                        </span>
                    </div>
                 </div>
                 
                 <div>
                    <label className="block font-bold mb-2 text-xs uppercase tracking-wider text-slate-500">{t('photo')}</label>
                    <label className="flex flex-col items-center justify-center w-full h-[58px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                        {imageFile ? (
                            <span className="text-sm font-bold text-slate-900 truncate px-4">{imageFile.name}</span>
                        ) : (
                            <div className="flex items-center gap-2 text-gray-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span className="text-xs font-bold uppercase">Upload</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                    </label>
                 </div>
            </div>

            {/* ГЕОЛОКАЦИЯ */}
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 </div>
                 <div>
                     <span className="text-xs font-bold text-blue-900 uppercase tracking-wide block">Location</span>
                     <span className="text-xs text-blue-600">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
                 </div>
              </div>
              <button type="button" onClick={handleGetLocation} className="bg-white text-blue-700 px-4 py-2 rounded-lg text-xs font-bold shadow-sm border border-blue-100 hover:bg-blue-50 transition">
                {locStatus === 'OK' ? 'Update' : 'Locate'}
              </button>
            </div>
        </div>

        <div className="pt-4">
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition disabled:opacity-50 shadow-lg shadow-slate-900/10">
            {loading ? t('loading') : t('publish')}
            </button>
        </div>
      </form>
    </div>
  );
};
export default CreateItemPage;