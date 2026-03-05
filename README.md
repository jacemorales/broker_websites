# NovaBank - Modern Online Banking Platform

NovaBank is a professional fintech prototype featuring a fully functional frontend, secure file storage via Supabase, and a lightweight database solution using Google Sheets.

## Features

- **Modern Landing Page**: High-converting fintech design with mobile responsiveness.
- **Secure Registration**: Form for account creation with Government ID upload.
- **ID Verification**: File uploads powered by Supabase Storage.
- **Cloud Database**: User records stored and managed in Google Sheets.
- **Auth System**: Login via Email and SSN with session persistence.
- **User Dashboard**: Real-time account overview, balance display ($0), and intuitive UI.

---

## 🚀 Setup Instructions

### 1. Supabase Setup (File Storage)

1. Create a [Supabase](https://supabase.com/) account and a new project.
2. Navigate to **Storage** and create a new bucket named `banking-ids`.
3. Set the bucket to **Public** (or configure appropriate RLS policies for public access to public URLs).
4. Go to **Project Settings** > **API** to get your:
   - `Project URL`
   - `anon public API Key`

### 2. Google Sheets Setup (Database)

1. Open the [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1PlLTM9X0G1_4sMN8e2mXzowq1NnCHk).
2. Ensure you have the following column headers in the first row (Sheet1):
   - `Full Name`, `Date of Birth`, `Email`, `Phone Number`, `SSN`, `Tax ID`, `Supabase ID File URL`, `Account Balance`, `Account ID`, `Created Date`

#### Google Apps Script Proxy (Recommended for Prototype)
To allow the frontend to write to the spreadsheet without OAuth, use a Google Apps Script:
1. In your spreadsheet, go to **Extensions** > **Apps Script**.
2. Paste the following script:

```javascript
const SPREADSHEET_ID = '1PlLTM9X0G1_4sMN8e2mXzowq1NnCHk';
const SHEET_NAME = 'Sheet1';

function doPost(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  const body = JSON.parse(e.postData.contents);
  const data = body.data;

  if (body.action === 'createUser') {
    sheet.appendRow([
      data.fullName,
      data.dob,
      data.email,
      data.phone,
      data.ssn,
      data.taxId,
      data.idFileUrl,
      data.accountBalance,
      data.accountId,
      data.createdDate
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  const action = e.parameter.action;

  if (action === 'getUser') {
    const email = e.parameter.email;
    const ssn = e.parameter.ssn;
    const rows = sheet.getDataRange().getValues();

    for (let i = 1; i < rows.length; i++) {
      if (rows[i][2] === email && rows[i][4] === ssn) {
        const user = {
          fullName: rows[i][0],
          dob: rows[i][1],
          email: rows[i][2],
          phone: rows[i][3],
          ssn: rows[i][4],
          taxId: rows[i][5],
          idFileUrl: rows[i][6],
          accountBalance: rows[i][7],
          accountId: rows[i][8],
          createdDate: rows[i][9]
        };
        return ContentService.createTextOutput(JSON.stringify(user))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    return ContentService.createTextOutput(JSON.stringify(null))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Deploy the script as a **Web App** with access set to "Anyone".
4. Copy the **Web App URL**.

### 3. Environment Variables

Create a `.env` file in the `banking-platform` directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SPREADSHEET_ID=1PlLTM9X0G1_4sMN8e2mXzowq1NnCHk
VITE_APPS_SCRIPT_URL=your_google_apps_script_url
```

---

## 🛠 Running the Project

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 🔒 Security & Architecture

- **Data Privacy**: SSNs and Tax IDs are handled via secure HTTPS requests.
- **Frontend Safety**: Environment variables are used to keep API keys configurable.
- **Architecture**: Serverless approach using React, Supabase, and Google Sheets API.

---

## 📝 Note on Prototype

The "Top Up Balance" feature is currently a simulated service. Clicking the button will result in a "Service Unavailable" message as per the requirements for this prototype.

**NovaBank** is a prototype and should not be used for actual financial transactions.
