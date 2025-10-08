"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Message {
  id: number;
  sender: 'user' | 'designer';
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for chat conversations
  const conversations = [
    { 
      id: 1, 
      projectName: 'Logo Redesign', 
      designer: 'Sarah Johnson',
      lastMessage: 'I&apos;ve uploaded the latest concepts',
      timestamp: '2h ago',
      unread: 3,
      avatar: '👩‍🎨'
    },
    { 
      id: 2, 
      projectName: 'Brand Guidelines', 
      designer: 'Mike Chen',
      lastMessage: 'Great! I&apos;ll revise the color palette',
      timestamp: '1d ago',
      unread: 0,
      avatar: '👨‍💼'
    },
    { 
      id: 3, 
      projectName: 'Social Media Kit', 
      designer: 'Sarah Johnson',
      lastMessage: 'Project completed!',
      timestamp: '3d ago',
      unread: 0,
      avatar: '👩‍🎨'
    },
  ];

  // Mock messages for selected conversation
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'designer',
      senderName: 'Sarah Johnson',
      content: 'Hi! I&apos;ve reviewed your project brief for the logo redesign. I have a few questions to get started.',
      timestamp: '10:30 AM',
      isRead: true
    },
    {
      id: 2,
      sender: 'user',
      senderName: 'You',
      content: 'Sure! I&apos;m happy to provide more details.',
      timestamp: '10:32 AM',
      isRead: true
    },
    {
      id: 3,
      sender: 'designer',
      senderName: 'Sarah Johnson',
      content: 'What&apos;s the primary emotion you want the logo to convey? Modern and professional, or more playful and creative?',
      timestamp: '10:33 AM',
      isRead: true
    },
    {
      id: 4,
      sender: 'user',
      senderName: 'You',
      content: 'I&apos;d like it to be modern and professional, but still approachable. We&apos;re a tech startup targeting small businesses.',
      timestamp: '10:35 AM',
      isRead: true
    },
    {
      id: 5,
      sender: 'designer',
      senderName: 'Sarah Johnson',
      content: 'Perfect! I&apos;ll start working on some concepts. I should have initial designs ready for you by tomorrow afternoon.',
      timestamp: '10:37 AM',
      isRead: true
    },
    {
      id: 6,
      sender: 'designer',
      senderName: 'Sarah Johnson',
      content: 'I&apos;ve uploaded the latest concepts to your project folder. Let me know what you think!',
      timestamp: '2:15 PM',
      isRead: false
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'user',
        senderName: 'You',
        content: message,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        isRead: true
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container">
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back to Dashboard Button */}
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Chat with Designers</h1>
            <p className="text-gray-600">Real-time communication with your creative team</p>
          </motion.div>

          {/* Chat Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
            style={{ height: '600px' }}
          >
            <div className="flex h-full">
              {/* Conversations Sidebar */}
              <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-bold text-gray-900">Conversations</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedChat(conv.id)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                        selectedChat === conv.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{conv.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate text-sm">{conv.projectName}</h3>
                            {conv.unread > 0 && (
                              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                                {conv.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{conv.designer}</p>
                          <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                          <p className="text-xs text-gray-400 mt-1">{conv.timestamp}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{selectedConversation?.avatar}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{selectedConversation?.projectName}</h3>
                      <p className="text-sm text-gray-600">{selectedConversation?.designer}</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-gray-600">{msg.senderName}</span>
                          <span className="text-xs text-gray-400">{msg.timestamp}</span>
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            msg.sender === 'user'
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        {!msg.isRead && msg.sender === 'designer' && (
                          <span className="text-xs text-red-500 font-semibold mt-1 inline-block">New</span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!message.trim()}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                    >
                      Send
                    </button>
                  </form>
                  <div className="flex items-center gap-4 mt-3">
                    <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                      <span>📎</span>
                      <span>Attach File</span>
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                      <span>😊</span>
                      <span>Emoji</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4"
          >
            <div className="flex gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Quick Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your designer typically responds within 2-4 hours during business hours</li>
                  <li>• Feel free to share reference images, feedback, or ask questions anytime</li>
                  <li>• All file uploads and project assets are automatically saved</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}


