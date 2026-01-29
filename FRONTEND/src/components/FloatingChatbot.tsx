import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Sparkles
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendChatQuery } from "@/lib/ocr-service";
import type { ChatMessage, Prescription } from "@/types/prescription";

interface FloatingChatbotProps {
  prescription: Prescription;
  selectedMedicine: string | null;
}

const QUICK_PROMPTS = [
  "When to take each medicine?",
  "What does 1-0-1 mean?",
  "Morning medicines?"
];

const FloatingChatbot = ({ prescription, selectedMedicine }: FloatingChatbotProps) => {
  const [isOpen, setIsOpen] = useState(true); // Start open
  const [isClosing, setIsClosing] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I can help you understand your prescription. Ask me anything!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasAutoClosedRef = useRef(false);

  // Auto-close after 5 seconds on first mount
  useEffect(() => {
    if (!hasAutoClosedRef.current && isOpen) {
      const timer = setTimeout(() => {
        hasAutoClosedRef.current = true;
        setIsClosing(true);
        
        // After closing animation, hide and show pulse effect on button
        setTimeout(() => {
          setIsOpen(false);
          setIsClosing(false);
          setShowPulse(true);
          
          // Remove pulse after a few seconds
          setTimeout(() => setShowPulse(false), 3000);
        }, 600);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessageText = input;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userMessageText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    
    try {
      const result = await sendChatQuery(userMessageText, prescription, chatHistory);
      
      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: result.response,
        timestamp: new Date()
      }]);
      
      setChatHistory(result.history);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I encountered an error processing your request.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, y: 20 }}
            animate={{ 
              scale: 1, 
              y: 0,
              boxShadow: showPulse 
                ? ["0 0 0 0 hsl(var(--primary) / 0.4)", "0 0 0 20px hsl(var(--primary) / 0)", "0 0 0 0 hsl(var(--primary) / 0.4)"]
                : "0 4px 20px rgba(0,0,0,0.2)"
            }}
            exit={{ scale: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 15,
              boxShadow: { duration: 1.5, repeat: showPulse ? Infinity : 0 }
            }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-6 h-6" />
            {showPulse && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center"
              >
                <span className="text-[10px] text-destructive-foreground font-bold">!</span>
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={isClosing 
              ? { 
                  opacity: 0, 
                  y: 150, 
                  scale: 0.8,
                  rotate: [0, -2, 2, -1, 0],
                }
              : { opacity: 1, y: 0, scale: 1 }
            }
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={isClosing 
              ? { duration: 0.5, ease: "easeIn", rotate: { duration: 0.3 } }
              : { type: "spring", stiffness: 300, damping: 25 }
            }
            className="fixed bottom-6 right-6 w-[360px] h-[480px] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-border"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-primary text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Prescription Assistant</h3>
                  <p className="text-xs opacity-80">Ask me anything!</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 border-b border-border flex gap-2 overflow-x-auto">
              {QUICK_PROMPTS.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap text-xs h-7 px-2"
                  onClick={() => setInput(prompt)}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {prompt}
                </Button>
              ))}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`
                      w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                      ${message.role === "user" ? "bg-primary" : "bg-accent"}
                    `}>
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-accent-foreground" />
                      )}
                    </div>
                    
                    <div className={`
                      max-w-[75%] rounded-2xl px-3 py-2 text-sm
                      ${message.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-tr-sm" 
                        : "bg-accent text-accent-foreground rounded-tl-sm"
                      }
                    `}>
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p>{message.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                      <Bot className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <div className="bg-accent rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.1s]" />
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  disabled={isLoading}
                  className="flex-1 h-9 text-sm"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="h-9 w-9"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatbot;
