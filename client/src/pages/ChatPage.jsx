import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Переводы
import { useCurrency } from '../context/CurrencyContext'; // Валюта
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const ChatPage = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { convert } = useCurrency(); // Конвертер
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [booking, setBooking] = useState(null);
  const messagesEndRef = useRef(null);

  // 1. Загрузка данных о брони (чтобы показать товар сверху)
  useEffect(() => {
    const fetchBooking = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*, items(title, price_per_day, photos, owner_id)')
        .eq('id', bookingId)
        .single();
      setBooking(data);
    };

    // 2. Загрузка сообщений
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });
      setMessages(data || []);
    };

    fetchBooking();
    fetchMessages();

    // 3. Подписка на новые сообщения (Realtime)
    const channel = supabase
      .channel('chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `booking_id=eq.${bookingId}` }, 
      (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId]);

  // Авто-скролл вниз
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await supabase.from('messages').insert([{
      booking_id: bookingId,
      sender_id: user.id,
      content: newMessage
    }]);

    setNewMessage('');
  };

  if (!booking) return <div className="p-10 text-center">{t('loading')}</div>;

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-64px)] flex flex-col bg-white">
      
      {/* ШАПКА ЧАТА (Товар и цена) */}
      <div className="p-4 border-b flex items-center justify-between bg-white z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/bookings" className="text-gray-400 hover:text-black transition flex items-center gap-1 text-sm font-bold">
            ← {t('back') || 'Back'}
          </Link>
          
          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            {booking.items?.photos?.[0] && (
              <img src={booking.items.photos[0]} className="w-full h-full object-cover" />
            )}
          </div>
          
          <div>
            <h2 className="font-bold text-gray-900 leading-tight">{booking.items?.title}</h2>
            <p className="text-xs text-gray-500">
              {t('booking_id') || 'Order'} #{bookingId.slice(0, 8)}
            </p>
          </div>
        </div>

        <div className="text-right">
          {/* ЦЕНА: КОНВЕРТИРУЕМ */}
          <div className="font-black text-lg text-green-600">
            {convert(booking.total_price).full}
          </div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            {/* Статус тоже переводим */}
            {t(`status_${booking.status}`) || booking.status}
          </div>
        </div>
      </div>

      {/* СПИСОК СООБЩЕНИЙ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          const isSystem = msg.is_system;

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}
              >
                <p>{msg.content}</p>
                <span className={`text-[10px] block text-right mt-1 opacity-70 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ПОЛЕ ВВОДА */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t('type_message') || 'Type a message...'}
          className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none transition"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim()}
          className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default ChatPage;