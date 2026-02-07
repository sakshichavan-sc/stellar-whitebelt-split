# StellarSplit – Split Bills on Stellar

A simple decentralized payment application built on the **Stellar Testnet** that allows users to split a bill among friends and send XLM payments directly from their Freighter wallet.

## Features

- ✅ **Wallet Connect/Disconnect** – Freighter wallet integration
- ✅ **Balance Display** – Real-time XLM balance
- ✅ **Bill Calculation** – Split any amount among multiple recipients
- ✅ **Send Transactions** – Pay all recipients with one click
- ✅ **Transaction Feedback** – Success/failure states with transaction hashes
- ✅ **Clean UI** – Simple, intuitive dark-themed interface

## Tech Stack

- **React** + TypeScript (frontend)
- **@stellar/stellar-sdk** – Stellar network interactions
- **@stellar/freighter-api** – Wallet integration
- **Tailwind CSS** – Styling
- **Vite** – Build tool

## Prerequisites

1. Install the [Freighter Wallet](https://freighter.app/) browser extension
2. Switch Freighter to **Testnet**
3. Fund your testnet account at [Stellar Friendbot](https://friendbot.stellar.org/?addr=YOUR_PUBLIC_KEY)

## Getting Started

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

## How It Works

1. **Connect Wallet** – Click "Connect Wallet" to link your Freighter wallet
2. **Enter Bill Amount** – Type the total bill amount in XLM
3. **Add Recipients** – Enter Stellar addresses of people to pay
4. **Pay All** – The app calculates each person's share and sends XLM transactions
5. **View Results** – See success/failure status and transaction hashes

## How to Fund Your Testnet Wallet

Open your browser and visit:
```
https://friendbot.stellar.org/?addr=YOUR_STELLAR_PUBLIC_KEY
```
Replace `YOUR_STELLAR_PUBLIC_KEY` with your actual address from Freighter.

## Deployment

Deploy to Netlify or Vercel:

```bash
npm run build
```

Upload the `dist` folder to your hosting provider.

## Project Structure

```
src/
├── assets/          # Logo and static assets
├── components/      # UI components (WalletInfo, BillSplitter)
├── hooks/           # useStellarWallet hook
├── pages/           # Page components
└── index.css        # Design tokens and global styles
```

## License

MIT
