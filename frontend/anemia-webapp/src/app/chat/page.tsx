"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { MessageCircle, Send, ArrowRight } from 'lucide-react';
import AnemiaTester from '../../components/AnemiaTester';

const AnemiaChatbot = () => {
    const [started, setStarted] = useState(false);
    const [messages, setMessages] = useState([{
        type: 'bot',
        content: "Hello! I'm your Anemia Detection Assistant. I can help assess your risk of anemia based on your symptoms and basic information. Would you like to start a quick assessment?",
    }]);
    const [userInput, setUserInput] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        gender: '',
        age: '',
        bloodGroup: '',
        symptoms: []
    });

    // Reference for message container
    const messagesEndRef = useRef(null);

    // Scroll to bottom whenever messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Handle enter key for text/number inputs
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && userInput.trim() && (steps[currentStep].type === 'text' || steps[currentStep].type === 'number')) {
            handleUserInput(userInput);
        }
    };

    // Type validation function
    const validateInput = (input, type) => {
        switch (type) {
            case 'number':
                return !isNaN(input) && input > 0 && input < 150;
            case 'text':
                return input.trim().length > 0;
            default:
                return true;
        }
    };

    const steps = [
        {
            question: "First, could you tell me your name?",
            type: "text",
        },
        {
            question: "Hi {name}! What's your gender?",
            type: "radio",
            options: ["Male", "Female", "Other"]
        },
        {
            question: "And what's your age?",
            type: "number",
        },
        {
            question: "What's your blood group?",
            type: "radio",
            options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', "Don't know"]
        },
        {
            question: "Are you experiencing any of these common symptoms of anemia?",
            type: "checkbox",
            options: [
                { id: 'fatigue', label: 'Fatigue and weakness' },
                { id: 'pale-skin', label: 'Pale or yellowish skin' },
                { id: 'shortness-breath', label: 'Shortness of breath' },
                { id: 'dizziness', label: 'Dizziness' },
                { id: 'chest-pain', label: 'Chest pain' },
                { id: 'cold-hands', label: 'Cold hands and feet' },
                { id: 'headache', label: 'Headaches' },
            ]
        }
    ];

    const addMessage = (content, type = 'bot') => {
        setMessages(prev => [...prev, { type, content }]);
    };

    const handleStart = () => {
        setStarted(true);
        setCurrentStep(0);
        addMessage(steps[0].question);
    };

    const handleUserInput = async (input) => {
        // Validate input based on type
        const currentStepType = steps[currentStep].type;
        if (!validateInput(input, currentStepType)) {
            addMessage("Please provide a valid input.", 'bot');
            return;
        }

        // Add user's message to chat
        addMessage(input, 'user');
        setUserInput('');

        // Update userData based on current step
        const updatedData = { ...userData };
        switch (currentStep) {
            case 0:
                updatedData.name = input;
                break;
            case 1:
                updatedData.gender = input;
                break;
            case 2:
                updatedData.age = input;
                break;
            case 3:
                updatedData.bloodGroup = input;
                break;
            case 4:
                updatedData.symptoms = input;
                break;
        }
        setUserData(updatedData);

        // Move to next step
        if (currentStep < steps.length - 1) {
            const nextQuestion = steps[currentStep + 1].question.replace('{name}', updatedData.name);
            setTimeout(() => {
                addMessage(nextQuestion);
                setCurrentStep(prev => prev + 1);
            }, 500);
        } else {
            // Final submission
            addMessage("Thank you for providing all the information. Let me analyze your responses...");
            try {
                // Simulate API call
                setTimeout(() => {
                    addMessage("Based on your symptoms and information provided, I recommend consulting with a healthcare provider for a proper anemia screening.");
                    setTimeout(() => {
                        setShowResults(true);
                    }, 1000);
                }, 2000);
            } catch (error) {
                addMessage("I apologize, but I encountered an error processing your information. Would you like to try again?");
            }
        }
    };

    const renderInput = () => {
        const step = steps[currentStep];
        if (!step) return null;

        switch (step.type) {
            case 'text':
            case 'number':
                return (
                    <div className="flex gap-2">
                        <Input
                            type={step.type}
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your answer..."
                            className="flex-1"
                        />
                        <Button
                            onClick={() => handleUserInput(userInput)}
                            disabled={!userInput}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                );

            case 'radio':
                return (
                    <RadioGroup
                        className="space-y-2"
                        value={userInput}
                        onValueChange={setUserInput}
                    >
                        {step.options.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={option} />
                                <Label htmlFor={option}>{option}</Label>
                            </div>
                        ))}
                        <Button
                            onClick={() => handleUserInput(userInput)}
                            disabled={!userInput}
                            className="mt-2"
                        >
                            Send <Send className="w-4 h-4 ml-2" />
                        </Button>
                    </RadioGroup>
                );

            case 'checkbox':
                return (
                    <div className="space-y-2">
                        {step.options.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={option.id}
                                    checked={userInput.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                        setUserInput(prev => {
                                            if (Array.isArray(prev)) {
                                                return checked
                                                    ? [...prev, option.id]
                                                    : prev.filter(id => id !== option.id);
                                            }
                                            return [option.id];
                                        });
                                    }}
                                />
                                <Label htmlFor={option.id}>{option.label}</Label>
                            </div>
                        ))}
                        <Button
                            onClick={() => handleUserInput(userInput || [])}
                            className="mt-2"
                        >
                            Send <Send className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                );

            default:
                return null;
        }
    };

    // If showResults is true, you can render your results component
    if (showResults) {
        return (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
                {/* <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <Card className="w-[500px]">
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Assessment Results</h2>
                            <div className="space-y-4">
                                <p><strong>Name:</strong> {userData.name}</p>
                                <p><strong>Age:</strong> {userData.age}</p>
                                <p><strong>Gender:</strong> {userData.gender}</p>
                                <p><strong>Blood Group:</strong> {userData.bloodGroup}</p>
                                <p><strong>Symptoms:</strong> {Array.isArray(userData.symptoms) ? userData.symptoms.join(', ') : 'None reported'}</p>
                                <Button
                                    onClick={() => {
                                        setShowResults(false);
                                        setStarted(false);
                                        setCurrentStep(0);
                                        setMessages([{
                                            type: 'bot',
                                            content: "Hello! I'm your Anemia Detection Assistant. Would you like to start another assessment?",
                                        }]);
                                    }}
                                    className="w-full"
                                >
                                    Start New Assessment
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div> */}

                <AnemiaTester />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            {/* Introduction Section */}
            <div className="text-center space-y-4 mb-8">
                <img
                    src="/api/placeholder/800/400"
                    alt="Healthcare illustration"
                    className="rounded-lg mx-auto"
                />
                <h1 className="text-3xl font-bold text-primary">Anemia Detection Assistant</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Anemia affects millions of people worldwide. This assistant helps you understand
                    your risk factors and symptoms. Remember, this is not a diagnosis - always
                    consult with healthcare professionals for medical advice.
                </p>
            </div>

            {/* Chat Interface */}
            <Card className="w-full">
                <CardContent className="p-6 space-y-4">
                    {/* Messages Container */}
                    <div className="space-y-4 h-96 overflow-y-auto mb-4">
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
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Section */}
                    {!started ? (
                        <Button onClick={handleStart} className="w-full">
                            Start Assessment <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        renderInput()
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AnemiaChatbot;