import React from 'react';
import { Landmark, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 text-white font-bold text-2xl mb-6">
            <Landmark className="w-8 h-8 text-bank-400" />
            <span>NovaBank</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Leading the way in digital banking solutions for the next generation of finance. Secure, fast, and reliable.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-bank-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-bank-400 transition-colors">Services</a></li>
            <li><a href="#" className="hover:text-bank-400 transition-colors">Security</a></li>
            <li><a href="#" className="hover:text-bank-400 transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Support</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-bank-400 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-bank-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-bank-400 transition-colors">Fraud Protection</a></li>
            <li><a href="#" className="hover:text-bank-400 transition-colors">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-bank-400 shrink-0" />
              <span>123 Finance Plaza, Suite 400<br />New York, NY 10001</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-bank-400 shrink-0" />
              <span>+1 (800) NOVABANK</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-bank-400 shrink-0" />
              <span>support@novabank.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <p>© 2025 NovaBank International. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
