import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [consoleLogs, setConsoleLogs] = useState([
    'System: Secure shell initialized.',
    'System: Port listeners active.',
    'System: Ready to buffer mail payloads.'
  ]);
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle, sending, success
  const logsContainerRef = useRef(null);
  const isInitialRender = useRef(true);

  const addLog = (logText) => {
    setConsoleLogs((prev) => [...prev, logText]);
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    const container = logsContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [consoleLogs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (value.length % 8 === 0 && value.length > 0) {
      addLog(`Buffer: Write operation [${name}] - size: ${value.length} bytes`);
    }
  };

  const handleCommandRun = (command) => {
    if (command === 'ping') {
      addLog('user@shell:~$ ping -c 2 yersson-calderon.ai');
      addLog('PING yersson-calderon.ai (172.217.171.206): 56 data bytes');
      setTimeout(() => addLog('64 bytes from 172.217.171.206: icmp_seq=1 ttl=64 time=12.2 ms'), 150);
      setTimeout(() => addLog('64 bytes from 172.217.171.206: icmp_seq=2 ttl=64 time=11.5 ms'), 300);
      setTimeout(() => addLog('--- yersson-calderon.ai ping statistics ---'), 400);
      setTimeout(() => addLog('2 packets transmitted, 2 received, 0% packet loss, time 1001ms'), 450);
    } else if (command === 'clear') {
      setConsoleLogs(['System: Terminal logs cleared.', 'System: Awaiting inputs...']);
    } else if (command === 'cv') {
      addLog('user@shell:~$ curl -O https://yersson-calderon.ai/CV-Yersson-Calderon.pdf');
      addLog('% Total    % Received % Xferd  Average Speed   Time    Time     Time  Current');
      addLog('                                 Dload  Upload   Total   Spent    Left  Speed');
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        addLog(`100  87k  100  ${progress}%   --:--:--  0:00:00  --:--:--  ${progress * 8}k`);
        if (progress >= 100) {
          clearInterval(interval);
          addLog('System: Transfer completed. Executing download.');
          const link = document.createElement('a');
          link.href = '/CV-Yersson-Calderon.pdf';
          link.download = 'CV-Yersson-Calderon.pdf';
          link.click();
        }
      }, 150);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addLog('System ERROR: Validation check failed. Payload rejected.');
      return;
    }

    setSubmitStatus('sending');
    addLog('user@shell:~$ mail -s "Contacto" mcjherzon7312@gmail.com < payload.json');
    addLog('SMTP: Connecting to mail relay (port 587)...');
    
    setTimeout(() => {
      addLog('SMTP: STARTTLS handshake completed successfully.');
    }, 450);

    setTimeout(() => {
      addLog(`SMTP: Loading packet envelope [From: ${formData.email}]`);
    }, 850);

    setTimeout(() => {
      addLog('SMTP: Delivering payload stream...');
    }, 1250);

    setTimeout(() => {
      addLog('SMTP: 250 OK Message accepted for delivery.');
      addLog('System: Mail process completed successfully.');
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 1700);
  };

  return (
    <section id="contacto" className="section contact-section">
      <div className="container">
        <h2 className="section-title">Terminal de Contacto</h2>
        <p className="section-subtitle">
          Canal formal de comunicación. Complete los parámetros del formulario o ejecute comandos directamente desde la terminal de diagnóstico.
        </p>

        <div className="contact-grid">
          
          {/* Column 1: Info and Form */}
          <div className="contact-form-area glass-panel">
            <div className="info-cards-row">
              <div className="info-cell">
                <Mail size={14} className="text-cyan" />
                <div>
                  <h4>Email</h4>
                  <a href="mailto:mcjherzon7312@gmail.com">mcjherzon7312@gmail.com</a>
                </div>
              </div>
              
              <div className="info-cell">
                <Phone size={14} className="text-violet" />
                <div>
                  <h4>Teléfono</h4>
                  <a href="tel:+51925271857">(+51) 925 271 857</a>
                </div>
              </div>

              <div className="info-cell">
                <MapPin size={14} className="text-cyan" />
                <div>
                  <h4>Ubicación</h4>
                  <span>Cusco - Perú</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="actual-form">
              <div className="form-group">
                <label>Nombre / Entidad</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name} 
                  onChange={handleInputChange}
                  placeholder="Ingrese su nombre o institución"
                  disabled={submitStatus === 'sending'}
                  required
                />
              </div>

              <div className="form-group">
                <label>Dirección de Correo</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email} 
                  onChange={handleInputChange}
                  placeholder="ejemplo@dominio.com"
                  disabled={submitStatus === 'sending'}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mensaje / Propuesta de Investigación</label>
                <textarea 
                  name="message"
                  rows="4" 
                  value={formData.message} 
                  onChange={handleInputChange}
                  placeholder="Detalle los objetivos del proyecto o consulta..."
                  disabled={submitStatus === 'sending'}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={submitStatus === 'sending'}
              >
                {submitStatus === 'sending' ? (
                  <>Enviando payload...</>
                ) : (
                  <>
                    <Send size={15} /> Transmitir Mensaje
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Column 2: Debug CLI Logger */}
          <div className="contact-console glass-panel">
            <div className="console-header">
              <div className="console-indicator">
                <Terminal size={12} className="console-icon" />
                <span>SHELL DE DIAGNÓSTICO</span>
              </div>
              <div className="console-commands">
                <button className="btn-terminal btn-sm" onClick={() => handleCommandRun('ping')}>ping</button>
                <button className="btn-terminal btn-sm" onClick={() => handleCommandRun('cv')}>get_cv</button>
                <button className="btn-terminal btn-sm" onClick={() => handleCommandRun('clear')}>clear</button>
              </div>
            </div>

            <div className="console-logs" ref={logsContainerRef}>
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="console-log-row font-mono">
                  <span className="log-arrow">&gt;</span>
                  <span className="log-text">{log}</span>
                </div>
              ))}
            </div>

            {submitStatus === 'success' && (
              <div className="console-status-toast success">
                <span>Message successfully routed over mail subsystem loop.</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
