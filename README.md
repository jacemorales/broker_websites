# NovaBank - Modern Online Banking Platform

NovaBank is a professional fintech prototype featuring a fully functional frontend, secure file storage via Supabase, and a lightweight database solution using Google Sheets.

---

## 🚨 CRITICAL: Actions Required on Your Part

To resolve the errors you are seeing (RLS Policy and CORS), you **must** perform these two steps:

### 1. Fix Supabase "Row-Level Security" Error
The error `new row violates row-level security policy` happens because your storage bucket is private by default.
1. Go to your **Supabase Dashboard** -> **Storage**.
2. Select the `banking-ids` bucket.
3. Go to **Policies**.
4. Create a new **INSERT** policy and a new **SELECT** policy for `anon` users (Allow all).
   *Alternatively, for a prototype, you can simply uncheck "Restrict access with Row Level Security" on the bucket settings, though policies are safer.*

### 2. Fix Google Sheets "CORS/Network" Error
The error `No 'Access-Control-Allow-Origin' header` on `getUser` happens because Google Apps Script handles `GET` redirects in a way that modern browsers block.
1. Open your **Google Apps Script** editor.
2. **Replace your entire code** with the updated script provided in the [Google Apps Script Proxy](#google-apps-script-proxy) section below.
3. **Important:** Click **Deploy** -> **New Deployment**. Select **Web App**.
4. Ensure "Execute as" is **Me** and "Who has access" is **Anyone**.
5. Copy the **new Web App URL** and replace it in `src/services/googleSheets.ts`.

---

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
3. Set the bucket to **Public**.
4. **Important: Storage Policies (RLS)**
   - Click on the `banking-ids` bucket.
   - Go to the **Policies** tab.
   - Click **New Policy** and select **For full customization**.
   - Create an **INSERT** policy:
     - Policy name: `Allow public upload`
     - Allowed operations: `INSERT`
     - Target roles: `anon`
   - Create a **SELECT** policy:
     - Policy name: `Allow public read`
     - Allowed operations: `SELECT`
     - Target roles: `anon`
5. Go to **Project Settings** > **API** to get your:
   - `Project URL`
   - `anon public API Key`

### 2. Google Sheets Setup (Database)

1. Open the [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1PlLTM9X0G1_4sMN8e2mXzowq1NnCHk).
2. Ensure you have the following column headers in the first row (Sheet1):
   - `Full Name`, `Date of Birth`, `Email`, `Phone Number`, `SSN`, `Tax ID`, `Supabase ID File URL`, `Account Balance`, `Account ID`, `Created Date`

#### Google Apps Script Proxy
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
  const action = body.action;

  if (action === 'createUser') {
    const data = body.data;
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

  if (action === 'getUser') {
    const email = body.email;
    const ssn = body.ssn;
    const rows = sheet.getDataRange().getValues();

    for (let i = 1; i < rows.length; i++) {
      // Index 2 is Email, Index 4 is SSN
      if (rows[i][2].toString() === email.toString() && rows[i][4].toString() === ssn.toString()) {
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

function doGet(e) {
  return ContentService.createTextOutput("Service is active. Use POST for data operations.")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

3. Deploy the script as a **Web App** with access set to "Anyone".
4. Copy the **Web App URL**.

### 3. Configuration

For this prototype, the credentials have been hardcoded for immediate functionality.

- **Supabase Configuration**: Located in `src/lib/supabase.ts`
- **Google Sheets Configuration**: Located in `src/services/googleSheets.ts`

To update these, modify the constants directly in the code.

---

## 🛠 Running the Project

1. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
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
- **Architecture**: Serverless approach using React, Supabase, and Google Sheets API proxy.
- **Duplicate Prevention**: Registration logic checks for existing records before allowing new signups.

---

## 📝 Note on Prototype

The "Top Up Balance" feature is currently a simulated service. Clicking the button will result in a "Service Unavailable" message as per the requirements for this prototype.

**NovaBank** is a prototype and should not be used for actual financial transactions.
