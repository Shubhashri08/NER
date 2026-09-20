import React from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import CapabilitiesBar from './components/CapabilitiesBar.jsx';
import Challenge from './components/Challenge.jsx';
import Solution from './components/Solution.jsx';
import Workflow from './components/Workflow.jsx';
import States from './components/States.jsx';
import Impact from './components/Impact.jsx';
import Footer from './components/Footer.jsx';

export default function App({ onNavigateLogin, onExplorePlatform }) {
  return (
    <div className="min-h-screen bg-[#ece5d6] text-[#12181a] selection:bg-[#d8b56a]/30 selection:text-black font-sans">
      <Navbar onNavigateLogin={onNavigateLogin} />
      <main>
        <Hero onExplorePlatform={onExplorePlatform} />
        <CapabilitiesBar />
        <Challenge />
        <Solution onExplorePlatform={onExplorePlatform} />
        <Workflow />
        <States />
        <Impact />
      </main>
      <Footer onExplorePlatform={onExplorePlatform} />
    </div>
  );
}
