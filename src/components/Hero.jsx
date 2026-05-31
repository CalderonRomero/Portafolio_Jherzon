import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Brain, ArrowDown, Database } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="inicio" className="hero-section">
      <div className="hero-overlay"></div>

      <div className="container hero-container">
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Brain size={13} className="hero-badge-icon" />
            <span>SISTEMAS E INFORMÁTICA | INVESTIGACIÓN Y DATA SCIENCE</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Yersson Calderon Romero
          </motion.h1>

          <motion.h2
            className="hero-subtitle-academic"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Ingeniería de Sistemas e Informática
          </motion.h2>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Estudiante de 10.° ciclo de Ingeniería de Sistemas (5to superior) en la Universidad Continental y Becario PRONABEC. Especializado en el diseño y validación de arquitecturas de Redes Neuronales Convolucionales (CNNs), visión por computadora y análisis estadístico. Enfoque orientado a la resolución estructurada de problemas mediante el desarrollo de software científico y modular.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <a href="#cnn-sim" className="btn btn-primary">
              <Terminal size={16} /> Ver Simulador CNN
            </a>
            <a href="#ml-playground" className="btn btn-secondary">
              <Database size={16} /> ML Playground
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero-visual-card glass-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot slate"></span>
              <span className="dot slate"></span>
              <span className="dot slate"></span>
            </div>
            <span className="terminal-title">technical_profile.py</span>
          </div>
          <div className="terminal-body">
            <div className="code-line"><span className="code-keyword">import</span> numpy <span className="code-keyword">as</span> np</div>
            <div className="code-line"><span className="code-keyword">import</span> torch</div>
            <div className="code-line"><span className="code-comment"># Parámetros académicos y de investigación</span></div>
            <div className="code-line">academic_profile = &#123;</div>
            <div className="code-line indent-1"><span className="code-str">"fullname"</span>: <span className="code-str">"Yersson Calderon Romero"</span>,</div>
            <div className="code-line indent-1"><span className="code-str">"major"</span>: <span className="code-str">"Systems & Informatics Engineering"</span>,</div>
            <div className="code-line indent-1"><span className="code-str">"rank"</span>: <span className="code-str">"Quintil Superior (5to Superior)"</span>,</div>
            <div className="code-line indent-1"><span className="code-str">"fellowship"</span>: <span className="code-str">"Becario PRONABEC"</span>,</div>
            <div className="code-line indent-1"><span className="code-str">"research_focus"</span>: [<span className="code-str">"CNNs"</span>, <span className="code-str">"Computer Vision"</span>, <span className="code-str">"Deep Learning"</span>],</div>
            <div className="code-line indent-1"><span className="code-str">"evaluated_metrics"</span>: &#123;</div>
            <div className="code-line indent-2"><span className="code-str">"PlantAndes_CNN_Acc"</span>: <span className="code-val">0.902</span>,</div>
            <div className="code-line indent-2"><span className="code-str">"Melanoma_CNN_Acc"</span>: <span className="code-val">0.918</span>,</div>
            <div className="code-line indent-2"><span className="code-str">"DentalCaries_CNN_Acc"</span>: <span className="code-val">0.805</span></div>
            <div className="code-line indent-1">&#125;</div>
            <div className="code-line">&#125;</div>
            <div className="code-line"><span className="code-keyword">print</span>(f<span className="code-str">"Validation engines loaded: &#123;list(academic_profile['evaluated_metrics'].keys())&#125;"</span>)</div>
            <div className="code-output">&gt;&gt; Validation engines loaded: ['PlantAndes_CNN_Acc', 'Melanoma_CNN_Acc', 'DentalCaries_CNN_Acc']</div>
            <div className="code-output">&gt;&gt; PyTorch: CUDA compilation environment initialized successfully.</div>
          </div>
        </motion.div>
      </div>

      <div className="hero-scroll-indicator">
        <motion.a
          href="#cnn-sim"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <span>Visualizar Contenido</span>
          <ArrowDown size={14} />
        </motion.a>
      </div>
    </section>
  );
};

export default Hero;
