import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, Users, Award, Hammer, GraduationCap } from 'lucide-react';
import './Experience.css';

const experiences = [
  {
    role: 'Asesor de Investigación Científica & ML (Freelance)',
    company: 'Asesoría y Consultoría Científica',
    period: '2025 - Presente',
    type: 'Investigación y Desarrollo',
    icon: <GraduationCap className="exp-icon" />,
    bullets: [
      'Asesoro a estudiantes universitarios y de posgrado en el desarrollo, redacción y estructuración metodológica de artículos científicos, tesis de grado e investigaciones académicas.',
      'Brindo reforzamiento y capacitación especializada en programación orientada a Machine Learning (aprendizaje automático), análisis estadístico de datos y formulación/validación de pruebas de hipótesis estadísticas.',
      'Enseño metodologías de ciencia de datos aplicadas a la investigación científica, facilitando la comprensión práctica de algoritmos y modelamiento predictivo.'
    ]
  },
  {
    role: 'Operador de Laboratorio de Fabricación Digital',
    company: 'FabLab Universidad Continental, Cusco',
    period: 'Agosto 2024 - Noviembre 2024',
    type: 'Trabajo Técnico',
    icon: <Hammer className="exp-icon" />,
    bullets: [
      'Operé y mantuve activas impresoras 3D, cortadoras láser y máquinas CNC router, garantizando el funcionamiento óptimo de los equipos y minimizando fallas técnicas.',
      'Brindé soporte de ingeniería y asesoría de diseño para fabricación digital a más de 100 estudiantes de múltiples facultades, optimizando el uso de la maquinaria en un 50%.',
      'Guié y estructuré recorridos formativos para más de 60 alumnos de colegios secundarios, difundiendo el conocimiento en manufactura digital y ciencias computacionales.'
    ]
  },
  {
    role: 'Productor Audiovisual & Técnico TI',
    company: 'Estudio de Abogados VILLALBA, Cusco',
    period: 'Marzo 2021 - Abril 2021',
    type: 'Media / Streaming',
    icon: <Users className="exp-icon" />,
    bullets: [
      'Diseñé e instalé la infraestructura técnica para un set de grabación profesional con OBS Studio, mejorando drásticamente la latencia y calidad de las transmisiones virtuales.',
      'Configuré equipos ópticos, sistemas de iluminación digital y audio distribuido, reduciendo los tiempos logísticos de calibración e instalación de transmisiones en un 20%.',
      'Produje y edité piezas de contenido corporativo para canales de difusión, incrementando el alcance orgánico y la fidelización de audiencias digitales.'
    ]
  }
];

const Experience = () => {
  return (
    <section id="experiencia" className="section experience-section">
      <div className="container">
        <h2 className="section-title">Experiencia Profesional</h2>
        <p className="section-subtitle">
          Mi trayectoria combina roles de soporte tecnológico e ingeniería en laboratorios avanzados de prototipado con la optimización de flujos y producción de contenido técnico.
        </p>

        {/* Timeline wrapper */}
        <div className="timeline-container">
          <div className="timeline-spine" />
          
          {experiences.map((exp, idx) => (
            <div 
              key={idx} 
              className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}
            >
              {/* Timeline center node dot */}
              <div className="timeline-dot-wrapper">
                <div className="timeline-dot-glowing" />
              </div>

              {/* Card wrapper */}
              <div className={`experience-card glass-panel ${idx % 2 === 0 ? 'exp-card-left' : 'exp-card-right'}`}>
                <div className="exp-card-header">
                  <div className="exp-icon-box">
                    {exp.icon}
                  </div>
                  <div>
                    <span className="exp-badge badge-cyan">{exp.type}</span>
                    <h3 className="exp-role">{exp.role}</h3>
                    <h4 className="exp-company">{exp.company}</h4>
                  </div>
                </div>

                <div className="exp-meta">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{exp.period}</span>
                  </div>
                </div>

                <ul className="exp-bullets">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="exp-bullet-item">
                      <span className="bullet-indicator">&gt;</span>
                      <p>{bullet}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
