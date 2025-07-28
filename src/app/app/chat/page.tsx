
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, User, Sparkles } from 'lucide-react';
import { talkToAiAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

type Message = {
    role: 'user' | 'model';
    text: string;
};

export default function ChatPage() {
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const newMessages: Message[] = [...messages, { role: 'user', text: input }];
        setMessages(newMessages);
        const currentInput = input;
        setInput('');
        setLoading(true);

        try {
            const response = await talkToAiAction(
                newMessages.slice(0, -1).map(m => ({ role: m.role, text: m.text })),
                currentInput
            );

            if (typeof response === 'string') {
                 setMessages([...newMessages, { role: 'model', text: response }]);
            } else {
                 throw new Error(response.error || 'Failed to get a response from the AI.');
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'An error occurred',
                description: error instanceof Error ? error.message : 'Please try again later.',
            });
            // Restore user message if AI fails
            setMessages(messages);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);


    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto w-full">
            <Card className="flex-1 flex flex-col">
                <CardHeader className="text-center">
                    <CardTitle>Chat with FITMATE</CardTitle>
                    <CardDescription>Ask me anything about your fitness plan, nutrition, or general health.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                    <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                        <div className="space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground">
                                    <p>Start the conversation!</p>
                                </div>
                            )}
                            {messages.map((message, index) => (
                                <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                    {message.role === 'model' && (
                                        <div className="p-2 bg-primary rounded-full text-primary-foreground">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                    )}
                                    <div className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                    </div>
                                    {message.role === 'user' && (
                                         <div className="p-2 bg-muted rounded-full text-foreground">
                                            <User className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-primary rounded-full text-primary-foreground">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="flex items-center gap-2 pt-4">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
                            placeholder="Type your message..."
                            disabled={loading}
                        />
                        <Button onClick={handleSendMessage} disabled={loading || !input.trim()}>
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
