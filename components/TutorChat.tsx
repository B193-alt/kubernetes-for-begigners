import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { askTutor } from '../services/gemini';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface TutorChatProps {
  currentContext: string;
}

export const TutorChat: React.FC<TutorChatProps> = ({ currentContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Ahoy! I'm Captain Kube. I can explain any of this complicated stuff in simple terms. Ask me anything!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await askTutor(userMsg.text, currentContext);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I lost connection to the main tower.", isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
      <div className="bg-indigo-600 p-4 flex items-center gap-3">
        <div className="p-2 bg-indigo-500 rounded-full">
            <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
            <h3 className="text-white font-semibold">Captain Kube</h3>
            <p className="text-indigo-200 text-xs">AI Tutor • 5-Year-Old Level</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`
               max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
               ${msg.role === 'user' 
                 ? 'bg-indigo-600 text-white rounded-br-none' 
                 : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'}
               ${msg.isError ? 'bg-red-50 text-red-600 border-red-200' : ''}
             `}>
               {msg.text}
             </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                <span className="text-xs text-slate-400">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-slate-100">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2 relative"
        >
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..." 
            className="w-full pl-4 pr-12 py-3 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="absolute right-1.5 top-1.5 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
