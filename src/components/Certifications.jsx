import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ShieldCheck, Bookmark } from 'lucide-react';
import './Certifications.css';

const accomplishments = [
  {
    title: 'Becario PRONABEC',
    institution: 'PRONABEC - Estado Peruano',
    year: '2021 - Presente',
    desc: 'Seleccionado por alto rendimiento académico en un riguroso concurso nacional entre más de 5,000 postulantes de todo el país.'
  },
  {
    title: 'Reconocimiento a la Excelencia Académica',
    institution: 'Instituto de Educación Superior KHIPU',
    year: '2021',
    desc: 'Reconocimiento por Exelencia Académica en la carrera de Desarrollo de Sistemas de Información, destacando por capacidad estructurada de resolución de problemas.'
  }
];

const certsList = [
  {
    title: 'Gestión de Proyectos bajo el enfoque PMI',
    institution: 'Universidad Nacional de Ingeniería (UNI)',
    year: '2025',
    category: 'management',
    topics: 'Metodología PMBOK, Gestión de alcances, cronogramas, costos y control de hitos de ingeniería.'
  },
  {
    title: 'Gestión del Riesgo ISO 31000',
    institution: 'Universidad Nacional de Ingeniería (UNI)',
    year: '2025',
    category: 'management',
    topics: 'Identificación, evaluación cualitativa/cuantitativa y planes de mitigación de riesgos operacionales.'
  },
  {
    title: 'Ciencia de Datos 1',
    institution: 'Universidad Nacional de Ingeniería (UNI)',
    year: '2024',
    category: 'ai-data',
    topics: 'Preprocesamiento de datos, visualización estadística, regresiones y algoritmos de Machine Learning.'
  },
  {
    title: 'Power BI',
    institution: 'Universidad Nacional de Ingeniería (UNI)',
    year: '2024',
    category: 'ai-data',
    topics: 'Modelamiento de datos estrella, consultas DAX complejas e informes ejecutivos interactivos.'
  },
  {
    title: 'Desarrollo de Software Móvil',
    institution: 'Universidad Continental',
    year: '2025',
    category: 'dev',
    topics: 'Desarrollo cross-platform nativo para dispositivos Android/iOS utilizando Flutter y Dart.'
  },
  {
    title: 'Inglés (Nivel B1)',
    institution: 'Universidad Continental',
    year: '2024',
    category: 'other',
    topics: 'Comprensión lectora técnica, comunicación verbal fluida aplicada a entornos profesionales.'
  },
  {
    title: 'React con Hooks y MERN Stack',
    institution: 'Udemy',
    year: '2021',
    category: 'dev',
    topics: 'React, Hooks, Context, Node.js, Express, MongoDB y despliegue distribuido.'
  },
  {
    title: 'Control de Versiones Git y GitHub',
    institution: 'Udemy',
    year: '2020',
    category: 'dev',
    topics: 'Branching avanzado, pull requests, resolución de conflictos y automatizaciones básicas.'
  },
  {
    title: 'Entorno de Trabajo Visual Studio Code',
    institution: 'Platzi',
    year: '2019',
    category: 'dev',
    topics: 'Optimización de flujos de trabajo, debugging interactivo y extensiones de desarrollo.'
  },
  {
    title: 'Fundamentos de Programación',
    institution: 'EDteam',
    year: '2019',
    category: 'dev',
    topics: 'Lógica computacional, diagramación de flujos de control y estructuras de datos básicas.'
  }
];

const Certifications = () => {
  const [filter, setFilter] = useState('all');
  const [selectedCert, setSelectedCert] = useState(null);

  const filteredCerts = filter === 'all'
    ? certsList
    : certsList.filter(c => c.category === filter);

  return (
    <section id="certificaciones" className="section certs-section">
      <div className="container">
        <h2 className="section-title">Estudios & Logros</h2>
        <p className="section-subtitle">
          Formación complementaria y reconocimientos que respaldan la rigurosidad científica y técnica de mi trabajo diario.
        </p>

        {/* Highlight Accomplishments */}
        <div className="accomplishments-container">
          {accomplishments.map((acc, idx) => (
            <div key={idx} className="acc-card glass-panel">
              <div className="acc-icon-header">
                <Award size={18} className="acc-icon" />
                <span className="acc-year font-mono">{acc.year}</span>
              </div>
              <h3 className="acc-title">{acc.title}</h3>
              <h4 className="acc-inst">{acc.institution}</h4>
              <p className="acc-desc">{acc.desc}</p>
            </div>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="certs-filters">
          <button className={`filter-btn ${filter === 'all' ? 'active-filter' : ''}`} onClick={() => setFilter('all')}>
            Todos
          </button>
          <button className={`filter-btn ${filter === 'ai-data' ? 'active-filter' : ''}`} onClick={() => setFilter('ai-data')}>
            Ciencia de Datos / IA
          </button>
          <button className={`filter-btn ${filter === 'management' ? 'active-filter' : ''}`} onClick={() => setFilter('management')}>
            Gestión de Proyectos
          </button>
          <button className={`filter-btn ${filter === 'dev' ? 'active-filter' : ''}`} onClick={() => setFilter('dev')}>
            Desarrollo de Software
          </button>
        </div>

        {/* Certifications Grid */}
        <div className="certs-grid">
          <AnimatePresence mode="popLayout">
            {filteredCerts.map((cert) => (
              <motion.div
                key={cert.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="cert-card glass-panel"
                onClick={() => setSelectedCert(cert)}
              >
                <div className="cert-header">
                  <Bookmark size={14} className="cert-tag" />
                  <span className="cert-year font-mono">{cert.year}</span>
                </div>
                <h3 className="cert-title">{cert.title}</h3>
                <h4 className="cert-inst">{cert.institution}</h4>
                <div className="cert-click-hint">
                  <span>Detalles temáticos</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Detail Modal Overlay */}
        <AnimatePresence>
          {selectedCert && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
            >
              <motion.div
                className="modal-content glass-panel"
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <ShieldCheck size={26} className="modal-check-icon" />
                  <div>
                    <span className="modal-year font-mono">{selectedCert.year}</span>
                    <h3>{selectedCert.title}</h3>
                    <h4>{selectedCert.institution}</h4>
                  </div>
                </div>

                <div className="modal-body text-left">
                  <h5>Ejes Temáticos del Plan de Estudios:</h5>
                  <p>{selectedCert.topics}</p>
                </div>

                <button className="btn btn-secondary w-full" onClick={() => setSelectedCert(null)}>
                  Cerrar
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Certifications;
