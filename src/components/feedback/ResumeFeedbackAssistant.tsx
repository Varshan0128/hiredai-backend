
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, ChevronDown, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { ResumeData } from '@/pages/Builder';
import { supabase } from "@/integrations/supabase/client";

interface FeedbackMessage {
  id: string;
  content: string;
  sender: 'assistant' | 'user';
  timestamp: Date;
}

interface ResumeFeedbackAssistantProps {
  resumeData: ResumeData;
  onSuggestionApply?: (field: string, value: string) => void;
}

const ResumeFeedbackAssistant: React.FC<ResumeFeedbackAssistantProps> = ({ 
  resumeData, 
  onSuggestionApply 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<FeedbackMessage[]>([
    {
      id: '1',
      content: `Hello! I'm your Resume Assistant. I can help you improve your resume and give you feedback. Try asking me something like:
      
• "How can I improve my skills section?"
• "Suggest a better summary for my profile"
• "Review my work experience descriptions"
• "What keywords should I add for my target role?"`,
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);
  
  // Focus the input field when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);
  
  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };
  
  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };
  
  const maximizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(false);
  };
  
  const closeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };
  
  const handleMessageSend = async () => {
    if (!message.trim() || isLoading) return;
    
    // Add user message
    const userMessage: FeedbackMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('resume-feedback', {
        body: { 
          resumeData: sanitizeResumeData(resumeData),
          userQuery: message
        }
      });
      
      if (error) throw error;
      
      // Add AI response
      const aiResponse: FeedbackMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Sorry, I couldn't analyze your resume at the moment. Please try again later.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      
      // Add error message
      const errorMessage: FeedbackMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error while processing your request. Please try again later.",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error("Couldn't get AI feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Sanitize resume data to ensure it can be safely serialized
  const sanitizeResumeData = (data: ResumeData): Partial<ResumeData> => {
    const sanitized = { ...data };
    
    // Remove any File objects as they can't be serialized
    if (sanitized.portfolioFiles) {
      delete sanitized.portfolioFiles;
    }
    
    return sanitized;
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleMessageSend();
    }
  };
  
  // Animation variants
  const chatContainerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };
  
  const floatingButtonVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };
  
  const minimizedStyles = isMinimized ? 
    "h-14 w-64 rounded-full cursor-pointer" : 
    "w-80 sm:w-96 h-[500px] max-h-[80vh] rounded-xl";
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <motion.div
          variants={floatingButtonVariants}
          initial="initial"
          animate="animate"
        >
          <Button 
            onClick={toggleChat}
            className="h-14 w-14 rounded-full bg-primary shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300"
          >
            <MessageSquare className="h-6 w-6 text-white" />
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key="chat-container"
            variants={chatContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl ${minimizedStyles} flex flex-col overflow-hidden transition-all duration-300 ease-in-out`}
          >
            {/* Chat Header */}
            <div 
              className="bg-primary text-white p-3 flex justify-between items-center cursor-pointer"
              onClick={isMinimized ? maximizeChat : undefined}
            >
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <h3 className="font-medium">AI Resume Assistant</h3>
              </div>
              
              <div className="flex items-center gap-1">
                {isMinimized ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 hover:bg-primary-foreground/10"
                    onClick={maximizeChat}
                  >
                    <Maximize2 className="h-4 w-4 text-white" />
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 hover:bg-primary-foreground/10"
                      onClick={minimizeChat}
                    >
                      <Minimize2 className="h-4 w-4 text-white" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 hover:bg-primary-foreground/10"
                      onClick={closeChat}
                    >
                      <X className="h-4 w-4 text-white" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {!isMinimized && (
              <>
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                            ${msg.sender === 'assistant' ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-800'}`}
                          >
                            {msg.sender === 'assistant' ? (
                              <Bot className="h-4 w-4" />
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                          </div>
                          
                          <div 
                            className={`p-3 rounded-xl ${
                              msg.sender === 'assistant' 
                                ? 'bg-muted/30 dark:bg-gray-800' 
                                : 'bg-primary text-white'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-line">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start gap-2 max-w-[85%]">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4" />
                          </div>
                          
                          <div className="p-3 rounded-xl bg-muted/30 dark:bg-gray-800">
                            <div className="flex space-x-2 items-center h-6">
                              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '600ms' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                {/* Input Area */}
                <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Ask for resume feedback..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={handleMessageSend} 
                      size="icon"
                      variant="default"
                      disabled={isLoading || !message.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ResumeFeedbackAssistant;
