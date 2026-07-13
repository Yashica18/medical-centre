import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  MapPin, 
  Loader2, 
  Bot, 
  ArrowRight,
  ChevronDown,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  groundingUrls?: Array<{ uri: string; title: string }>;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { label: '📅 How do I schedule an appointment?', text: 'How do I schedule an appointment online?' },
  { label: '🩺 Meet Cardiology Specialists', text: 'Tell me about the Cardiology doctors and their slots' },
  { label: '📍 Where is Sanjeevani Medical Centre?', text: 'Where is Sanjeevani Medical Centre located, and what is its phone number?' },
  { label: '🚑 24/7 Emergency Services', text: 'Do you offer emergency trauma care or an ambulance?' },
  { label: '📱 How to track or cancel a booking?', text: 'How do I track or cancel my booked appointment?' }
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! Welcome to the **Sanjeevani Medical Centre** Virtual Assistant. 🌟\n\nI am here to help answer your questions about our specialized departments, doctor timings, booking process, or where to find our facilities. Ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Attempt to get user location for maps grounding
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log("Geolocation permission declined or failed. Defaulting to centre's coordinates.", error);
        }
      );
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Map current React messages state to the API expected history format
      // API expects [{"role": "user" | "model", "parts": [{"text": "..."}]}]
      const historyPayload = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          userLocation: userLocation
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server responded with an error');
      }

      const data = await response.json();

      // Extract maps or web grounding urls
      const groundingUrls: Array<{ uri: string; title: string }> = [];
      if (data.groundingChunks && Array.isArray(data.groundingChunks)) {
        data.groundingChunks.forEach((chunk: any) => {
          if (chunk.maps) {
            groundingUrls.push({
              uri: chunk.maps.uri,
              title: chunk.maps.title || 'View Location on Google Maps'
            });
          } else if (chunk.web) {
            groundingUrls.push({
              uri: chunk.web.uri,
              title: chunk.web.title || 'Verified Web Info Source'
            });
          }
        });
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'model',
        text: data.text,
        groundingUrls: groundingUrls.length > 0 ? groundingUrls : undefined,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `⚠️ **Connection Error**: ${error.message || 'Unable to connect to Sanjeevani Support Services. Please try again later.'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          id="sanjeevani-support-chatbot-trigger"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-radial from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer relative group border border-teal-400/20"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <MessageSquare className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Tooltip on hover */}
          {!isOpen && (
            <span className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Need Help? Ask Sanjeevani Assistant ✨
            </span>
          )}
        </motion.button>
      </div>

      {/* Slide up / scale up Chat Box Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="sanjeevani-support-chatbot-window"
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[580px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden"
          >
            {/* Header section with branding and status */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white px-5 py-4 flex items-center justify-between border-b border-teal-700/20 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-100 shadow-inner">
                  <Sparkles className="w-5.5 h-5.5 text-teal-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm tracking-tight flex items-center gap-1">
                    Sanjeevani Assistant
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] text-teal-100 font-medium">Assistant Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-teal-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                  title="Close Assistant"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conversation Feed Thread */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.role === 'model' && (
                      <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 text-xs shadow-2xs font-semibold">
                        S
                      </div>
                    )}
                    
                    <div className="space-y-1.5">
                      <div
                        className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-teal-600 text-white rounded-tr-xs shadow-md shadow-teal-600/10'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-xs shadow-xs'
                        }`}
                      >
                        {msg.role === 'model' ? (
                          <div className="markdown-body prose prose-sm prose-teal max-w-none text-gray-700 font-light">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                        )}
                      </div>

                      {/* Grounding elements / Maps cards */}
                      {msg.groundingUrls && (
                        <div className="flex flex-col gap-1.5 pt-1">
                          {msg.groundingUrls.map((link, idx) => (
                            <motion.a
                              key={idx}
                              href={link.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors w-fit"
                            >
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{link.title}</span>
                              <ExternalLink className="w-3 h-3 text-emerald-500 ml-0.5" />
                            </motion.a>
                          ))}
                        </div>
                      )}

                      <span className="text-[9px] text-gray-400 block px-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Waiting Loader animation */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-2.5 max-w-[85%] items-start">
                    <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 text-xs shadow-2xs font-semibold">
                      S
                    </div>
                    <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                      <span className="text-xs text-gray-500 font-medium">Assistant is typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Prompt Panel */}
            <div className="border-t border-gray-100 bg-white p-3 space-y-2">
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold uppercase tracking-wider px-1">
                <HelpCircle className="w-3.5 h-3.5 text-teal-500" />
                <span>Common Enquiries</span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt.text)}
                    disabled={isLoading}
                    className="flex-shrink-0 bg-gray-50 hover:bg-teal-50 hover:text-teal-800 text-gray-600 border border-gray-200/60 hover:border-teal-200 px-2.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Message Form */}
            <form onSubmit={handleFormSubmit} className="border-t border-gray-100 p-3 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about booking, doctors, timings..."
                className="flex-grow bg-gray-50 border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-teal-500 font-light"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-gray-100 disabled:text-gray-400 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
