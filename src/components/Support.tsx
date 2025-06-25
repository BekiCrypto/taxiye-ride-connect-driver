
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, MessageCircle, Clock, CheckCircle } from 'lucide-react';

const Support = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const supportRequests = [
    {
      id: 1,
      subject: 'Payment not received',
      status: 'Resolved',
      date: '2024-01-14',
      response: 'Payment has been processed and added to your wallet.'
    },
    {
      id: 2,
      subject: 'App crashes during trip',
      status: 'In Progress',
      date: '2024-01-13',
      response: 'Our technical team is investigating this issue.'
    }
  ];

  const handleSubmitTicket = () => {
    console.log('Support ticket submitted:', { subject, message });
    setSubject('');
    setMessage('');
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      <h1 className="text-2xl font-bold text-white">Help & Support</h1>

      {/* Emergency Contact */}
      <Card className="bg-red-800 border-red-600">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Phone className="h-6 w-6 text-white" />
            <div>
              <h3 className="text-white font-semibold">Emergency Hotline</h3>
              <p className="text-red-100 text-sm">Available 24/7</p>
            </div>
          </div>
          <Button className="w-full mt-3 bg-white text-red-800 hover:bg-gray-100">
            Call Emergency: +251-911-000-000
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="new" className="text-white">New Request</TabsTrigger>
          <TabsTrigger value="history" className="text-white">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Submit Support Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <Input
                  placeholder="Brief description of your issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <Textarea
                  placeholder="Please describe your issue in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white min-h-[120px]"
                />
              </div>

              <Button 
                onClick={handleSubmitTicket}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!subject || !message}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button className="h-16 bg-blue-600 hover:bg-blue-700 flex flex-col items-center justify-center">
              <Phone className="h-6 w-6 mb-1" />
              Call Support
            </Button>
            <Button className="h-16 bg-purple-600 hover:bg-purple-700 flex flex-col items-center justify-center">
              <MessageCircle className="h-6 w-6 mb-1" />
              Live Chat
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {supportRequests.map((request) => (
            <Card key={request.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium">{request.subject}</h3>
                    <p className="text-sm text-gray-400 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {request.date}
                    </p>
                  </div>
                  <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
                    request.status === 'Resolved' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-orange-600 text-white'
                  }`}>
                    {request.status === 'Resolved' ? 
                      <CheckCircle className="h-3 w-3 mr-1" /> : 
                      <Clock className="h-3 w-3 mr-1" />
                    }
                    {request.status}
                  </div>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <p className="text-gray-300 text-sm">{request.response}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* FAQ Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            'How do I update my vehicle information?',
            'Why was my trip fare adjusted?',
            'How do I top up my wallet?',
            'What should I do if the app crashes?'
          ].map((faq, index) => (
            <Button 
              key={index}
              variant="ghost" 
              className="w-full text-left justify-start text-gray-300 hover:text-white hover:bg-gray-700"
            >
              {faq}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
