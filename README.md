  # Golf Charity Platform ⛳🏆
  
  A full-stack platform that enables users to participate in subscription-based prize draws while contributing to charitable causes. 
  
  The system implements dynamic financial calculations, secure payment workflows, and role-based access control to manage users, charities, and monthly draw outcomes.
  
  🔗 Live Demo: https://golf-charity-sub-platform-814hh2chh-piyush6949s-projects.vercel.app/
  
  ## Key Highlights
  
  - Designed dynamic jackpot system with real-time financial calculations based on user contributions
  - Integrated Razorpay payment workflows with webhook verification for secure subscriptions
  - Implemented role-based dashboards with protected admin APIs and winner verification flows
  - Built secure authentication using JWT-based HttpOnly cookie sessions and RBAC
  
  ## 🌟 Key Features
  
  ### 1. **Dynamic Prize Pools & Jackpots**
  The prize pool scales dynamically as more users subscribe. The platform automatically calculates the total jackpot based on users' selected charity contributions:
  - **Calculation Rule**: `((50% - User Charity Contribution %) * Subscription Amount)` feeds into the jackpot.
  - **Prize Tiers**: 
    - 👑 5-Number Match: **40%** (Rolls over to next month if no winner).
    - 🏆 4-Number Match: **35%** (Distributed equally among winners).
    - ⭐ 3-Number Match: **25%** (Distributed equally among winners).
  
  ### 2. **Flexible Charity Contributions**
  - Users decide what percentage of their subscription goes directly to their chosen charity (capped up to 50%).
  - Real-time updates display exactly how much money is going to charity vs the prize pool.
  - Users can choose from a constantly updating list of partner charities (Environment, Education, Healthcare).
  
  ### 3. **Secure Subscriptions (Razorpay)**
  - Fully integrated with the **Razorpay API** for managing secure recurring yearly subscriptions (₹8,999/year).
  - Webhook-ready endpoints and signature verification processes ensure safe access to the "Pro Plan" dashboard.
  
  ### 4. **User & Admin Dashboards**
  - **User Dashboard**: Users can enter up to five Stableford scores, track lifetime winnings, see upcoming draws, download action-required notifications if they win, and upload scorecards for manual payout verification via the `Winnings & Draws` section.
  - **Admin Panel**: Strict route-guarded admin APIs allow the team to manage subscriptions, verify uploaded proof images for winners, run monthly RNG draws, and manage payouts.
  
  ## 🛠️ Tech Stack
  
  - **Framework**: [Next.js (App Router)](https://nextjs.org/)
  - **Language**: [TypeScript](https://www.typescriptlang.org/)
  - **Styling**: Vanilla CSS with custom Tailwind-like utility classes and variables.
  - **Database ORM**: [Prisma](https://www.prisma.io/)
  - **Database Entity**: PostgreSQL
  - **Payments Processing**: [Razorpay](https://razorpay.com/)
  - **Security**: JWT-based secure HttpOnly cookie session management and role-based access control (RBAC).
  
  ## 🚀 Getting Started
  
  ### Prerequisites
  - Node.js (`v18+`)
  - PostgreSQL Database
  - Razorpay Test/Live Account (API Keys)
  
  ### Environment Variables
  Create a `.env` file in the root directory:
  ```env
  DATABASE_URL="your_postgresql_connection_string"
  JWT_SECRET="your_secure_jwt_secret"
  RAZORPAY_KEY_ID="rzp_test_YOUR_KEY"
  RAZORPAY_KEY_SECRET="YOUR_SECRET"
  ```
  
  ### Installation
  
  1. Install dependencies:
     ```bash
     pnpm install
     ```
  2. Push the Prisma Schema to your database:
     ```bash
     npx prisma db push
     # OR
     pnpm dlx prisma db push
     ```
  3. (Optional) Run the database seeders for charities:
     ```bash
     npx tsx seed_charities.ts
     ```
  4. Start the development server:
     ```bash
     pnpm dev
     ```
  5. Open [localhost:3000](http://localhost:3000)
  
  ## 🗄️ Database Schema & Models
  - **`User`**: Tracks authentication, role (USER vs ADMIN), charity selections, and subscription metadata.
  - **`Charity`**: Tracks partner organizations and total raised.
  - **`Score`**: Tracks the Stableford inputs entered by users for the current draw.
  - **`Draw`**: Tracks historical monthly lottery outcomes (the 5 drawn numbers).
  - **`Winner`**: A junction tracking which user won which draw, the matched tier, the calculated monetary prize, their uploaded proof snippet, and payment status (`pending`, `approved`, `paid`).
  
  ## 🛡️ Security Posture
  - All interactions with user-specific mutations (scores, preferences, proof-uploads) mandate the presence of a server-side verified HTTP-only session cookie.
  - Admin APIs (`/api/admin/...`) explicitly perform synchronous database lookups to verify `role === "ADMIN"` during every request.
  - PII (Personally Identifiable Information) natively obfuscated from all public statistic endpoints (`/api/stats`, `/api/jackpot`).

---
*Built to empower golfers to change lives while competing for the ultimate prize.* 🏌️‍♂️
