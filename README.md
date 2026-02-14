# Splitzy - Group Expense Splitting Application

A production-ready web application for splitting expenses with friends and groups, similar to Splitwise. Built with Next.js, TypeScript, Firebase, and Tailwind CSS.

![Splitzy](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.7-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## ✨ Features

### Authentication
- 🔐 Google OAuth authentication via Firebase
- 👤 Automatic user profile creation
- 🔒 Secure session management

### Group Management
- ➕ Create unlimited groups
- 🔑 5-digit unique join codes for easy group joining
- 👥 View all group members with their balances
- 🚫 Duplicate join code prevention

### Expense Tracking
- 💰 Add expenses with custom descriptions
- 👫 Split expenses among selected group members
- ⚖️ Automatic equal splitting calculation
- 📊 Real-time balance updates

### Smart Balance Calculations
- 💵 Track total amount paid by each user
- 💳 Calculate personal trip costs
- 📈 Show who owes whom
- 🎯 Net balance calculations
- ⚡ Real-time transaction tracking

### User Interface
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Clean and professional UI with Tailwind CSS
- ⚡ Fast page loads and smooth transitions
- 🔔 Toast notifications for user actions
- ⏳ Loading states and error handling

## 🏗️ Project Structure

```
splitzy/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx           # Login page
│   │   ├── (main)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx           # Dashboard with groups list
│   │   │   ├── group/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx       # Group detail page
│   │   │   ├── create-group/
│   │   │   │   └── page.tsx           # Create new group
│   │   │   └── join-group/
│   │   │       └── page.tsx           # Join existing group
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Home page (redirects)
│   │   └── globals.css                 # Global styles
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx             # Reusable button component
│   │   │   ├── Input.tsx              # Reusable input component
│   │   │   ├── Modal.tsx              # Modal dialog component
│   │   │   ├── Card.tsx               # Card container component
│   │   │   └── LoadingSpinner.tsx     # Loading indicator
│   │   ├── GroupCard.tsx              # Group card for dashboard
│   │   ├── ExpenseList.tsx            # List of expenses
│   │   └── AddExpenseModal.tsx        # Modal to add new expense
│   ├── lib/
│   │   ├── firebase.ts                # Firebase configuration
│   │   ├── auth-context.tsx           # Authentication context provider
│   │   └── utils.ts                   # Utility functions & calculators
│   └── hooks/
│       └── useGroupData.ts            # Custom hook for group data
├── firestore.rules                     # Firestore security rules
├── .env.example                        # Environment variables template
├── next.config.js                      # Next.js configuration
├── tailwind.config.js                  # Tailwind CSS configuration
├── tsconfig.json                       # TypeScript configuration
└── package.json                        # Dependencies

```

## 📊 Firestore Data Schema

### Collections

#### users
```javascript
{
  uid: string,              // Firebase Auth UID
  name: string,             // User display name
  email: string,            // User email
  photoURL: string,         // Profile photo URL
  createdAt: Timestamp      // Account creation date
}
```

#### groups
```javascript
{
  groupId: string,          // Auto-generated document ID
  name: string,             // Group name
  joinCode: string,         // 5-digit unique join code
  createdBy: string,        // UID of creator
  members: string[],        // Array of member UIDs
  createdAt: Timestamp      // Group creation date
}
```

#### groups/{groupId}/expenses
```javascript
{
  expenseId: string,        // Auto-generated document ID
  description: string,      // Expense description
  totalAmount: number,      // Total expense amount
  paidBy: string,           // UID of person who paid
  splitAmong: string[],     // Array of UIDs to split among
  perPersonAmount: number,  // Amount per person
  createdAt: Timestamp      // Expense creation date
}
```

#### groups/{groupId}/transactions
```javascript
{
  transactionId: string,    // Auto-generated document ID
  from: string,             // UID of person who owes
  to: string,               // UID of person owed
  amount: number,           // Amount owed
  expenseId: string,        // Reference to expense
  createdAt: Timestamp      // Transaction creation date
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase account
- Google account for testing

### 1. Clone the Repository

```bash
git clone <repository-url>
cd splitzy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Sign-in methods → Google
4. Enable **Firestore Database** in production mode
5. Get your Firebase config from Project Settings

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Deploy Firestore Rules

Copy the rules from `firestore.rules` and paste them in:
Firebase Console → Firestore Database → Rules

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment to Vercel

### Method 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add all `NEXT_PUBLIC_FIREBASE_*` variables

### Method 2: Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables
6. Click "Deploy"

### Post-Deployment

1. Update Firebase authorized domains:
   - Go to Firebase Console → Authentication → Settings
   - Add your Vercel domain to authorized domains

2. Test the deployed application

## 🎯 Usage Guide

### Creating a Group

1. Login with Google account
2. Click "Create Group" on dashboard
3. Enter group name (e.g., "Goa Trip 2026")
4. Group is created with a unique 5-digit join code
5. Share the join code with friends

### Joining a Group

1. Get the 5-digit join code from a friend
2. Click "Join Group" on dashboard
3. Enter the join code
4. You'll be added to the group instantly

### Adding Expenses

1. Open a group
2. Click "Add Expense"
3. Enter:
   - Description (e.g., "Dinner at restaurant")
   - Total amount
   - Who paid
   - Select people to split with
4. Expense is added and balances update automatically

### Understanding Balances

**Total Paid**: Total amount you've paid for group expenses

**Your Share**: Your portion of all expenses you're part of

**You Owe**: Total amount you need to pay to others

**Others Owe You**: Total amount others need to pay you

**Net Balance**: 
- Positive (green): You are owed money
- Negative (red): You owe money
- Zero: All settled up

## 🔒 Security Features

- ✅ User authentication required for all operations
- ✅ Group members can only access their group data
- ✅ Firestore security rules enforce data access
- ✅ No direct database access from unauthorized users
- ✅ Environment variables for sensitive data

## 🛠️ Technologies Used

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase
  - Authentication (Google OAuth)
  - Firestore Database
- **Deployment**: Vercel
- **State Management**: React Context API
- **Notifications**: react-hot-toast

## 📱 Screenshots Description

### Login Page
- Clean login interface with Google authentication
- Feature highlights with checkmarks
- Responsive design with gradient background

### Dashboard
- List of all user's groups
- Create and join group buttons
- Group cards showing member count and join code
- User profile in header

### Create Group
- Simple form to create new group
- Information about join code generation
- Back navigation to dashboard

### Join Group
- 5-digit code input with numeric validation
- Helper text for finding join codes
- Visual feedback during joining

### Group Detail Page
- Left sidebar:
  - Join code with copy button
  - User's personal balance breakdown
  - List of all members with their balances
- Right content:
  - List of all expenses with details
  - Add expense button
  - Expense cards showing who paid and split details

### Add Expense Modal
- Description input
- Amount input with currency symbol
- Dropdown to select who paid
- Checkbox list to select split members
- Live calculation of per-person amount
- Form validation

## 🧪 Testing Checklist

- [ ] User can sign in with Google
- [ ] User can create a group
- [ ] User can join a group with code
- [ ] User cannot join with invalid code
- [ ] User can add an expense
- [ ] Balances calculate correctly
- [ ] Multiple users can see same data
- [ ] Real-time updates work
- [ ] Copy join code works
- [ ] Responsive on mobile devices
- [ ] Toast notifications appear
- [ ] Loading states show correctly

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify all environment variables are set correctly
- Check Firebase project settings
- Ensure billing is enabled for Firebase (free tier is fine)

### Authentication Not Working
- Check if Google sign-in is enabled in Firebase Console
- Verify authorized domains include your deployment URL
- Clear browser cache and cookies

### Firestore Permission Errors
- Deploy the security rules from `firestore.rules`
- Ensure user is authenticated
- Check if user is a member of the group

### Build Errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Check Node.js version (should be 18+)

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, Firebase, and Tailwind CSS
