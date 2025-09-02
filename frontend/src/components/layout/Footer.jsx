import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ExternalLink } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!email || !message) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    // Create mailto link
    const subject = encodeURIComponent('Contact from EventFlow Website');
    const body = encodeURIComponent(`From: ${email}\n\nMessage:\n${message}`);
    const mailtoLink = `mailto:mileekakadiyaworks@gmail.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Reset form
    setEmail('');
    setMessage('');
    setIsSubmitting(false);
    alert('Email client opened. Please send the email to complete your message.');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-emerald-400">EventFlow</h3>
            <p className="text-neutral-400 text-sm">
              Streamline your event planning process with our intelligent platform. 
              Create, track, and manage all your events in one powerful system.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-emerald-400 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-emerald-400 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-neutral-100">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/profile" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">
                  Profile
                </a>
              </li>
              <li>
                <a href="#contact" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-neutral-100">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#contact" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#contact" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#contact" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="space-y-4" id="contact">
            <h4 className="text-lg font-semibold text-neutral-100">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-neutral-400">
                <Mail className="h-4 w-4" />
                <span>mileekakadiyaworks@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-neutral-400">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-neutral-400">
                <MapPin className="h-4 w-4" />
                <span>Remote Office</span>
              </div>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-emerald-500 text-sm"
                required
              />
              <textarea
                placeholder="Your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-emerald-500 text-sm resize-none"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">
            © {currentYear} EventFlow. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#contact" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#contact" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#contact" className="text-neutral-400 hover:text-emerald-400 transition-colors text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
