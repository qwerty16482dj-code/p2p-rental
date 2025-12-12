import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Layout/Header';

// Импорт страниц
import SearchPage from './pages/SearchPage';
import ItemPage from './pages/ItemPage';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/AuthPage';
import BookingsPage from './pages/BookingsPage';
import CreateItemPage from './pages/CreateItemPage';
import MyItemsPage from './pages/MyItemsPage';

function App() {
  return (
    <AuthProvider>
      <div className="App pt-16">
        <Header />
        
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/create" element={<CreateItemPage />} />
          <Route path="/my-items" element={<MyItemsPage />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/chat/:bookingId" element={<ChatPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;