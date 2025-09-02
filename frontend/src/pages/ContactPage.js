import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Create mailto link with form data
    const subject = encodeURIComponent(`[${formData.type.toUpperCase()}] ${formData.subject || 'Contact from EventFlow'}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Type: ${formData.type}\n\n` +
      `Message:\n${formData.message}`
    );
    const mailtoLink = `mailto:mileekakadiyaworks@gmail.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success state
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after delay
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
      setSubmitted(false);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
          <p className="text-neutral-400">
            Your email client has been opened. Please send the email to complete your message.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-950 to-emerald-950/20">
        <div className="absolute inset-0 opacity-30"
             style={{
               backgroundImage: `radial-gradient(circle at 20% 50%, rgba(5, 150, 105, 0.1) 0%, transparent 50%), 
                                radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)`
             }}>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Get in
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"> Touch</span>
            </h1>
            <p className="mt-4 text-xl text-neutral-300 max-w-3xl mx-auto">
              Have questions about EventFlow? Need help with your events? We're here to assist you.
              Reach out to us and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="border-neutral-800 bg-neutral-900">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Mail className="h-6 w-6 text-emerald-400" />
                    <h3 className="text-lg font-semibold">Email Us</h3>
                  </div>
                  <p className="text-neutral-400 mb-2">
                    Send us an email and we'll respond within 24 hours.
                  </p>
                  <a 
                    href="mailto:mileekakadiyaworks@gmail.com"
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    mileekakadiyaworks@gmail.com
                  </a>
                </CardContent>
              </Card>

              <Card className="border-neutral-800 bg-neutral-900">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Phone className="h-6 w-6 text-emerald-400" />
                    <h3 className="text-lg font-semibold">Call Us</h3>
                  </div>
                  <p className="text-neutral-400 mb-2">
                    Available Monday to Friday, 9 AM to 6 PM.
                  </p>
                  <span className="text-emerald-400">+1 (555) 123-4567</span>
                </CardContent>
              </Card>

              <Card className="border-neutral-800 bg-neutral-900">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="h-6 w-6 text-emerald-400" />
                    <h3 className="text-lg font-semibold">Response Time</h3>
                  </div>
                  <p className="text-neutral-400">
                    We typically respond to all inquiries within 24 hours during business days.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-neutral-800 bg-neutral-900">
                <div className="border-b border-neutral-800 p-6">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <MessageCircle className="h-6 w-6 text-emerald-400" />
                    Send us a Message
                  </h2>
                  <p className="text-neutral-400 mt-2">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>
                
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-neutral-200 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-neutral-200 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-neutral-200 mb-2">
                          Inquiry Type
                        </label>
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="billing">Billing Question</option>
                          <option value="feature">Feature Request</option>
                          <option value="bug">Bug Report</option>
                          <option value="partnership">Partnership</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-neutral-200 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                          placeholder="Brief subject line"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-neutral-200 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                        placeholder="Please describe your inquiry in detail..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <Send className="h-5 w-5" />
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
