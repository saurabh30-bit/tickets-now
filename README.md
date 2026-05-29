<h1 align="center">🎟️ Tickets Now</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=threedotjs" alt="Three.js" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/github/actions/workflow/status/saurabh30-bit/tickets-now/ci.yml?style=for-the-badge" alt="Build Status" />
</p>

## 📖 Overview

**Tickets Now** is a modern, high-performance web application built to deliver an immersive ticket booking experience. Leveraging the power of Next.js 16 and React 19, the frontend integrates **Three.js** via `@react-three/fiber` for stunning 3D visual effects and interactive UI elements. The backend is powered by **Supabase** for real-time database capabilities and robust authentication, while automated web scraping or testing is handled gracefully with **Puppeteer**.

## ✨ Key Features

- **Immersive 3D UI**: Interactive 3D elements powered by React Three Fiber and Postprocessing.
- **Real-Time Data**: Instantaneous updates and robust data management via Supabase.
- **Server-Side Rendering (SSR)**: Lightning-fast page loads optimized by Next.js App Router.
- **Responsive Design**: Beautifully styled using Tailwind CSS v4 to look perfect on any device.

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm installed on your local machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/saurabh30-bit/tickets-now.git
   cd tickets-now
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials and other necessary secrets.
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Architecture

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **3D Graphics**: [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- **Database / Auth**: [Supabase](https://supabase.com/)
- **Automation / Testing**: [Puppeteer](https://pptr.dev/)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/saurabh30-bit/tickets-now/issues).

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
