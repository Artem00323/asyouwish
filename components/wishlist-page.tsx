// components/wishlist-page.tsx

'use client';

import { useState, useEffect } from 'react';

import Sidebar from '@/components/sidebar';
import BottomNavBar from '@/components/bottom-nav-bar';
import { YourWishlistComponent } from '@/components/your-wishlist-component';
import { FriendsWishlists } from '@/components/friends-wishlist-component';
import { CalendarComponent } from '@/components/calendar-component';
import { ProfileComponent } from '@/components/profile-component';
import { WishlistSelectionComponent } from '@/components/ui/wishlist-selection-component';
import { Wishlist } from './ui/types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/components/backend/firebase';

// Определяем типы
export type Tab = 'your-wishlist' | 'friends-wishlists' | 'calendar-events' | 'profile';

export function WishlistPageComponent() {
  const [activeTab, setActiveTab] = useState<Tab>('your-wishlist');
  const [selectedWishlistId, setSelectedWishlistId] = useState<string | null>(null);

  // Получаем текущего пользователя
  const [user, loadingUser, userError] = useAuthState(auth);

  // Состояние для списков желаний
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loadingWishlists, setLoadingWishlists] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      // Функция для загрузки списков желаний из базы данных
      const fetchWishlists = async () => {
        setLoadingWishlists(true);
        try {
          const response = await fetch('/api/getUserWishlists', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: user.uid }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch wishlists');
          }

          const data = await response.json();

          // Преобразуем полученные данные в нужный формат
          const wishlistsFromDb: Wishlist[] = data.wishlists.map((item: {
            id: string;
            name: string;
            date: string; // Date comes as a string from the database
            emoji: string;
            event_type: string;
          }) => ({
            id: item.id,
            name: item.name,
            date: new Date(item.date),
            emoji: item.emoji,
            eventType: item.event_type,
          }));

          setWishlists(wishlistsFromDb);
        } catch (err) {
          console.error('Error fetching wishlists:', err);
        } finally {
          setLoadingWishlists(false);
        }
      };

      fetchWishlists();
    }
  }, [user]);

  // Обработка состояния загрузки пользователя
  if (loadingUser) {
    return <div>Loading...</div>;
  }

  if (userError) {
    return <div>Error: {userError.message}</div>;
  }

  if (!user) {
    // Если пользователь не авторизован
    return <div>Please log in to view your wishlists.</div>;
  }

  // Функция для удаления списка желаний
  const handleDeleteWishlist = (id: string) => {
    // TODO: Добавить запрос к API для удаления списка желаний из базы данных

    // Обновляем состояние локально
    setWishlists(wishlists.filter((wishlist) => wishlist.id !== id));
    setSelectedWishlistId(null); // Возвращаемся к выбору списка желаний
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar для больших экранов */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Основной контент и нижняя навигация */}
      <div className="flex flex-col flex-1 relative">
        {/* Основной контент */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          {/* Отображаем контент в зависимости от активной вкладки */}
          {activeTab === 'your-wishlist' && (
            selectedWishlistId === null ? (
              loadingWishlists ? (
                <div>Loading wishlists...</div>
              ) : (
                <WishlistSelectionComponent
                  wishlists={wishlists}
                  setWishlists={setWishlists}
                  onSelectWishlist={setSelectedWishlistId}
                />
              )
            ) : (
              <YourWishlistComponent
                wishlistId={selectedWishlistId}
                wishlists={wishlists}
                onDeleteWishlist={handleDeleteWishlist}
                onBack={() => setSelectedWishlistId(null)}
              />
            )
          )}
          {activeTab === 'friends-wishlists' && <FriendsWishlists />}
          {activeTab === 'calendar-events' && <CalendarComponent />}
          {activeTab === 'profile' && <ProfileComponent />}
        </main>

        {/* Нижняя навигация для мобильных устройств */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-10">
          <BottomNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
