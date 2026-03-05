import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { supabase } from '../lib/supabase';
import { googleSheetsService } from '../services/googleSheets';
import type { UserRecord } from '../services/googleSheets';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    email: '',
    phone: '',
    ssn: '',
    taxId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!file) {
        throw new Error('Please upload your Government ID.');
      }

      // Check for existing account
      const existingUser = await googleSheetsService.findUser(formData.email, formData.ssn);
      if (existingUser) {
        throw new Error('An account with this email or SSN already exists.');
      }

      // 1. Upload ID to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `ids/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('banking-ids')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('banking-ids')
        .getPublicUrl(filePath);

      // 3. Prepare User Record
      const newUser: UserRecord = {
        ...formData,
        idFileUrl: publicUrl,
        accountBalance: 0,
        accountId: `NB-${Math.floor(10000000 + Math.random() * 90000000)}`,
        createdDate: new Date().toISOString(),
      };

      // 4. Save to Google Sheets
      await googleSheetsService.createUser(newUser);

      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
            <p className="text-gray-600 mb-8">
              Your application has been received and your account is now active. Redirecting you to login...
            </p>
            <Button className="w-full" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900">Create Your NovaBank Account</h1>
            <p className="text-gray-600 mt-2">Join thousands of people saving and investing with NovaBank.</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="fullName"
                  placeholder="John Doe"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                />
                <Input
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  required
                  value={formData.dob}
                  onChange={handleChange}
                />
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
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  required
                  value={formData.phone}
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
                <Input
                  label="Tax ID / EIN"
                  name="taxId"
                  placeholder="12-3456789"
                  required
                  value={formData.taxId}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Government Issued ID</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-bank-500 transition-colors">
                  <input
                    type="file"
                    id="id-upload"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="id-upload" className="cursor-pointer flex flex-col items-center gap-3">
                    <div className="bg-bank-50 p-3 rounded-full">
                      <Upload className="w-6 h-6 text-bank-600" />
                    </div>
                    <div>
                      <span className="text-bank-600 font-semibold">Click to upload</span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </div>
                    <p className="text-xs text-gray-400">PNG, JPG or PDF (max. 10MB)</p>
                  </label>
                  {file && (
                    <p className="mt-4 text-sm font-medium text-bank-700 flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" /> {file.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full py-3" isLoading={loading}>
                  Create My Account
                </Button>
              </div>

              <p className="text-center text-sm text-gray-500 pt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-bank-600 font-semibold hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </Card>

          <p className="mt-8 text-xs text-gray-400 text-center leading-relaxed">
            By clicking "Create My Account", you agree to NovaBank's Terms of Service and Privacy Policy. Your information is protected by industry-standard encryption. NovaBank is a financial technology company, not a bank. Banking services provided by NovaBank's partner banks, Members FDIC.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
