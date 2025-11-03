import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

interface AIChatAssistantProps {
  className?: string;
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const location = useLocation();

  // Context-aware suggestions based on current page
  const getContextualSuggestions = () => {
    const path = location.pathname;
    if (path === '/') return [
      "How do I improve my resume score?",
      "What jobs match my skills?",
      "Help me prepare for interviews"
    ];
    if (path === '/builder') return [
      "How to make my resume ATS-friendly?",
      "What keywords should I include?",
      "Help me improve my summary"
    ];
    if (path === '/jobs') return [
      "How to filter jobs effectively?",
      "What's a good match percentage?",
      "How to save interesting positions?"
    ];
    if (path === '/interview-prep') return [
      "Give me common interview questions",
      "How to practice effectively?",
      "Tips for virtual interviews"
    ];
    return [
      "How can I get started?",
      "What should I focus on first?",
      "Show me around the platform"
    ];
  };

  const getWelcomeMessage = () => {
    const path = location.pathname;
    const messages = {
      '/': "Hi! I'm your AI career assistant. I can help you improve your resume, find jobs, and prepare for interviews. What would you like to work on?",
      '/builder': "Great! You're building your resume. I can help you optimize it for ATS systems, suggest improvements, and ensure it stands out to employers.",
      '/jobs': "Perfect! Let's find your dream job. I can help you understand match percentages, filter opportunities, and craft compelling applications.",
      '/interview-prep': "Excellent! Interview preparation is key to success. I can provide practice questions, tips, and feedback to boost your confidence.",
      '/auth': "Welcome to HiredAI! Once you're signed in, I'll be here to guide you through building your perfect resume and landing your dream job."
    };
    return messages[path as keyof typeof messages] || messages['/'];
  };

  useEffect(() => {
    // Set welcome message when component mounts or route changes
    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      text: getWelcomeMessage(),
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [location.pathname]);

  const simulateAIResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const responses = [
        "That's a great question! Based on current industry trends, I'd recommend focusing on quantifiable achievements in your resume. For example, instead of saying 'improved sales,' try 'increased sales by 25% over 6 months.'",
        "I can help you with that! For ATS optimization, make sure to include relevant keywords from the job description, use standard section headings, and save your resume as both PDF and Word formats.",
        "Excellent strategy! I suggest targeting positions with 70%+ match scores initially. These give you the best chance of getting past the initial screening. Would you like me to explain how match percentages are calculated?",
        "For interview prep, I recommend the STAR method (Situation, Task, Action, Result) for behavioral questions. Practice with specific examples from your experience. Shall we work on some examples together?",
        "Great to meet you! I'm here to guide you through every step of your job search journey. Let's start by assessing where you are and what you'd like to achieve. What's your biggest career challenge right now?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI response
    simulateAIResponse(userMessage.text);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mb-4 w-96 h-96 bg-card/95 backdrop-blur-lg rounded-3xl border border-border/50 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-lavender/10 to-sage/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-lavender to-sage rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Assistant</h3>
                  <p className="text-xs text-muted-foreground">Always here to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="w-8 h-8 p-0 hover:bg-background/50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 h-64">
              <div className="space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        message.sender === 'user'
                          ? 'bg-lavender text-white'
                          : 'bg-muted/50 text-foreground'
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-muted/50 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Quick suggestions */}
            <div className="px-4 py-2 border-t border-border/50">
              <div className="flex flex-wrap gap-1 mb-2">
                {getContextualSuggestions().slice(0, 2).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs px-2 py-1 bg-muted/50 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-lavender hover:bg-lavender/90"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat toggle button */}
      <motion.button
        onClick={toggleChat}
        className="w-14 h-14 bg-gradient-to-br from-lavender to-sage rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(155, 138, 251, 0.4)",
            "0 0 0 10px rgba(155, 138, 251, 0)",
            "0 0 0 0 rgba(155, 138, 251, 0.4)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default AIChatAssistant;