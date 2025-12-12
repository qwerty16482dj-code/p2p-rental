import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // ... старые ключи ...
      "rent_items": "Rent Items",
      "search_placeholder": "Search...",
      "found": "Found",
      "my_items": "My Items",
      "bookings": "Bookings",
      "login": "Log in",
      "logout": "Log out",
      "rent_out": "Rent out",
      "price_day": "/ day",
      "book": "Book now",
      "total": "Total",
      "service_fee": "Service fee",
      "discount": "Long term discount",
      "description": "Description",
      "owner": "Owner",
      "category": "Category",
      "empty": "Nothing here yet",
      "move_map": "Move map to search",
      "loading": "Loading...",
      "success_booking": "Success! Request sent.",
      "success_item": "Item published!",
      "i_am_renting": "I am renting",
      "incoming_requests": "Incoming requests",
      "confirm": "Confirm",
      "reject": "Reject",
      "view": "View",
      "delete": "Delete",
      "renter": "Renter",
      "price_per_day": "Price per day",
      "find_items": "Find items",
      "empty_bookings_message": "No bookings yet.",
      "empty_items_message": "No items yet.",
      "create_first_item": "Create first item",
      "back_to_search": "Back to search",
      "rating": "Rating",
      
      // ДОБАВЛЕНЫ НОВЫЕ КЛЮЧИ:
      "chat": "Chat", 
      "back": "Back",
      "booking_id": "Order",
      "type_message": "Type a message...",

      "status_requested": "Pending",
      "status_confirmed": "Confirmed",
      "status_rejected": "Rejected",
      "status_completed": "Completed",

      "cat_all": "All",
      "cat_photo": "Photo",
      "cat_consoles": "Consoles",
      "cat_bikes": "Bikes",
      "cat_scooters": "Scooters",
      "cat_laptops": "Laptops",
      "cat_camping": "Camping",
      "cat_tools": "Tools",
      "cat_other": "Other",
      "item_title": "Item name",
"photo": "Photo",
"publish": "Publish",
    }
  },
  ru: {
    translation: {
      // ... старые ключи ...
      "rent_items": "Аренда вещей",
      "search_placeholder": "Поиск...",
      "found": "Найдено",
      "my_items": "Мои товары",
      "bookings": "Бронирования",
      "login": "Войти",
      "logout": "Выйти",
      "rent_out": "Сдать вещь",
      "price_day": "/ сутки",
      "book": "Забронировать",
      "total": "Итого",
      "service_fee": "Сервисный сбор",
      "discount": "Скидка за срок",
      "description": "Описание",
      "owner": "Владелец",
      "category": "Категория",
      "empty": "Здесь пока пусто",
      "move_map": "Сдвиньте карту для поиска",
      "loading": "Загрузка...",
      "success_booking": "Успешно! Заявка отправлена.",
      "success_item": "Объявление опубликовано!",
      "i_am_renting": "Я арендую",
      "incoming_requests": "Входящие заявки",
      "confirm": "Подтвердить",
      "reject": "Отклонить",
      "view": "Посмотреть",
      "delete": "Удалить",
      "renter": "Арендатор",
      "price_per_day": "Цена за сутки",
      "find_items": "Найти вещи",
      "empty_bookings_message": "Нет бронирований.",
      "empty_items_message": "Нет объявлений.",
      "create_first_item": "Создать первое объявление",
      "back_to_search": "Назад к поиску",
      "rating": "Рейтинг",

      // ДОБАВЛЕНЫ НОВЫЕ КЛЮЧИ:
      "chat": "чат",
      "back": "Назад",
      "booking_id": "Заказ",
      "type_message": "Напишите сообщение...",

      "status_requested": "Ожидает",
      "status_confirmed": "Подтверждено",
      "status_rejected": "Отклонено",
      "status_completed": "Завершено",

      "cat_all": "Все",
      "cat_photo": "Фото",
      "cat_consoles": "Консоли",
      "cat_bikes": "Вело",
      "cat_scooters": "Самокаты",
      "cat_laptops": "Ноутбуки",
      "cat_camping": "Туризм",
      "cat_tools": "Инструмент",
      "cat_other": "Другое",
      "item_title": "Название вещи",
"photo": "Фотография",
"publish": "Опубликовать"
    }
  },
  uk: {
    translation: {
      // ... старые ключи ...
      "rent_items": "Оренда речей",
      "search_placeholder": "Пошук...",
      "found": "Знайдено",
      "my_items": "Мої товари",
      "bookings": "Бронювання",
      "login": "Увійти",
      "logout": "Вийти",
      "rent_out": "Здати річ",
      "price_day": "/ добу",
      "book": "Забронювати",
      "total": "Разом",
      "service_fee": "Сервісний збір",
      "discount": "Знижка за термін",
      "description": "Опис",
      "owner": "Власник",
      "category": "Категорія",
      "empty": "Тут поки порожньо",
      "move_map": "Посуньте карту для пошуку",
      "loading": "Завантаження...",
      "success_booking": "Успішно! Заявку надіслано.",
      "success_item": "Оголошення опубліковано!",
      "i_am_renting": "Я орендую",
      "incoming_requests": "Вхідні заявки",
      "confirm": "Підтвердити",
      "reject": "Відхилити",
      "view": "Переглянути",
      "delete": "Видалити",
      "renter": "Орендар",
      "price_per_day": "Ціна за добу",
      "find_items": "Знайти речі",
      "empty_bookings_message": "Немає бронювань.",
      "empty_items_message": "Немає оголошень.",
      "create_first_item": "Створити перше оголошення",
      "back_to_search": "Назад до пошуку",
      "rating": "Рейтинг",

      // ДОБАВЛЕНЫ НОВЫЕ КЛЮЧИ:
      "chat": "чат",
      "back": "Назад",
      "booking_id": "Замовлення",
      "type_message": "Напишіть повідомлення...",

      "status_requested": "Очікує",
      "status_confirmed": "Підтверджено",
      "status_rejected": "Відхилено",
      "status_completed": "Завершено",

      "cat_all": "Всі",
      "cat_photo": "Фото",
      "cat_consoles": "Консолі",
      "cat_bikes": "Вело",
      "cat_scooters": "Самокати",
      "cat_laptops": "Ноутбуки",
      "cat_camping": "Туризм",
      "cat_tools": "Інструмент",
      "cat_other": "Інше",
      "item_title": "Назва речі",
"photo": "Фото",
"publish": "Опублікувати"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    interpolation: { escapeValue: false }
  });

export default i18n;