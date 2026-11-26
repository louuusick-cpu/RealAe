export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">
      
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-light mb-6">О нас</h1>
        <p className="text-lg md:text-xl text-text-dim leading-relaxed max-w-2xl">
          Real Aesthetics — закрытое агентство с широким спектром услуг. Мы делаем ставку на качественную точечную работу с каждым клиентом.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 border-t border-line pt-12">
        <div>
          <h2 className="text-xl font-medium mb-4">Философия</h2>
          <p className="text-text-dim leading-relaxed mb-6">
            Мы верим, что идеальный вечер начинается с правильной компании. Будь то деловой ужин, светское мероприятие или приватная встреча — мы подбираем моделей вручную, уделяя внимание каждой детали. 
          </p>
          <p className="text-text-dim leading-relaxed">
            В нашем агентстве нет конвейера. Мы не работаем с потоком клиентов. Наш подход — это ручной отбор, абсолютная дискретность и внимание к вашим пожеланиям.
          </p>
        </div>
        
        <div>
          <h2 className="text-xl font-medium mb-4">Принципы</h2>
          <ul className="space-y-4 text-text-dim">
            <li className="flex items-start gap-3">
              <span className="text-text mt-1">01</span>
              <span><strong className="text-text font-medium">Конфиденциальность.</strong> Полная анонимность и безопасность как для клиентов, так и для моделей.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-text mt-1">02</span>
              <span><strong className="text-text font-medium">Отбор.</strong> В нашем каталоге только проверенные девушки с модельной внешностью и светскими манерами.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-text mt-1">03</span>
              <span><strong className="text-text font-medium">Сервис.</strong> Мы работаем 24/7, чтобы организовать ваш досуг в кратчайшие сроки.</span>
            </li>
          </ul>
        </div>
      </div>

    </main>
  );
}
