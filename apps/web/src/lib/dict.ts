export const dict = {
  ru: {
    models: "Модели",
    about: "О нас",
    cities: "Города",
    back: "Назад",
    contact: "Связаться с менеджером",
    specs: "Характеристики",
    age: "Возраст",
    height: "Рост",
    weight: "Вес",
    bust: "Грудь",
    nat: "Национальность",
    services: "Услуги",
    price: "Стоимость",
    h1: "1 час",
    h2: "2 часа",
    h4: "4 часа",
    free: "Свободна",
    busy: "Занята",
    notFound: "Ничего не найдено",
  },
  en: {
    models: "Models",
    about: "About",
    cities: "Cities",
    back: "Back",
    contact: "Contact Manager",
    specs: "Specifications",
    age: "Age",
    height: "Height",
    weight: "Weight",
    bust: "Bust",
    nat: "Nationality",
    services: "Services",
    price: "Rates",
    h1: "1 hour",
    h2: "2 hours",
    h4: "4 hours",
    free: "Available",
    busy: "Busy",
    notFound: "Nothing found",
  }
};

export const translateCity = (city: string, lang: string) => {
  if (lang === 'en') {
    const map: Record<string, string> = { "Пхукет": "Phuket", "Бангкок": "Bangkok", "Дубай": "Dubai", "Лондон": "London", "Тбилиси": "Tbilisi", "Бали": "Bali" };
    return map[city] || city;
  }
  return city;
};

export const translateNat = (nat: string, lang: string) => {
  if (lang === 'en') {
    const map: Record<string, string> = { "Русская": "Russian", "Украинка": "Ukrainian", "Тайка": "Thai", "Латинка": "Latin", "Европейка": "European" };
    return map[nat] || nat;
  }
  return nat;
};

export const translateService = (s: string, lang: string) => {
  if (lang === 'en') {
    const map: Record<string, string> = { "МБР": "BBBJ", "Кунилингус": "Cunnilingus", "С аппартаментами": "Incall", "Анал": "Anal", "Свободна ли": "Available now" };
    return map[s] || s;
  }
  return s;
};
