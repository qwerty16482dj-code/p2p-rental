import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import { useCurrency } from '../../../context/CurrencyContext'; 
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';

const BookingWidget = ({ itemId, pricePerDay }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { convert, currency } = useCurrency(); // Получаем текущую валюту
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [calculation, setCalculation] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Приводим цену к числу (защита от ошибок)
  const safePrice = Number(pricePerDay) || 0;

  // 2. Логика расчета (всегда считаем в базовой валюте - Рублях)
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = end.getTime() - start.getTime();
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (days > 0) {
        const basePrice = days * safePrice;
        const discount = days >= 3 ? basePrice * 0.10 : 0; 
        const priceAfterDiscount = basePrice - discount;
        const serviceFee = priceAfterDiscount * 0.05; 
        const total = priceAfterDiscount + serviceFee;

        setCalculation({ days, basePrice, discount, serviceFee, total });
      } else {
        setCalculation(null);
      }
    } else {
      setCalculation(null);
    }
  }, [startDate, endDate, safePrice]);

  const handleBooking = async () => {
    if (!user) {
      alert(t('login') + ' first!');
      navigate('/auth');
      return;
    }
    if (!calculation) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
          item_id: itemId,
          renter_id: user.id,
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
          total_price: Math.round(calculation.total), // Сохраняем в базе в рублях
          status: 'requested'
      }])
      .select();

    if (error) {
      alert('Error: ' + error.message);
      setLoading(false);
    } else {
      const newBookingId = data[0].id;
      await supabase.from('messages').insert([{
         booking_id: newBookingId,
         sender_id: user.id,
         content: `Booking request from ${startDate} to ${endDate}`,
         is_system: false
      }]);
      navigate(`/chat/${newBookingId}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 sticky top-24">
      
      {/* ЦЕНА (КОНВЕРТИРУЕТСЯ) */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <span className="text-3xl font-black text-gray-900">
            {/* Здесь используем функцию convert() */}
            {convert(safePrice).full}
          </span>
          <span className="text-gray-500 mb-1 ml-1 font-medium text-sm">
            {t('price_day')}
          </span>
        </div>
      </div>

      {/* ВЫБОР ДАТ */}
      <div className="grid grid-cols-2 gap-2 mb-6 border border-gray-200 rounded-xl overflow-hidden p-1">
        <div className="p-2 hover:bg-gray-50 transition rounded-lg">
          <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1 tracking-wider">Start</label>
          <input 
            type="date" 
            className="w-full bg-transparent outline-none font-medium text-sm text-gray-700"
            value={startDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="p-2 border-l border-gray-100 hover:bg-gray-50 transition rounded-lg">
          <label className="text-[10px] font-bold uppercase text-gray-500 block mb-1 tracking-wider">End</label>
          <input 
            type="date" 
            className="w-full bg-transparent outline-none font-medium text-sm text-gray-700"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* РАСЧЕТЫ (ТОЖЕ КОНВЕРТИРУЮТСЯ) */}
      {calculation && (
        <div className="space-y-3 text-sm mb-6 animate-fade-in border-t border-gray-100 pt-4">
          <div className="flex justify-between text-gray-600">
            <span className="underline decoration-dotted cursor-help">
              {convert(safePrice).full} x {calculation.days} {t('days', {defaultValue: 'd.'})}
            </span>
            <span>{convert(calculation.basePrice).full}</span>
          </div>
          
          {calculation.discount > 0 && (
            <div className="flex justify-between text-green-600 font-bold">
              <span>{t('discount')}</span>
              <span>- {convert(calculation.discount).full}</span>
            </div>
          )}

          <div className="flex justify-between text-gray-500">
            <span>{t('service_fee')}</span>
            <span>{convert(calculation.serviceFee).full}</span>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between font-black text-lg text-gray-900">
            <span>{t('total')}</span>
            <span>{convert(calculation.total).full}</span>
          </div>
        </div>
      )}

      {/* КНОПКА (ЧЕРНАЯ) */}
      <button 
        onClick={handleBooking}
        disabled={!calculation || loading}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg
          ${!calculation || loading 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
            : 'bg-black text-white hover:bg-gray-800 shadow-black/20'
          }`}
      >
        {loading ? t('loading') : t('book')}
      </button>
    </div>
  );
};

export default BookingWidget;