import React, { useState } from 'react';
import type { FAQ } from '../../types';

const faqs: FAQ[] = [
  {
    id: 1,
    question: "Как начать торговать криптовалютами?",
    answer: "Для начала торговли вам нужно зарегистрироваться на платформе, пройти верификацию и пополнить счет. После этого вы сможете покупать и продавать криптовалюты через наш удобный интерфейс."
  },
  {
    id: 2,
    question: "Какие комиссии взимаются при торговле?",
    answer: "Мы предлагаем одни из самых низких комиссий на рынке. Стандартная комиссия за торговую операцию составляет 0.1%. При использовании нашей нативной токен-монеты комиссия снижается до 0.05%."
  },
  {
    id: 3,
    question: "Как обеспечивается безопасность средств?",
    answer: "Мы используем многоуровневую систему безопасности, включая холодное хранение средств, двухфакторную аутентификацию и шифрование данных. Большинство средств хранятся в офлайн-хранилищах для максимальной защиты."
  },
  {
    id: 4,
    question: "Какие криптовалюты доступны для торговли?",
    answer: "На платформе доступны все основные криптовалюты, включая Bitcoin, Ethereum, USDT, BNB и многие другие. Мы регулярно добавляем новые активы, следуя за потребностями рынка."
  },
  {
    id: 5,
    question: "Как вывести средства?",
    answer: "Вывод средств доступен в любой момент через раздел 'Кошелек'. Вы можете вывести средства на банковскую карту или криптовалютный кошелек. Время обработки вывода зависит от выбранного метода."
  }
];

const FAQ: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section className="py-16 bg-slate-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Часто задаваемые вопросы</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-slate-800 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq(faq.id)}
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <svg
                  className={`w-6 h-6 transform transition-transform ${
                    openFaqId === faq.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openFaqId === faq.id && (
                <div className="px-6 py-4 bg-slate-700">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 