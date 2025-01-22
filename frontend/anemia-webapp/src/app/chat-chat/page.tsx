
'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { MessageCircle, Send, Bot } from 'lucide-react';

const LLMChat = () => {
    const [messages, setMessages] = useState([{
        type: 'bot',
        content: "Hello! I'm here to help answer your questions about anemia. What would you like to know?"
    }]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef<HTMLInputElement>(null);


    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input on mount and after each message
    useEffect(() => {
        inputRef.current?.focus();
    }, [messages, isLoading]);

    // Handle sending message to LLM API
    const sendMessage = async () => {
        if (!userInput.trim()) return;

        const userMessage = userInput.trim();
        setUserInput('');
        setIsLoading(true);

        // Add user message to chat
        setMessages(prev => [...prev, {
            type: 'user',
            content: userMessage
        }]);

        try {
            const response = await fetch('http://localhost:5000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: userMessage,
                    // You can add additional context or history if needed
                    history: messages.map(msg => ({
                        role: msg.type === 'user' ? 'user' : 'assistant',
                        content: msg.content
                    }))
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            // Add bot response to chat
            setMessages(prev => [...prev, {
                type: 'bot',
                content: data.answer
            }]);
        } catch (error) {
            // Add error message to chat
            setMessages(prev => [...prev, {
                type: 'bot',
                content: "I apologize, but I'm having trouble connecting to the server. Please try again later."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Card className="w-full">
                <CardContent className="p-6">
                    {/* Chat Header */}
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                        <Bot className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-semibold">Anemia Assistant</h2>
                    </div>

                    {/* Messages Container */}
                    <div className="space-y-4 h-[600px] overflow-y-auto mb-4 px-2">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${message.type === 'user'
                                        ? 'bg-primary text-primary-foreground ml-auto'
                                        : 'bg-muted'
                                        }`}
                                >
                                    {message.type === 'bot' && (
                                        <MessageCircle className="w-4 h-4 mb-1" />
                                    )}
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4" />
                                        <div className="flex gap-1">
                                            <span className="animate-bounce">.</span>
                                            <span className="animate-bounce delay-100">.</span>
                                            <span className="animate-bounce delay-200">.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="flex gap-2">
                        <Input
                            ref={inputRef}
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your question..."
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={!userInput.trim() || isLoading}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LLMChat;