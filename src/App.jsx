import React from 'react';
import BackgroundNetwork from './components/BackgroundNetwork';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CNNVisualizer from './components/CNNVisualizer';
import MLPlayground from './components/MLPlayground';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import Contact from './components/Contact';

function App() {
  return (
    <>
      <BackgroundNetwork />
      <Navbar />
      <main>
        <Hero />
        <CNNVisualizer />
        <MLPlayground />
        <Skills />
        <Experience />
        <Certifications />
        <Contact />
      </main>
      <footer className="footer-bar font-mono">
        <div className="container footer-content">
          <p>© {new Date().getFullYear()} Yersson Calderon Romero. All rights reserved.</p>
          <p className="footer-tag">Engineered with React & Mathematical Precision.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
