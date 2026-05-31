import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X, Cpu } from 'lucide-react';
import './Navbar.css';

// Custom SVG Icons for brands (due to Lucide ESM variation changes)
const GithubIcon = ({ size = 20, ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 20, ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    stroke="currentColor" 
    strokeWidth="2" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'CNN Simulador', href: '#cnn-sim' },
    { name: 'ML Playground', href: '#ml-playground' },
    { name: 'Habilidades', href: '#habilidades' },
    { name: 'Experiencia', href: '#experiencia' },
    { name: 'Estudios', href: '#certificaciones' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <>
      <motion.nav 
        className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="navbar-container">
          <a href="#inicio" className="navbar-logo">
            <Cpu className="logo-icon" />
            <span className="logo-text">Yersson<span className="logo-dot">.AI</span></span>
          </a>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            {navLinks.map((link, idx) => (
              <a key={idx} href={link.href} className="nav-link">
                {link.name}
              </a>
            ))}
          </div>

          <div className="navbar-socials">
            <a href="https://github.com/CalderonRomero" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="GitHub">
              <GithubIcon size={20} />
            </a>
            <a href="https://www.linkedin.com/in/yersson-calderon-romero-456b8a222/" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="LinkedIn">
              <LinkedinIcon size={20} />
            </a>
            <a href="/CV-Yersson-Calderon.pdf" download className="cv-download-btn">
              Download CV
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <motion.div 
          className="mobile-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mobile-menu-links">
            {navLinks.map((link, idx) => (
              <a 
                key={idx} 
                href={link.href} 
                className="mobile-nav-link"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="mobile-menu-socials">
              <a href="https://github.com/CalderonRomero" target="_blank" rel="noopener noreferrer" className="mobile-social-btn">
                <GithubIcon size={20} style={{ marginRight: '6px' }} /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/yersson-calderon-romero-456b8a222/" target="_blank" rel="noopener noreferrer" className="mobile-social-btn">
                <LinkedinIcon size={20} style={{ marginRight: '6px' }} /> LinkedIn
              </a>
              <a href="/CV-Yersson-Calderon.pdf" download className="mobile-cv-btn">
                Download CV
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* Top Scroll Progress Indicator */}
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />
    </>
  );
};

export default Navbar;
