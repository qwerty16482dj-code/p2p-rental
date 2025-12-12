import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import { useCurrency } from '../context/CurrencyContext'; 
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const BookingsPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { convert } = useCurrency();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('renter'); 

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      setLoading(true);
      let query;
      if (activeTab === 'renter') {
        query = supabase.from('bookings').select('*, items(title, photos, price_per_day, owner_id)').eq('renter_id', user.id).order('created_at', { ascending: false });
      } else {
        query = supabase.from('bookings').select('*, items!inner(title, photos, price_per_day, owner_id), profiles:renter_id(full_name)').eq('items.owner_id', user.id).order('created_at', { ascending: false });
      }
      const { data, error } = await query;
      if (error) console.error(error); else setBookings(data || []);
      setLoading(false);
    };
    fetchBookings();
  }, [user, activeTab]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const { error } = await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId);
      if (error) throw error;
      await supabase.from('messages').insert([{ booking_id: bookingId, sender_id: user.id, content: `Status: ${newStatus}`, is_system: true }]);
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err) { alert(err.message); }
  };

  const getStatusBadge = (status) => {
    // Строгие стили для бейджей
    const styles = {
      requested: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      confirmed: 'bg-green-50 text-green-700 border-green-200',
      completed: 'bg-gray-50 text-gray-600 border-gray-200',
      rejected: 'bg-red-50 text-red-700 border-red-200'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[status] || 'bg-gray-50 border-gray-200'}`}>
        {t(`status_${status}`)}
      </span>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-8">{t('bookings')}</h1>

      <div className="flex border-b border-gray-200 mb-8">
        {['renter', 'owner'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} 
            className={`pb-3 px-6 text-sm font-bold uppercase tracking-wide transition relative ${activeTab === tab ? 'text-slate-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {tab === 'renter' ? t('i_am_renting') : t('incoming_requests')}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-900"></div>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-400 text-sm font-bold uppercase">{t('loading')}</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <p className="text-slate-500 mb-4 font-medium">{t('empty_bookings_message')}</p>
          {activeTab === 'renter' && <Link to="/" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition">{t('find_items')}</Link>}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-32 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0 relative border border-gray-100">
                {booking.items?.photos?.[0] ? <img src={booking.items.photos[0]} className="w-full h-full object-cover"/> : <div className="p-4 text-xs text-center pt-10 text-gray-400">NO PHOTO</div>}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 leading-tight">{booking.items?.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                            ID: {booking.id.slice(0,8)}
                        </p>
                    </div>
                    <div className="text-right">
                       <span className="font-black text-lg text-slate-900 block">{convert(booking.total_price).full}</span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 bg-gray-50 px-3 py-2 rounded inline-block">
                     <span className="font-bold">{new Date(booking.start_date).toLocaleDateString()}</span>
                     <span className="mx-2 text-gray-300">→</span>
                     <span className="font-bold">{new Date(booking.end_date).toLocaleDateString()}</span>
                  </div>
                  {activeTab === 'owner' && booking.profiles && (
                    <div className="mt-2 text-sm text-slate-500">
                      {t('renter')}: <span className="font-bold text-slate-900">{booking.profiles.full_name}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between mt-5 pt-4 border-t border-gray-100 gap-3">
                  {getStatusBadge(booking.status)}
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    {activeTab === 'owner' && booking.status === 'requested' && (
                      <>
                        <button onClick={() => handleUpdateStatus(booking.id, 'confirmed')} className="bg-slate-900 text-white px-4 py-2 rounded-md text-xs font-bold hover:bg-slate-800 transition">{t('confirm')}</button>
                        <button onClick={() => handleUpdateStatus(booking.id, 'rejected')} className="bg-white border border-gray-300 text-slate-700 px-4 py-2 rounded-md text-xs font-bold hover:bg-gray-50 transition">{t('reject')}</button>
                      </>
                    )}
                    <Link to={`/chat/${booking.id}`} className="bg-gray-100 text-slate-700 px-5 py-2 rounded-md text-xs font-bold hover:bg-gray-200 transition text-center uppercase tracking-wide">
                      {t('chat')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default BookingsPage;