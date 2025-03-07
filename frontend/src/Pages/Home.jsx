import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../utils/Navbar05/Navbar05';

function Home() {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col">
      {/* Header */}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-16">
        {/* Background with overlay gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-neutral-900 opacity-80"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-900 to-transparent"></div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-blue-500/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-1 px-4 max-w-4xl text-center">
          <div className="mb-6 inline-block">
            <span className="inline-block bg-blue-500/20 text-blue-300 px-4 py-1 rounded-full text-sm font-medium mb-4">Financial Intelligence Platform</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Master Your Financial Future</span>
          </h2>
          <p className="text-neutral-300 text-xl mb-8 max-w-2xl mx-auto">
            Get comprehensive stock data and intelligent analytics to make informed investment decisions in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link 
              to="/dashboard" 
              className="group relative bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-lg transition-all duration-300 overflow-hidden shadow-lg"
            >
              <span className="relative z-10">View Dashboard</span>
              <div className="absolute inset-0 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link 
              to="/signup" 
              className="group relative bg-transparent text-white font-medium py-4 px-8 rounded-lg border border-blue-400/30 hover:border-blue-400 transition-all duration-300 shadow-lg"
            >
              <span className="relative z-10">Sign Up Free</span>
              <div className="absolute inset-0 opacity-0 bg-blue-400/10 transition-all duration-300 group-hover:opacity-100"></div>
            </Link>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-neutral-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              <span>Real-time updates</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              <span>Advanced analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              <span>No credit card</span>
            </div>
          </div>
        </div>
        
      </section>

      {/* Features Section */}
      <main className="flex-grow px-6 py-6 bg-gradient-to-b from-neutral-900 to-neutral-950">
  <div className="max-w-6xl mx-auto">
    {/* Section Header */}
    <div className="text-center mb-16">
      <span className="inline-block px-3 py-1 text-sm font-medium text-blue-400 bg-blue-400/10 rounded-full mb-4">Features</span>
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
        Why Choose <span className="text-blue-400">StockTracker</span>?
      </h2>
      <p className="text-neutral-300 max-w-2xl mx-auto text-lg">
        Powerful tools designed to help you make smarter investment decisions and grow your portfolio.
      </p>
    </div>

    {/* Features Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Feature Card 1 */}
      <div className="group bg-neutral-800/60 backdrop-blur-sm border border-neutral-700/50 p-8 rounded-2xl shadow-xl transition-all duration-300 hover:border-blue-500/30 hover:translate-y-[-5px]">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V3M21 7L15.4 12.6L11.7 8.9L7 13.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="font-bold text-xl mb-3 text-white group-hover:text-blue-400 transition-colors">Real-time Data</h3>
        <p className="text-neutral-400">
          Access live market information with millisecond updates. Stay ahead with the latest stock movements, news alerts, and market trends.
        </p>
        <div className="mt-6 pt-6 border-t border-neutral-700/50">
          <a href="#" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium">
            Learn more
            <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
      </div>

      {/* Feature Card 2 */}
      <div className="group bg-neutral-800/60 backdrop-blur-sm border border-neutral-700/50 p-8 rounded-2xl shadow-xl transition-all duration-300 hover:border-purple-500/30 hover:translate-y-[-5px]">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 21V16.6C10 16.0399 10 15.7599 10.109 15.546C10.2049 15.3578 10.3578 15.2049 10.546 15.109C10.7599 15 11.0399 15 11.6 15H12.4C12.9601 15 13.2401 15 13.454 15.109C13.6422 15.2049 13.7951 15.3578 13.891 15.546C14 15.7599 14 16.0399 14 16.6V21M21 21V10.2C21 9.0799 21 8.51984 20.782 8.09202C20.5903 7.71569 20.2843 7.40973 19.908 7.21799C19.4802 7 18.9201 7 17.8 7H6.2C5.07989 7 4.51984 7 4.09202 7.21799C3.71569 7.40973 3.40973 7.71569 3.21799 8.09202C3 8.51984 3 9.0799 3 10.2V21M22 21H2M7 7V4M17 7V4M7.5 11H16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="font-bold text-xl mb-3 text-white group-hover:text-purple-400 transition-colors">Smart Analysis</h3>
        <p className="text-neutral-400">
          Make data-driven decisions with our advanced analytics tools. Visualize trends, identify patterns, and get actionable insights.
        </p>
        <div className="mt-6 pt-6 border-t border-neutral-700/50">
          <a href="#" className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium">
            Learn more
            <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
      </div>

      {/* Feature Card 3 */}
      <div className="group bg-neutral-800/60 backdrop-blur-sm border border-neutral-700/50 p-8 rounded-2xl shadow-xl transition-all duration-300 hover:border-cyan-500/30 hover:translate-y-[-5px]">
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16.01V16M12 8V12M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="font-bold text-xl mb-3 text-white group-hover:text-cyan-400 transition-colors">Easy Access</h3>
        <p className="text-neutral-400">
          Monitor your investments from anywhere, anytime. Our responsive platform works seamlessly across desktop, tablet, and mobile devices.
        </p>
        <div className="mt-6 pt-6 border-t border-neutral-700/50">
          <a href="#" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium">
            Learn more
            <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
    
    
  </div>
</main>

      {/* Footer */}
      <footer className="bg-neutral-800 py-8 mt-auto">
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="mb-6 md:mb-0">
        <h3 className="text-blue-400 font-bold text-xl mb-2">StockTracker</h3>
        <p className="text-neutral-400">&copy; 2024 StockTracker. All rights reserved.</p>
      </div>
      
      <div className="text-center md:text-right">
        <h4 className="text-white font-medium mb-2">Developed by</h4>
        <p className="text-neutral-300 font-bold">John Doe</p>
        <div className="flex items-center justify-center md:justify-end mt-3 space-x-4">
          <a href="https://github.com/johndoe" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-blue-400 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
            </svg>
          </a>
          <a href="https://linkedin.com/in/johndoe" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-blue-400 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
            </svg>
          </a>
          <a href="mailto:john.doe@example.com" className="text-neutral-400 hover:text-blue-400 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
          </a>
          <a href="https://portfolio-johndoe.example.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-blue-400 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
    
    <div className="mt-8 pt-6 border-t border-neutral-700 text-neutral-500 text-sm text-center md:text-left">
      <p>Built with React and Tailwind CSS</p>
    </div>
  </div>
</footer>
    </div>
  );
}

export default Home;