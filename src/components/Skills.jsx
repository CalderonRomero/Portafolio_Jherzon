import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database, Wrench, Layers } from 'lucide-react';
import './Skills.css';

const skillCategories = [
  {
    id: 'languages',
    title: 'Lenguajes de Programación',
    icon: <Terminal className="cat-icon" />,
    skills: [
      { name: 'Python', level: 'Avanzado', progress: 92, use: 'Análisis de datos, PyTorch, modelado de CNNs' },
      { name: 'SQL', level: 'Intermedio', progress: 80, use: 'Consultas relacionales estructuradas' },
      { name: 'R', level: 'Intermedio', progress: 75, use: 'Estadística descriptiva e inferencial' },
      { name: 'JavaScript', level: 'Avanzado', progress: 85, use: 'Desarrollo frontend, visualización dinámica' },
      { name: 'Java', level: 'Intermedio', progress: 70, use: 'Estructuras lógicas orientadas a objetos' },
      { name: 'C++', level: 'Intermedio', progress: 65, use: 'Complejidad algorítmica y bajo nivel' },
      { name: 'C#', level: 'Intermedio', progress: 68, use: 'Desarrollo de aplicaciones de escritorio' },
      { name: 'PHP', level: 'Intermedio', progress: 60, use: 'Desarrollo web del lado del servidor' }
    ]
  },
  {
    id: 'ai-ml',
    title: 'Ciencia de Datos & Modelado IA',
    icon: <Layers className="cat-icon" />,
    skills: [
      { name: 'Visión Computacional', level: 'Avanzado', progress: 90, use: 'Segmentación, preprocesamiento de imágenes' },
      { name: 'CNN (Redes Convolucionales)', level: 'Avanzado', progress: 94, use: 'Clasificación foliar y médica' },
      { name: 'Machine Learning', level: 'Avanzado', progress: 88, use: 'Modelos de regresión, K-Means' },
      { name: 'Deep Learning', level: 'Avanzado', progress: 87, use: 'Optimización de hiperparámetros en PyTorch' },
      { name: 'Análisis Estadístico', level: 'Avanzado', progress: 85, use: 'Validación de hipótesis y distribuciones' }
    ]
  },
  {
    id: 'tools',
    title: 'Herramientas & Entornos TI',
    icon: <Wrench className="cat-icon" />,
    skills: [
      { name: 'Git & GitHub', level: 'Avanzado', progress: 90, use: 'Control de versiones y flujos colaborativos' },
      { name: 'Power BI', level: 'Avanzado', progress: 85, use: 'Modelamiento DAX y dashboards ejecutivos' },
      { name: 'ReactJS', level: 'Avanzado', progress: 82, use: 'Construcción de dashboards de visualización de datos' },
      { name: 'Flutter & Dart', level: 'Intermedio', progress: 70, use: 'Desarrollo de aplicaciones móviles híbridas' },
      { name: 'OBS Studio', level: 'Avanzado', progress: 90, use: 'Configuración técnica para streaming' },
      { name: 'Fabricación Digital', level: 'Intermedio', progress: 75, use: 'Operación técnica de impresoras 3D y CNC' }
    ]
  }
];

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('languages');

  const activeData = skillCategories.find(c => c.id === activeCategory);

  return (
    <section id="habilidades" className="section skills-section">
      <div className="container">
        <h2 className="section-title">Habilidades Técnicas</h2>
        <p className="section-subtitle">
          Estructura de capacidades centrada en la rigurosidad estadística, el diseño de modelos neuronales y el desarrollo de software científico.
        </p>

        <div className="skills-wrapper">
          {/* Categories Sidebar */}
          <div className="skills-sidebar">
            {skillCategories.map((cat) => (
              <button
                key={cat.id}
                className={`category-card glass-panel ${activeCategory === cat.id ? 'cat-active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <div className="cat-header">
                  {cat.icon}
                  <h3>{cat.title}</h3>
                </div>
                <p className="cat-meta">{cat.skills.length} Áreas de Dominio</p>
              </button>
            ))}
          </div>

          {/* Details Grid Area */}
          <div className="skills-grid-container glass-panel">
            <motion.div 
              key={activeCategory}
              className="skills-details-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeData.skills.map((skill, idx) => (
                <div key={idx} className="skill-progress-card">
                  <div className="skill-meta-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-level badge">{skill.level}</span>
                  </div>
                  
                  <div className="skill-bar-track">
                    <motion.div 
                      className="skill-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.progress}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.04 }}
                    />
                  </div>
                  
                  <span className="skill-use">* Aplicabilidad: {skill.use}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
