# 🏦 Open Banking Frontend Application

Frontend application to simulate an **Open Banking** flow with authentication via consent, visualization of accounts/balances/transactions, and simulation of payment via PIX.

## 📋 Objective
This project was developed for a technical test, focusing on:
- Clean and decoupled architecture.
- Good frontend development practices.
- Simulation of functionalities inspired by Open Banking Brazil.
- Modern and responsive interface.

---

## 🚀 Features

### Frontend
- **Signup**: Screen to create an account.
  - **Personal Information**: Collection of user's full name, CPF (Brazilian tax ID), and date of birth
  - **Contact Details**: Email address and phone number for account verification
  - **Address Information**: Complete residential address for KYC compliance
  - **Document Verification**: Upload of identity documents (RG, CNH, or passport)
  - **Password Security**: Strong password requirements with strength indicator
  - **Terms & Conditions**: Acceptance of service terms and privacy policy
  - **Email Verification**: Confirmation email with verification link
  - **SMS Verification**: Phone number verification via SMS code
  - **Security Questions**: Setup of security questions for account recovery
  - **Biometric Setup**: Optional fingerprint/face recognition enrollment
  - **Progress Indicator**: Multi-step form with clear progress tracking
  - **Data Validation**: Real-time validation of all input fields
  - **Error Handling**: Clear error messages and validation feedback
  - **Accessibility**: WCAG compliant design for inclusive access

- **Login/Consent**: Screen to simulate authentication and scope selection.
  - **User Authentication**: Secure login form with email/password or CPF validation
  - **Consent Management**: Interactive scope selection with detailed explanations
  - **Permission Granularity**: 
    - Account information access (read-only)
    - Balance inquiry permissions
    - Transaction history access
    - Payment initiation capabilities
  - **Consent Duration**: Configurable consent validity periods (1 day, 7 days, 30 days, 90 days)
  - **Third-party App Information**: Display of requesting application details
  - **Risk Warnings**: Clear communication about data sharing implications
  - **Revocation Options**: Easy consent withdrawal functionality
  - **Multi-factor Authentication**: Optional 2FA for enhanced security
  - **Audit Trail**: Complete logging of consent actions and changes

- **Dashboard**: List of accounts, balances, and transactions.
  - **Account Overview**: Summary cards showing total balance across all accounts
  - **Account List**: Detailed view of all connected bank accounts with:
    - Account type (checking, savings, investment)
    - Account number (masked for security)
    - Current balance
    - Available balance
    - Account status (active, blocked, etc.)
  - **Balance Charts**: Visual representation of balance trends over time
  - **Recent Transactions**: Latest transactions with:
    - Transaction date and time
    - Description and category
    - Amount and type (credit/debit)
    - Transaction status
    - Merchant information (when available)
  - **Quick Actions**: Fast access to common functions:
    - Transfer between accounts
    - PIX payment initiation
    - Account statement download
    - Card management
  - **Notifications**: Real-time alerts for:
    - Large transactions
    - Low balance warnings
    - Security alerts
    - Payment confirmations
  - **Search & Filter**: Advanced filtering options for:
    - Date ranges
    - Transaction categories
    - Amount ranges
    - Account selection
  - **Export Options**: Download transaction data in various formats (PDF, CSV, Excel)
  - **Security Status**: Display of current security settings and recommendations
  - **Consent Management**: Quick access to view and modify consent permissions
  - **Responsive Design**: Optimized layout for desktop, tablet, and mobile devices
  - **Dark/Light Mode**: Theme toggle for user preference
  - **Real-time Updates**: Live data refresh without page reload
  - **Loading States**: Smooth loading indicators for better UX

- **PIX Screen**: Form for sending payment.
  - **PIX Key Types**: Support for all Brazilian PIX key types:
    - CPF/CNPJ (tax ID)
    - Email address
    - Phone number
    - Random key (chave aleatória)
    - QR Code scanning
  - **Payment Form**: Comprehensive payment details including:
    - Recipient information (name, bank, account type)
    - Payment amount with currency formatting
    - Payment description/memo
    - Scheduled payment date (immediate or future)
    - Payment category/tag for organization
  - **QR Code Scanner**: Built-in camera access for scanning PIX QR codes
  - **QR Code Generator**: Create PIX QR codes for receiving payments
  - **Contact List**: Quick access to saved PIX contacts and favorites
  - **Payment Validation**: Real-time validation of:
    - PIX key format and validity
    - Account balance verification
    - Daily/monthly payment limits
    - Recipient account status
  - **Security Features**: Enhanced security measures:
    - Biometric authentication for large amounts
    - SMS/email confirmation codes
    - Transaction signing with digital certificates
    - Fraud detection alerts
  - **Payment Scheduling**: Options for:
    - Immediate payment
    - Scheduled payment (future date)
    - Recurring payments (weekly, monthly)
    - Payment reminders and notifications
  - **Transaction Limits**: Display of:
    - Available balance
    - Daily transfer limits
    - Monthly transfer limits
    - Remaining limit for the period
  - **Fee Information**: Clear display of:
    - Transaction fees (if any)
    - Total amount including fees
    - Fee breakdown and explanations
  - **Payment History**: Quick access to recent PIX transactions
  - **Receipt Generation**: Automatic generation of payment receipts
  - **Error Handling**: Comprehensive error management:
    - Invalid PIX key errors
    - Insufficient balance alerts
    - Network connectivity issues
    - Bank system maintenance notifications
  - **Accessibility**: WCAG compliant design with:
    - Screen reader support
    - High contrast mode
    - Keyboard navigation
    - Voice input support

- **Payment Status**: Screen for confirmation and tracking.
  - **Transaction Details**: Comprehensive payment information including:
    - Transaction ID and reference number
    - Payment amount and currency
    - Recipient details (name, PIX key, bank)
    - Payment date and time (initiated, processed, completed)
    - Payment description and category
    - Fee breakdown and total cost
  - **Status Tracking**: Real-time payment status with visual indicators:
    - Pending (awaiting processing)
    - Processing (being validated)
    - Completed (successfully transferred)
    - Failed (rejected or cancelled)
    - Cancelled (user-initiated cancellation)
  - **Progress Timeline**: Visual timeline showing payment journey:
    - Payment initiated
    - Bank validation
    - PIX system processing
    - Recipient notification
    - Transfer completed
  - **Confirmation Details**: Success confirmation with:
    - Success message and icon
    - Transaction summary
    - Estimated completion time
    - Next steps information
  - **Error Information**: Detailed error handling for failed payments:
    - Error code and description
    - Reason for failure
    - Suggested solutions
    - Retry options
    - Support contact information
  - **Receipt & Proof**: Digital documentation including:
    - Payment receipt generation
    - Transaction proof for download
    - QR code for receipt sharing
    - Email/SMS receipt delivery
  - **Payment History**: Access to:
    - Recent payment history
    - Payment search and filtering
    - Export transaction data
    - Payment analytics and insights
  - **Notifications**: Real-time updates via:
    - Push notifications
    - Email confirmations
    - SMS alerts
    - In-app notifications
  - **Action Buttons**: Quick actions available:
    - Share receipt
    - Download proof
    - Make another payment
    - Contact support
    - Report issue
  - **Security Information**: Security details including:
    - Authentication method used
    - Device information
    - IP address and location
    - Security recommendations
  - **Support Integration**: Easy access to help:
    - Live chat support
    - FAQ section
    - Contact forms
    - Call center integration
  - **Responsive Design**: Optimized for all devices with:
    - Mobile-first design
    - Touch-friendly interface
    - Offline status viewing
    - Print-friendly layouts

---

## 🛠 Technologies

### Frontend
- **React** with **Next.js**
- **Axios** for API consumption
- **Tailwind CSS** for styling
- **JWT** stored in `localStorage`
- **Sentry** for error tracking
- **Context API** for state management

---

## 🔐 Security Considerations
- Use of **HTTPS** (even locally with a self-signed certificate).
- **Scopes** to control access to endpoints.
- Handling of errors and invalid payloads.
- Logs with correlation IDs.
