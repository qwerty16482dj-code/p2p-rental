import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useGeoSearch = (bounds) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bounds) return;

    const fetchItems = async () => {
      setLoading(true);
      const { _southWest, _northEast } = bounds;

      // Вызов SQL функции Supabase
      const { data, error } = await supabase
        .rpc('get_items_in_bounds', {
          min_lat: _southWest.lat,
          min_lon: _southWest.lng,
          max_lat: _northEast.lat,
          max_lon: _northEast.lng,
        });

      if (error) {
        console.error('Ошибка поиска:', error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    // Задержка 0.5 сек, чтобы не спамить запросами при движении
    const timer = setTimeout(() => {
      fetchItems();
    }, 500);

    return () => clearTimeout(timer);
  }, [bounds]);

  return { items, loading };
};