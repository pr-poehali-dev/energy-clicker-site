import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface GameState {
  shekltk: number;
  energy: number;
  lastEnergyUpdate: number;
  currentView: "game" | "house";
  ownedItems: string[];
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem("clickerGame");
    return saved
      ? JSON.parse(saved)
      : {
          shekltk: 0,
          energy: 1000,
          lastEnergyUpdate: Date.now(),
          currentView: "game",
          ownedItems: [],
        };
  });

  const [clickAnimation, setClickAnimation] = useState(false);

  // Сохранение игрового состояния
  useEffect(() => {
    localStorage.setItem("clickerGame", JSON.stringify(gameState));
  }, [gameState]);

  // Восстановление энергии (упрощенная версия)
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        const now = Date.now();
        const timeDiff = now - prev.lastEnergyUpdate;
        const hoursPassedFull = Math.floor(timeDiff / (60 * 60 * 1000));
        const hoursPassedTen = Math.floor(timeDiff / (10 * 60 * 60 * 1000));

        let energyToAdd = 0;
        if (hoursPassedTen > 0) {
          energyToAdd = hoursPassedTen * 1000;
        } else if (hoursPassedFull > 0) {
          energyToAdd = hoursPassedFull * 100;
        }

        if (energyToAdd > 0) {
          return {
            ...prev,
            energy: Math.min(1000, prev.energy + energyToAdd),
            lastEnergyUpdate: now,
          };
        }
        return prev;
      });
    }, 60000); // Проверяем каждую минуту

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (gameState.energy > 0) {
      setGameState((prev) => ({
        ...prev,
        shekltk: prev.shekltk + 0.1,
        energy: prev.energy - 1,
      }));

      setClickAnimation(true);
      setTimeout(() => setClickAnimation(false), 200);
    }
  };

  const energyPercentage = (gameState.energy / 1000) * 100;

  const houseItems = [
    {
      id: "bed",
      name: "🛏️ Кровать",
      price: 5,
      description: "Уютная кровать для отдыха",
    },
    {
      id: "table",
      name: "🪑 Стол",
      price: 8,
      description: "Деревянный стол для работы",
    },
    {
      id: "tv",
      name: "📺 Телевизор",
      price: 15,
      description: "Развлечения после работы",
    },
    {
      id: "plant",
      name: "🪴 Растение",
      price: 3,
      description: "Декоративное растение",
    },
    {
      id: "bookshelf",
      name: "📚 Книжная полка",
      price: 12,
      description: "Для хранения знаний",
    },
    {
      id: "sofa",
      name: "🛋️ Диван",
      price: 20,
      description: "Комфортный диван",
    },
  ];

  const buyItem = (item: (typeof houseItems)[0]) => {
    if (
      gameState.shekltk >= item.price &&
      !gameState.ownedItems.includes(item.id)
    ) {
      setGameState((prev) => ({
        ...prev,
        shekltk: prev.shekltk - item.price,
        ownedItems: [...prev.ownedItems, item.id],
      }));
    }
  };

  const switchView = (view: "game" | "house") => {
    setGameState((prev) => ({ ...prev, currentView: view }));
  };

  if (gameState.currentView === "house") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 text-white font-['Rubik']">
        {/* Заголовок дома */}
        <div className="container mx-auto px-4 py-6">
          <Card className="bg-amber-800/50 border-orange-500/30 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold text-orange-300">
                🏠 Мой дом
              </CardTitle>
              <p className="text-amber-200">
                💎 {gameState.shekltk.toFixed(1)} Shekltk
              </p>
            </CardHeader>
          </Card>
        </div>

        {/* Дом и предметы */}
        <div className="container mx-auto px-4">
          {/* Визуализация дома */}
          <div className="bg-gradient-to-b from-amber-600 to-amber-700 rounded-3xl p-8 mb-6 border-4 border-amber-500/50">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-amber-100">
                Твоя комната
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4 min-h-[200px] bg-amber-500/20 rounded-2xl p-6">
              {gameState.ownedItems.map((itemId) => {
                const item = houseItems.find((i) => i.id === itemId);
                return item ? (
                  <div key={itemId} className="text-center">
                    <div className="text-4xl mb-2">
                      {item.name.split(" ")[0]}
                    </div>
                    <p className="text-xs text-amber-200">
                      {item.name.split(" ").slice(1).join(" ")}
                    </p>
                  </div>
                ) : null;
              })}
              {gameState.ownedItems.length === 0 && (
                <div className="col-span-3 text-center text-amber-300 text-lg">
                  Пустая комната... Купи что-нибудь!
                </div>
              )}
            </div>
          </div>

          {/* Магазин предметов */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {houseItems.map((item) => {
              const isOwned = gameState.ownedItems.includes(item.id);
              const canBuy = gameState.shekltk >= item.price && !isOwned;

              return (
                <Card
                  key={item.id}
                  className="bg-amber-800/50 border-orange-500/30"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-orange-200">
                          {item.name}
                        </h4>
                        <p className="text-sm text-amber-300">
                          {item.description}
                        </p>
                        <p className="text-orange-400 font-semibold">
                          💎 {item.price} Shekltk
                        </p>
                      </div>
                      <Button
                        onClick={() => buyItem(item)}
                        disabled={!canBuy}
                        className={`ml-4 ${
                          isOwned
                            ? "bg-green-600 hover:bg-green-600"
                            : canBuy
                              ? "bg-orange-600 hover:bg-orange-500"
                              : "bg-gray-600 hover:bg-gray-600"
                        }`}
                      >
                        {isOwned ? "✓ Куплено" : canBuy ? "Купить" : "Дорого"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Кнопка назад */}
          <div className="text-center pb-6">
            <Button
              onClick={() => switchView("game")}
              className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 text-lg"
            >
              <Icon name="ArrowLeft" className="mr-2" />
              Вернуться к игре
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-['Rubik']">
      {/* Заголовок с балансом */}
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-purple-300">
              💎 {gameState.shekltk.toFixed(1)} Shekltk
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Игровая область */}
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        {/* Кликабельная область */}
        <div className="mb-8">
          <Button
            onClick={handleClick}
            disabled={gameState.energy <= 0}
            className={`
              w-64 h-64 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600
              hover:from-yellow-300 hover:via-amber-400 hover:to-yellow-500 shadow-2xl
              transition-all duration-200 hover:scale-105 active:scale-95 relative overflow-hidden
              ${clickAnimation ? "animate-pulse shadow-yellow-500/50" : ""}
              ${gameState.energy <= 0 ? "opacity-50 cursor-not-allowed" : "hover:shadow-yellow-500/30"}
            `}
          >
            <div className="flex flex-col items-center relative">
              {/* Сладкая вата */}
              <div className="relative">
                {/* Палочка */}
                <div className="w-2 h-16 bg-white rounded-full mx-auto mb-2 shadow-sm"></div>

                {/* Вата - синяя часть (снизу) */}
                <div className="w-20 h-12 bg-gradient-to-t from-blue-400 to-blue-300 rounded-full absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-90"></div>

                {/* Вата - розовая часть (сверху) */}
                <div className="w-24 h-14 bg-gradient-to-b from-pink-400 to-pink-300 rounded-full absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-90"></div>

                {/* Дополнительные облачка для объема */}
                <div className="relative transform -rotate-45">
                  <div className="w-16 h-8 bg-gradient-to-bl from-pink-300 to-transparent rounded-full absolute -top-14 left-1/2 transform translate-x-2 opacity-60"></div>
                  <div className="w-12 h-6 bg-gradient-to-t from-blue-300 to-transparent rounded-full absolute -top-6 left-1/2 transform -translate-x-6 opacity-60"></div>
                </div>
              </div>

              <span className="text-lg font-bold mt-8 text-amber-900">
                КЛИК
              </span>
            </div>
          </Button>
        </div>

        {/* Информация об энергии */}
        <Card className="w-full max-w-md bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-purple-300">
                ⚡ Энергия
              </span>
              <span className="text-xl font-bold">{gameState.energy}/1000</span>
            </div>

            {/* Полоса энергии */}
            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${energyPercentage}%` }}
              />
            </div>

            <div className="mt-4 text-center text-sm text-slate-400">
              {gameState.energy <= 0 && (
                <p className="text-red-400 font-medium">
                  Энергия закончилась! Подождите восстановления...
                </p>
              )}
              {gameState.energy > 0 && (
                <p>Восстановление: +100 каждый час, +1000 каждые 10 часов</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Статистика */}
        <div className="mt-6 text-center text-slate-400">
          <p className="text-sm">
            За клик: +0.1 Shekltk | Стоимость: 1 энергия
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
