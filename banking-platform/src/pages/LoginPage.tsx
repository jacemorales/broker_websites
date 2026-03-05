import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { googleSheetsService } from '../services/googleSheets';
import { Landmark, AlertCircle, ArrowRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    ssn: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await googleSheetsService.findUser(formData.email, formData.ssn);

      if (user) {
        login(user);
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please check your email and SSN.');
      }
    } catch (err: any) {
      console.error(err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-bank-700 font-bold text-3xl mb-4">
              <Landmark className="w-10 h-10" />
              <span>NovaBank</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Log in to your account to manage your finances.</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />

              <Input
                label="Social Security Number (SSN)"
                name="ssn"
                placeholder="XXX-XX-XXXX"
                required
                value={formData.ssn}
                onChange={handleChange}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-bank-600 focus:ring-bank-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-bank-600 hover:text-bank-500">
                    Forgot SSN?
                  </a>
                </div>
              </div>

              <Button type="submit" className="w-full py-3" isLoading={loading}>
                Log In <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <div className="text-center text-sm text-gray-500 pt-4">
                Don't have an account?{' '}
                <Link to="/register" className="text-bank-600 font-semibold hover:underline">
                  Create Account
                </Link>
              </div>
            </form>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              NovaBank uses industry-standard 256-bit encryption for all data transmissions.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
