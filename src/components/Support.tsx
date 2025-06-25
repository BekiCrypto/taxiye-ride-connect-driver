
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Phone, MessageCircle, Mail, HelpCircle } from 'lucide-react';

const Support = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const faqs = [
    {
      question: "How do I go online to receive ride requests?",
      answer: "Toggle the Online/Offline switch on your dashboard to start receiving ride requests."
    },
    {
      question: "How are commissions calculated?",
      answer: "Commissions are automatically deducted from each trip fare and shown in your trip summary."
    },
    {
      question: "How can I top up my wallet?",
      answer: "You can top up your wallet using Telebirr, bank transfer, or credit card through the Wallet section."
    },
    {
      question: "What should I do if I have an emergency during a trip?",
      answer: "Use the SOS button available during active trips to alert emergency services and our support team."
    }
  ];

  const supportTickets = [
    { id: '001', subject: 'Payment Issue', status: 'Open', date: '2024-01-15' },
    { id: '002', subject: 'App Bug Report', status: 'Resolved', date: '2024-01-10' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Support request submitted:', { subject, message });
    setSubject('');
    setMessage('');
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      <h1 className="text-2xl font-bold text-white">Help & Support</h1>

      <div className="grid grid-cols-3 gap-4">
        <Button className="h-16 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center">
          <Phone className="h-6 w-6 mb-1" />
          <span className="text-xs">Call</span>
        </Button>
        <Button className="h-16 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center">
          <MessageCircle className="h-6 w-6 mb-1" />
          <span className="text-xs">Chat</span>
        </Button>
        <Button className="h-16 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center">
          <Mail className="h-6 w-6 mb-1" />
          <span className="text-xs">Email</span>
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Submit a Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <textarea
              placeholder="Describe your issue..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 p-3 bg-gray-700 border border-gray-600 rounded-md text-white resize-none"
            />
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">My Support Tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {supportTickets.map((ticket) => (
            <div key={ticket.id} className="p-3 bg-gray-700 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-white font-medium">#{ticket.id} - {ticket.subject}</div>
                  <div className="text-gray-400 text-sm">{ticket.date}</div>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  ticket.status === 'Open' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-green-600 text-white'
                }`}>
                  {ticket.status}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-gray-600">
                <AccordionTrigger className="text-white hover:text-green-400">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
