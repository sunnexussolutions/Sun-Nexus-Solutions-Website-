import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hello Bhargav! I am your AI Mentor. How can I help you in your B.Tech journey today?', time: 'Just now' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), role: 'user', content: input, time: 'Just now' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "";
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('aptitude')) {
        aiResponse = "The Aptitude module has been recently updated! You can now track your progress through weighted categories like Quantitative and Logical Reasoning. Need a practice test?";
      } else if (lowerInput.includes('project') || lowerInput.includes('build')) {
        aiResponse = "I see you're interested in the Project Hub. You can use the Builder to initialize new templates or browse the Gallery for trending engineering projects.";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        aiResponse = "Hello Bhargav! Glad to see you back on the Nexus. Your current global rank is #128. Ready to level up today?";
      } else if (lowerInput.includes('community')) {
        aiResponse = "The Nexus Community is thriving! Join the trending discussions on #SystemDesign or follow Expert Mentors to get real-time feedback on your code.";
      } else {
        aiResponse = "That's an interesting query. As your AI Mentor, I suggest exploring the Domains section to find a roadmap that matches your career goals in B.Tech.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: aiResponse, time: 'Just now' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed" style={{ bottom: '2rem', right: '2rem', zIndex: 100 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute flex flex-col nx-card shadow-2xl"
            style={{ 
              bottom: '5rem', 
              right: '0', 
              width: '380px', 
              height: '500px', 
              overflow: 'hidden',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4" style={{ background: 'var(--accent-gradient)', color: 'white' }}>
              <div className="flex items-center gap-3">
                <Sparkles size={20} />
                <h3 className="font-bold text-sm">AI Mentor</h3>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ color: 'white' }}><X size={20} /></button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 flex flex-col gap-4 p-4"
              style={{ overflowY: 'auto', backgroundColor: 'rgba(0,0,0,0.02)' }}
            >
              {messages.map((msg) => (
                <div key={msg.id} className="flex" style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div className="flex gap-2" style={{ maxWidth: '85%', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                    <div className="flex items-center justify-center rounded-full" style={{ width: '32px', height: '32px', flexShrink: 0, background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: msg.role === 'user' ? 'white' : 'var(--accent-primary)' }}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className="p-3 rounded-2xl text-sm" style={{ 
                      background: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: msg.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-secondary)' }}>
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="w-full"
                  style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '0.75rem 3rem 0.75rem 1rem', outline: 'none', color: 'var(--text-primary)' }}
                />
                <button 
                  onClick={handleSend}
                  className="absolute"
                  style={{ right: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center shadow-2xl transition-all"
        style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-gradient)', color: 'white' }}
      >
        {isOpen ? <X /> : <MessageSquare />}
      </button>
    </div>
  );
};

export default AIChatbot;
