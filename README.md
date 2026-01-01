📊 PortfoLens — Smart Portfolio Insights (v1)

PortfoLens is a full-stack portfolio analysis web application that helps users visualize, analyze, and understand their mutual fund investments using simulated but realistic financial data.

⚠️ Disclaimer: PortfoLens is currently in Demo Mode. All calculations are based on simulated NAV and holdings data and are intended for educational purposes only. This is not financial advice.

🚀 Features
🔐 Authentication

-JWT-based authentication
-Google OAuth 2.0 login
-Secure protected routes
-First-time user onboarding flow

📁 Portfolio Management

-Manual portfolio entry (v1)

Supports:
-SIP-only investments
-Lumpsum-only investments
-SIP + Lumpsum combinations
-Multi-fund portfolios

-Sample portfolio for first-time users

📈 Insights & Reports
-Asset Allocation (Equity, Debt, Gold, Hybrid)
-Category Distribution (Large, Mid, Small Cap, etc.)
-Market Cap Exposure

Performance Metrics:

-Total Invested
-Current Value
-Absolute Returns
-CAGR
-XIRR
-Fund-wise performance breakdown
-Diversification analysis

🧠 Analysis Engine (Local Data)

-Local Fund Reference Database (50 curated Indian mutual funds)
-Local Fund Holdings Data for diversification analysis
-Local NAV History (Jan–Dec 2024) for return calculations

Deterministic seeded data for reproducibility

🏗️ Tech Stack
Frontend

-React (Vite)
-React Router
-Context API (Auth & Portfolio state)
-Tailwind CSS
-Chart libraries for visualization

Backend
-Node.js
-Express.js
-MongoDB + Mongoose
-JWT Authentication
-Google OAuth
-Rate limiting & security middleware

🧪 Current Version — v1 Included

-Manual portfolio entry
-Sample portfolio
-Simulated insights & reports
-Complete authentication flow
-Fully functional analysis pipeline

Planned (Future Versions)
-CSV portfolio upload
-CAS statement import
-Real NAV integration
-Live fund data APIs
-Tax & goal-based insights

Mobile responsiveness improvements

🔒 Security Measures
-JWT token validation
-OAuth rate-limit tuning
-API rate limiting
-Input validation & sanitization
-Secure HTTP headers
-Environment-based configs

⚠️ Disclaimer

PortfoLens does not provide real financial advice.
All calculations are simulated and intended only for learning, demonstration, and portfolio visualization.

👨‍💻 Author

Aryan Kumar Jaiswal
Full Stack Developer | Finance-Tech Enthusiast

Built as a learning-focused full-stack project with strong emphasis on architecture, UX, and data pipelines.

PROJECT STRUCTURE

PortfoLens/
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── scripts/
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   └── public/
│
└── README.md


⭐️ If you like this project

Feel free to ⭐️ the repository and explore the codebase.
