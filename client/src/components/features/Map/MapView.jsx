import React from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import PricePin from './PricePin';

// Компонент для отслеживания перемещения карты
const MapEvents = ({ setBounds }) => {
  useMapEvents({
    moveend: (e) => setBounds(e.target.getBounds()),
    load: (e) => setBounds(e.target.getBounds())
  });
  return null;
};

// --- КНОПКА ГЕОЛОКАЦИИ ---
const LocateControl = () => {
  const map = useMap();
  
  const handleLocate = (e) => {
    e.stopPropagation(); // Чтобы клик не проваливался на карту
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, 13); // Плавный полет к пользователю
    });
  };

  // Используем стандартные классы Leaflet для позиционирования
  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button 
          onClick={handleLocate}
          className="bg-white w-8 h-8 md:w-10 md:h-10 flex items-center justify-center cursor-pointer hover:bg-gray-100 text-lg md:text-xl font-bold text-black border-none shadow-sm transition-colors"
          title="Показать мое местоположение"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          📍
        </button>
      </div>
    </div>
  );
};

const MapView = ({ items, onBoundsChange }) => {
  const defaultPosition = [55.751244, 37.618423]; // Москва по умолчанию

  return (
    <MapContainer 
      center={defaultPosition} 
      zoom={10} 
      style={{ width: '100%', height: '100%' }}
      zoomControl={false} // Отключаем дефолтный зум (можно перенести его если нужно)
      whenCreated={(map) => onBoundsChange(map.getBounds())}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      {/* Возвращаем зум в удобное место (например, справа вверху) */}
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
      />

      <MapEvents setBounds={onBoundsChange} />
      
      {/* Кнопка "Где я" */}
      <LocateControl />

      {/* Пины товаров */}
      {items.map((item) => (
        <PricePin key={item.id} item={item} />
      ))}
    </MapContainer>
  );
};

export default MapView;