import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const TelegramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22 11 13 2 9l20-7z" />
  </svg>
);

export default function CommunityLinks() {
  return (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl p-8 md:p-12 my-12"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold mb-2">Junte-se à nossa comunidade!</h2>
          <p className="opacity-90 max-w-lg">
            Receba as melhores ofertas diretamente no seu celular e não perca nenhuma promoção.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-6 rounded-xl transition-transform hover:scale-105"
          >
            <a href="#" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              <span className="ml-2">WhatsApp</span>
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-lg px-8 py-6 rounded-xl transition-transform hover:scale-105"
          >
            <a href="#" target="_blank" rel="noopener noreferrer">
              <TelegramIcon />
              <span className="ml-2">Telegram</span>
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}