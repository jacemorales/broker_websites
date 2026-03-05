import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import Button from '../components/ui/Button';
import { Shield, Smartphone, Zap, Globe, ArrowRight, CheckCircle } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <Shield className="w-10 h-10 text-bank-600" />,
      title: "Secure by Design",
      description: "Advanced encryption and multi-factor authentication keep your data and money safe."
    },
    {
      icon: <Smartphone className="w-10 h-10 text-bank-600" />,
      title: "Mobile First",
      description: "Manage your finances on the go with our top-rated mobile banking experience."
    },
    {
      icon: <Zap className="w-10 h-10 text-bank-600" />,
      title: "Instant Transfers",
      description: "Send and receive money instantly with zero hidden fees across our network."
    },
    {
      icon: <Globe className="w-10 h-10 text-bank-600" />,
      title: "Global Access",
      description: "Use your NovaBank account anywhere in the world with competitive exchange rates."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Banking for the <span className="text-bank-600">Digital Age</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
              Experience the future of personal finance. NovaBank provides a seamless, secure, and intuitive way to manage your money.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="px-8" onClick={() => navigate('/register')}>
                Open Your Account <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-8" onClick={() => navigate('/login')}>
                Welcome Back
              </Button>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> No hidden fees
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" /> FDIC Insured
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 bg-bank-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <img
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800"
              alt="Digital Banking App"
              className="relative rounded-2xl shadow-2xl border border-gray-100"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Designed for Modern Life</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We've re-imagined every part of the banking experience to be faster, more transparent, and easier to use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-bank-900 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 lg:p-20 space-y-8">
              <h2 className="text-4xl font-bold text-white">Your security is our top priority.</h2>
              <p className="text-bank-100 text-lg leading-relaxed">
                We use bank-grade security and state-of-the-art encryption to ensure your data and assets are protected 24/7. Your peace of mind is what matters most.
              </p>
              <ul className="space-y-4">
                {[
                  "Biometric login integration",
                  "Real-time fraud monitoring",
                  "Instant card freezing via app",
                  "End-to-end data encryption"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white font-medium">
                    <CheckCircle className="w-6 h-6 text-bank-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="secondary" size="lg" onClick={() => navigate('/register')}>
                Get Started Securely
              </Button>
            </div>
            <div className="relative h-64 lg:h-auto overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
                alt="Cyber Security"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-gray-900">Ready to join the revolution?</h2>
          <p className="text-xl text-gray-600">
            Join over 2 million customers who trust NovaBank for their daily banking needs. Opening an account takes less than 5 minutes.
          </p>
          <Button size="lg" className="px-12 py-6 text-xl" onClick={() => navigate('/register')}>
            Open Account Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
