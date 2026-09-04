import React, { useState } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { AICoachMessage } from '../types';
import { GoogleGenAI } from '@google/genai';

interface Props {
  isArabic: boolean;
  messages: AICoachMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

export const AICoachScreen: React.FC<Props> = ({
  isArabic,
  messages,
  isLoading,
  onSendMessage
}) => {
  const [input, setInput] = useState('');

  const quickChips = isArabic
    ? ['أشعر بالتوتر وضيق الوقت', 'أريد تحفيز طاقتي الصباحية', 'تجهيز نفسي لنوم عميق ومريح', 'تمارين يوغا للمكتب']
    : ['Feeling stressed and tight', 'Morning energy boost', 'Wind down for deep sleep', 'Desk ergonomics yoga'];

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-[82vh] pb-24 pt-2">
      {/* Title */}
      <div className="flex items-center space-x-3 space-x-reverse mb-3">
        <div className="w-9 h-9 rounded-full bg-[#E2C854]/20 flex items-center justify-center text-[#E2C854]">
          <Bot size={20} />
        </div>
        <div>
          <h1 className="text-base font-bold text-[#EDEDED]">
            {isArabic ? 'المرشد الذكي للسكينة ✦' : 'Gemini Wellness Coach ✦'}
          </h1>
          <p className="text-xs text-[#A3A3A3]">
            {isArabic ? 'إرشادات مخصصة لحالتك النفسية والجسدية' : 'Personalized somatic guidance'}
          </p>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-2 scrollbar-none mb-2">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(chip)}
            className="whitespace-nowrap px-3 py-1.5 bg-[#181818] border border-[#262626] rounded-full text-xs text-[#EDEDED] hover:border-[#E2C854] transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.isUser
                  ? 'bg-[#E2C854] text-[#121212] rounded-br-xs font-medium'
                  : 'bg-[#181818] text-[#EDEDED] border border-[#262626] rounded-bl-xs'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#181818] border border-[#262626] p-3 rounded-2xl flex items-center space-x-2 space-x-reverse text-xs text-[#A3A3A3]">
              <Loader2 size={16} className="animate-spin text-[#E2C854]" />
              <span>{isArabic ? 'المرشد الذكي يفكر...' : 'Coach is thinking...'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="pt-2 flex items-center space-x-2 space-x-reverse">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isArabic ? 'اسأل مرشدك الذكي...' : 'Ask your wellness coach...'}
          className="flex-1 bg-[#181818] border border-[#262626] focus:border-[#E2C854] text-xs text-[#EDEDED] px-4 py-3 rounded-full outline-none placeholder-[#A3A3A3]"
        />
        <button
          onClick={handleSend}
          className="w-10 h-10 rounded-full bg-[#E2C854] text-[#121212] flex items-center justify-center hover:bg-[#d8bd48] transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};
