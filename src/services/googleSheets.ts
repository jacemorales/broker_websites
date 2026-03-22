import axios from 'axios';

export interface UserRecord {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  ssn: string;
  taxId: string;
  idFileUrl: string;
  accountBalance: number;
  accountId: string;
  createdDate: string;
}

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwk3fh3uM4iOSNDpaM3MxUYYiptFYJNRwGvasbryxfIpVvSgZqB0GX80Iy-OaSYzv0dbg/exec';

export const googleSheetsService = {
  async createUser(user: UserRecord): Promise<void> {
    console.log('Creating user in Google Sheets:', user);

    try {
      // Use text/plain to avoid CORS preflight (OPTIONS) request which Google Apps Script doesn't support well
      await axios.post(APPS_SCRIPT_URL, JSON.stringify({
        action: 'createUser',
        data: user
      }), {
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        }
      });
    } catch (error) {
      console.error('Error appending to Google Sheet:', error);
      throw new Error('Failed to create user record. Please try again.');
    }
  },

  async findUser(email: string, ssn: string): Promise<UserRecord | null> {
    console.log(`Searching for user with Email: ${email} and SSN: ${ssn}`);

    try {
      const response = await axios.post(APPS_SCRIPT_URL, JSON.stringify({
        action: 'getUser',
        email,
        ssn
      }), {
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        }
      });

      // Google Apps Script might return null or the user object
      if (response.data === null) return null;
      if (typeof response.data !== 'object') return null;
      return response.data as UserRecord;
    } catch (error) {
      console.error('Error fetching from Google Sheet:', error);
      throw new Error('Connection Error: Could not reach the database. Please ensure your Google Apps Script is deployed as a Web App and the URL in src/services/googleSheets.ts is correct.');
    }
  }
};
