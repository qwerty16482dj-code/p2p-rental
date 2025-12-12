import React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../../../context/CurrencyContext'; 
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const PricePin = ({ item }) => {
  const navigate = useNavigate();
  const { convert } = useCurrency();
  const { t } = useTranslation();
  
  // 1. ЗАЩИТА ОТ ОШИБОК (NaN fix)
  // Превращаем цену в число. Если там мусор — будет 0.
  const rawPrice = Number(item.price_per_day) || 0;
  
  // 2. Конвертируем в выбранную валюту
  const converted = convert(rawPrice);
  const priceDisplay = converted.full; // Например: "2500 ₽" или "27 $"

  // 3. Создаем HTML для иконки (Метка на карте)
  const createPriceIcon = (priceText) => {
    return L.divIcon({
      className: 'custom-price-marker',
      // Вставляем стили прямо сюда, чтобы точно применились
      html: `<div style="
        background-color: white; 
        color: black; 
        font-weight: 800; 
        padding: 5px 10px; 
        border-radius: 12px; 
        box-shadow: 0 3px 6px rgba(0,0,0,0.3); 
        border: 1px solid #e5e7eb;
        font-size: 13px;
        font-family: sans-serif;
        text-align: center;
        white-space: nowrap;
        display: flex;
        justify-content: center;
        align-items: center;
      ">
        ${priceText}
      </div>`,
      iconSize: [null, 30], // Авто-ширина
      iconAnchor: [20, 15], // Центрирование
    });
  };

  // Координаты (с защитой, если вдруг их нет — ставим Москву)
  const position = [item.latitude || 55.75, item.longitude || 37.61];

  return (
    <Marker 
      position={position} 
      icon={createPriceIcon(priceDisplay)} // Передаем красивую цену
      eventHandlers={{
        click: () => navigate(`/item/${item.id}`),
        mouseover: (e) => e.target.openTooltip(),
        mouseout: (e) => e.target.closeTooltip()
      }}
    >
      <Tooltip 
        direction="top"
        offset={[0, -20]}
        opacity={1}
        permanent={false}
        className="leaflet-tooltip-no-padding border-0 bg-transparent shadow-none"
      >
        {/* МИНИ-КАРТОЧКА ПРИ НАВЕДЕНИИ */}
        <div className="w-40 bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-100 font-sans">
          
          {/* Фото */}
          <div className="h-24 w-full bg-gray-100 relative">
            {item.photos?.[0] ? (
              <img 
                src={item.photos[0]} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            ) : (
               <div className="flex items-center justify-center h-full text-xs text-gray-400">No Photo</div>
            )}
            {/* Градиент с ценой */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-4">
               <span className="text-white font-bold text-sm">{priceDisplay}</span>
            </div>
          </div>
          
          {/* Название */}
          <div className="p-2 bg-white">
             <p className="text-xs font-semibold text-gray-800 truncate leading-tight mb-1">
                {item.title}
             </p>
             <p className="text-[10px] text-gray-500">
               {t('view') || 'Click to view'}
             </p>
          </div>

        </div>
      </Tooltip>
    </Marker>
  );
};

export default PricePin;