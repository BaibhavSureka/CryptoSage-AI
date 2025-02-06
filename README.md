# CryptoSage AI 🚀

An AI-powered cryptocurrency portfolio management and automated trading platform.

![WhatsApp Image 2025-02-06 at 15 47 32_a90fbaec](https://github.com/user-attachments/assets/61af467d-0c5b-4fd2-95a1-a4c56bdda137)

## Overview

CryptoSage combines artificial intelligence, blockchain technology, and optimization algorithms to provide a next-generation financial portfolio management and trading system. The platform leverages LSTM-based predictions, MetaMask integration, and automated blockchain trading to deliver personalized investment solutions.

![WhatsApp Image 2025-02-06 at 15 47 07_6d8fbc63](https://github.com/user-attachments/assets/bb880f00-8644-47a7-a9ee-c5b270e69828)

![image](https://github.com/user-attachments/assets/a038dfe2-6558-4f59-a371-6f7b084766a4)


## Features

- **AI-Powered Market Predictions**: Advanced LSTM models for accurate cryptocurrency market trend analysis
- **MetaMask Integration**: Secure wallet connection and portfolio tracking
- **Automated Trading**: AI-driven trade execution via smart contracts
- **Portfolio Management**: Personalized investment suggestions based on user profiles
- **Real-time Analytics**: Continuous market monitoring and portfolio performance tracking

## Tech Stack

### Frontend
- Framework: Next.js
- Language: TypeScript
- State Management: Redux
- Blockchain Integration: ethers.js / Web3.js

### Backend
- Framework: Django
- Language: Python
- Database: PostgreSQL
- Authentication: JWT

### AI & Blockchain
- Machine Learning: LSTM Neural Networks
- Smart Contracts: Solidity
- Oracle Integration: Chainlink
- DEX Integration: Uniswap

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- PostgreSQL
- MetaMask wallet
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/BaibhavSureka/DevSoc.git
cd cryptosage
```

2. Install frontend dependencies
```bash
cd cryptosage
npm install
```

3. Install backend dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

4. Run migrations
```bash
python manage.py migrate
```

### Running the Application

1. Start the backend server
```bash
python manage.py runserver
```

2. Start the frontend development server
```bash
npm run dev
```

## Architecture

### AI Component
- Data collection from multiple cryptocurrency APIs
- LSTM model training and prediction pipeline
- Real-time market analysis and signal generation

### Blockchain Integration
- MetaMask wallet connection
- Smart contract deployment and interaction
- Automated trade execution via DEX protocols

### Portfolio Management
- User profile creation and risk assessment
- Asset classification and portfolio optimization
- Automated rebalancing suggestions

## Security Features

- JWT-based authentication
- Secure wallet integration
- Encrypted data storage
- Smart contract auditing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
