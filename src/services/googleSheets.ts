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

/**
 * Service to handle Google Sheets API interactions.
 * Note: For a production application, you should use a backend to interact with Google Sheets
 * to protect your API key and handle OAuth. This implementation uses a public key/proxy approach
 * for prototype purposes.
 */
export const googleSheetsService = {
  /**
   * Appends a new user record to the Google Sheet.
   * Since directly appending to a sheet via the REST API from the client is restricted with just an API key
   * (requires OAuth2), in a real prototype you would use a Google Apps Script as a proxy.
   * We will implement this as a mock for now and explain the setup in the README.
   */
  async createUser(user: UserRecord): Promise<void> {
    console.log('Creating user in Google Sheets:', user);

    // In a real implementation, you would POST to a Google Apps Script URL
    const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

    if (APPS_SCRIPT_URL) {
      try {
        await axios.post(APPS_SCRIPT_URL, {
          action: 'createUser',
          data: user
        });
      } catch (error) {
        console.error('Error appending to Google Sheet via Apps Script:', error);
        throw new Error('Failed to create user record.');
      }
    } else {
      // Fallback: Store in localStorage for prototype demo if script URL isn't provided
      const users = JSON.parse(localStorage.getItem('bank_users') || '[]');
      users.push(user);
      localStorage.setItem('bank_users', JSON.stringify(users));
      console.warn('VITE_APPS_SCRIPT_URL not set. Falling back to localStorage for demo.');
    }
  },

  /**
   * Fetches user data from Google Sheets for login.
   */
  async findUser(email: string, ssn: string): Promise<UserRecord | null> {
    console.log(`Searching for user with Email: ${email} and SSN: ${ssn}`);

    const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

    if (APPS_SCRIPT_URL) {
      try {
        const response = await axios.get(`${APPS_SCRIPT_URL}?action=getUser&email=${email}&ssn=${ssn}`);
        return response.data as UserRecord;
      } catch (error) {
        console.error('Error fetching from Google Sheet via Apps Script:', error);
        return null;
      }
    } else {
      // Fallback: Check localStorage
      const users = JSON.parse(localStorage.getItem('bank_users') || '[]');
      const user = users.find((u: UserRecord) => u.email === email && u.ssn === ssn);
      return user || null;
    }
  }
};
