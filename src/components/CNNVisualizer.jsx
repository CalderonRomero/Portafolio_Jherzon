import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, HelpCircle, ShieldAlert, Cpu } from 'lucide-react';
import { cnnModels } from '../utils/cnnSimData';
import './CNNVisualizer.css';

const getSampleImagePath = (type) => {
  if (type === 'healthy-leaf') return '/images/healthy_potato_leaf.png';
  if (type === 'tizon-leaf' || type === 'rust-leaf') return '/images/blight_potato_leaf.png';
  if (type === 'mildew-leaf') return '/images/mildew_quinoa_leaf.png';
  if (type === 'blurry-image' || type === 'blurry-leaf') return '/images/blurry_leaf.png';
  if (type === 'benign-nevus' || type === 'benign') return '/images/benign_nevus.png';
  if (type === 'malignant-melanoma' || type === 'malignant') return '/images/malignant_melanoma.png';
  if (type === 'healthy-tooth') return '/images/healthy_tooth_xray.png';
  if (type === 'caries-tooth' || type === 'active-caries') return '/images/caries_tooth_xray.png';
  return '';
};

// Render real photograph preview instead of SVG vectors
const SampleImage = ({ type, size = 110 }) => {
  const src = getSampleImagePath(type);
  if (!src) return null;

  return (
    <img 
      src={src} 
      alt={type} 
      width={size} 
      height={size} 
      style={{
        objectFit: 'cover',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'block',
        margin: '0 auto',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
      }} 
    />
  );
};

// 3x3 Kernels for Convolution
const KERNELS = {
  ridge: [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1]
  ],
  sobelX: [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ],
  sobelY: [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
  ],
  sharpen: [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
  ],
  emboss: [
    [-2, -1, 0],
    [-1, 1, 1],
    [0, 1, 2]
  ]
};

const CNNVisualizer = () => {
  const [activeModelIdx, setActiveModelIdx] = useState(0);
  const [sampleIdx, setSampleIdx] = useState(0);
  const [selectedSample, setSelectedSample] = useState(null);
  
  // Simulator states
  const [simStatus, setSimStatus] = useState('idle'); // idle, checking, running, finished, error
  const [qualityLogs, setQualityLogs] = useState([]);
  const [activeLayer, setActiveLayer] = useState(0);
  const [inferenceResults, setInferenceResults] = useState([]);

  // Virtual cursor state
  const [vCursor, setVCursor] = useState({ x: 0, y: 0, visible: false, clicking: false });

  const hiddenCanvasRef = useRef(null);
  const fMapRefs = useRef([]);

  const activeModel = cnnModels[activeModelIdx];

  // Sync sample when active model or sample index changes
  useEffect(() => {
    setSelectedSample(activeModel.samples[sampleIdx]);
    setVCursor({ x: 0, y: 0, visible: false, clicking: false });
    setSimStatus('idle');
  }, [activeModelIdx, sampleIdx]);

  // Confetti trigger removed to maintain standard Slate aesthetics as requested

  // Main automated simulation loop (act as a live video player)
  useEffect(() => {
    if (!selectedSample) return;

    let timer;

    if (simStatus === 'idle') {
      setQualityLogs([]);
      setActiveLayer(0);
      setInferenceResults([]);

      // Start virtual cursor at center-right
      setVCursor({ x: 450, y: 250, visible: true, clicking: false });

      // Glide cursor to active sample card
      const glideTimer = setTimeout(() => {
        setVCursor(prev => ({ ...prev, x: 180, y: 200 }));
      }, 100);

      // Perform cursor click ripple animation
      const clickTimer = setTimeout(() => {
        setVCursor(prev => ({ ...prev, clicking: true }));
      }, 900);

      // Advance to quality check and hide cursor
      timer = setTimeout(() => {
        setSimStatus('checking');
        setVCursor({ x: 0, y: 0, visible: false, clicking: false });
      }, 1100);

      return () => {
        clearTimeout(glideTimer);
        clearTimeout(clickTimer);
        clearTimeout(timer);
      };
    } 
    
    else if (simStatus === 'checking') {
      setQualityLogs(['check_blur_from_stream: Inicializando sensor óptico...']);
      
      const logTimer1 = setTimeout(() => {
        setQualityLogs(prev => [
          ...prev,
          `check_blur_from_stream: Analizando contraste y frecuencia de muestra [${selectedSample.name}]...`
        ]);
      }, 400);

      const logTimer2 = setTimeout(() => {
        if (selectedSample.qualityPass) {
          setQualityLogs(prev => [
            ...prev,
            'check_blur_from_stream: Varianza Laplaciana = 245.8 (Umbral > 100).',
            'check_blur_from_stream: Control de calidad APROBADO.'
          ]);
        } else {
          setQualityLogs(prev => [
            ...prev,
            'check_blur_from_stream: Varianza Laplaciana = 42.6 (Umbral > 100).',
            'ERROR check_blur_from_stream: Descarte automático por borrosidad de captura.'
          ]);
        }
      }, 950);

      timer = setTimeout(() => {
        if (selectedSample.qualityPass) {
          setSimStatus('running');
        } else {
          setSimStatus('error');
        }
      }, 1800);

      return () => {
        clearTimeout(logTimer1);
        clearTimeout(logTimer2);
        clearTimeout(timer);
      };
    } 
    
    else if (simStatus === 'running') {
      let currentLayer = 0;
      const layerInterval = setInterval(() => {
        if (currentLayer >= activeModel.layers.length - 1) {
          clearInterval(layerInterval);
          setSimStatus('finished');
        } else {
          currentLayer++;
          setActiveLayer(currentLayer);
        }
      }, 800);

      return () => clearInterval(layerInterval);
    } 
    
    else if (simStatus === 'finished') {
      setInferenceResults(selectedSample.expectedOutput);

      timer = setTimeout(() => {
        moveToNextSample();
      }, 5000);
    } 
    
    else if (simStatus === 'error') {
      timer = setTimeout(() => {
        moveToNextSample();
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [simStatus, selectedSample]);

  const moveToNextSample = () => {
    setSampleIdx((prev) => (prev + 1) % activeModel.samples.length);
  };

  const handleModelChange = (idx) => {
    setActiveModelIdx(idx);
    setSampleIdx(0);
    setVCursor({ x: 0, y: 0, visible: false, clicking: false });
  };

  // Run feature maps convolution
  useEffect(() => {
    if (simStatus === 'running' || simStatus === 'finished') {
      applyConvolutionToFeatureMaps();
    }
  }, [selectedSample, simStatus]);

  const applyConvolutionToFeatureMaps = () => {
    const hidden = hiddenCanvasRef.current;
    if (!hidden) return;
    const hCtx = hidden.getContext('2d');
    hCtx.clearRect(0, 0, hidden.width, hidden.height);

    if (selectedSample) {
      const src = getSampleImagePath(selectedSample.type);
      if (src) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
          hCtx.drawImage(img, 0, 0, hidden.width, hidden.height);
          
          try {
            const imgData = hCtx.getImageData(0, 0, hidden.width, hidden.height);
            const kernels = [
              KERNELS.ridge,
              KERNELS.sobelX,
              KERNELS.sobelY,
              KERNELS.sharpen,
              KERNELS.emboss,
              KERNELS.ridge,
              KERNELS.sharpen,
              KERNELS.sobelY
            ];

            fMapRefs.current.forEach((canvas, idx) => {
              if (!canvas) return;
              const ctx = canvas.getContext('2d');
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              const kernel = kernels[idx] || KERNELS.ridge;
              const outputData = convolve(imgData, kernel);
              ctx.putImageData(outputData, 0, 0);
            });
          } catch (e) {
            console.error("Error executing convolve algorithm:", e);
          }
        };
      }
    }
  };

  const convolve = (imgData, kernel) => {
    const width = imgData.width;
    const height = imgData.height;
    const src = imgData.data;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const output = ctx.createImageData(width, height);
    const dst = output.data;

    const kSize = 3;
    const halfK = 1;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0;

        for (let ky = 0; ky < kSize; ky++) {
          for (let kx = 0; kx < kSize; kx++) {
            const px = Math.min(width - 1, Math.max(0, x + kx - halfK));
            const py = Math.min(height - 1, Math.max(0, y + ky - halfK));
            const srcIdx = (py * width + px) * 4;
            const weight = kernel[ky][kx];

            r += src[srcIdx] * weight;
            g += src[srcIdx + 1] * weight;
            b += src[srcIdx + 2] * weight;
          }
        }

        const dstIdx = (y * width + x) * 4;
        dst[dstIdx] = Math.min(255, Math.max(0, r + 20));
        dst[dstIdx + 1] = Math.min(255, Math.max(0, g + 80));
        dst[dstIdx + 2] = Math.min(255, Math.max(0, b + 150));
        dst[dstIdx + 3] = 255;
      }
    }
    return output;
  };

  // drawMockSampleOnCanvas removed as we draw real photos onto the processing canvas now.

  return (
    <section id="cnn-sim" className="section cnn-section">
      <div className="container">
        <h2 className="section-title">Visualizador Convolucional (CNN)</h2>
        <p className="section-subtitle">
          Simulación en tiempo real del procesamiento de tensores y flujo de feature maps en visión artificial.
        </p>

        {/* Models selector */}
        <div className="model-tabs glass-panel">
          {cnnModels.map((model, idx) => (
            <button 
              key={model.id}
              className={`tab-btn ${activeModelIdx === idx ? 'tab-btn-active' : ''}`}
              onClick={() => handleModelChange(idx)}
            >
              {model.title}
              <span className="tab-accuracy">{model.accuracy} Acc</span>
            </button>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid-cnn-dashboard" style={{ position: 'relative' }}>
          
          {/* Simulated Virtual Cursor */}
          {vCursor.visible && (
            <div 
              style={{
                position: 'absolute',
                left: vCursor.x,
                top: vCursor.y + 40, // offset below header
                pointerEvents: 'none',
                zIndex: 9999,
                transition: 'left 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), top 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)',
                transform: vCursor.clicking ? 'scale(0.82)' : 'scale(1)',
                transformOrigin: 'top left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="#ffffff" 
                stroke="#000000" 
                strokeWidth="1.5"
              >
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l5.05-5.05 4.5 4.5c.19.19.51.19.7 0l2.12-2.12c.19-.19.19-.51 0-.7l-4.5-4.5 5.05-5.05c.32-.32.09-.85-.35-.85H5.85a.5.5 0 0 0-.35.5z" />
              </svg>
              {vCursor.clicking && (
                <span 
                  style={{
                    position: 'absolute',
                    left: '-3px',
                    top: '-3px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    animation: 'clickRipple 0.3s ease-out',
                    pointerEvents: 'none'
                  }}
                />
              )}
            </div>
          )}

          {/* Column 1: Input controls (Fully automated slideshow) */}
          <div className="cnn-column glass-panel">
            <div className="col-header">
              <span className="col-num">01</span>
              <h3>Muestra Evaluada</h3>
            </div>

            <div className="input-viewer" style={{ minHeight: '320px' }}>
              {selectedSample && (
                <div className="sample-active-container">
                  <div className="sample-card-active" style={{ border: '1px solid var(--accent-border)', padding: '16px', borderRadius: '6px', background: 'rgba(0, 0, 0, 0.3)' }}>
                    <div className="sample-svg-container" style={{ width: '120px', height: '120px', margin: '0 auto 16px' }}>
                      <SampleImage type={selectedSample.svgPath} size={110} />
                    </div>
                    <div className="sample-info" style={{ textAlign: 'center' }}>
                      <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '6px' }}>{selectedSample.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{selectedSample.description}</p>
                      
                      <div className="simulation-live-badge" style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', padding: '3px 8px', borderRadius: '3px', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.05)' }}>
                        <span className="spinner-loader" style={{ width: '10px', height: '10px', borderWidth: '1px', borderTopColor: '#3b82f6' }}></span>
                        <span>SIMULACIÓN EN EJECUCIÓN</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <canvas ref={hiddenCanvasRef} width={64} height={64} style={{ display: 'none' }} />
          </div>

          {/* Column 2: Convolutional pipeline */}
          <div className="cnn-column glass-panel network-viewer-col">
            <div className="col-header">
              <span className="col-num">02</span>
              <h3>Flujo Convolucional Interno</h3>
            </div>

            <div className="network-flow">
              <div className="layer-labels">
                {activeModel.layers.map((layer, idx) => (
                  <span 
                    key={idx} 
                    className={`layer-label-item ${activeLayer === idx && simStatus === 'running' ? 'layer-active-text' : ''}`}
                  >
                    {layer.name} <span className="layer-size-badge">{layer.size}</span>
                  </span>
                ))}
              </div>

              <div className="network-layers-graphic">
                <AnimatePresence mode="wait">
                  {simStatus === 'idle' ? (
                    <motion.div 
                      className="quality-checker-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="spinner-loader"></div>
                      <div className="checker-logs">
                        <div className="log-line font-mono">&gt; check_blur_from_stream: Cargando muestra...</div>
                      </div>
                    </motion.div>
                  ) : simStatus === 'checking' ? (
                    <motion.div 
                      className="quality-checker-screen"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="spinner-loader"></div>
                      <div className="checker-logs">
                        {qualityLogs.map((log, idx) => (
                          <div key={idx} className="log-line font-mono">
                            {log.startsWith('ERROR') ? (
                              <span className="text-red">! {log}</span>
                            ) : log.includes('APROBADO') ? (
                              <span className="text-green">✓ {log}</span>
                            ) : (
                              <span>&gt; {log}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : simStatus === 'error' ? (
                    <motion.div 
                      className="quality-checker-screen failed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <ShieldAlert size={36} className="text-red" />
                      <h4>Error de Preprocesamiento</h4>
                      <p className="err-desc text-center">
                        Imagen borrosa o de bajo contraste descartada en la rutina `check_blur_from_stream`.
                      </p>
                      <div className="checker-logs" style={{ height: '70px', marginTop: '10px' }}>
                        {qualityLogs.map((log, idx) => (
                          <div key={idx} className="log-line font-mono">
                            <span className="text-red">! {log}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="layers-visual-container"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="feature-maps-container">
                        <div className="fmaps-header">
                          <h4>Feature Maps (Espacio Matricial Conv2D)</h4>
                          <span className="info-tooltip">
                            <HelpCircle size={12} />
                            <span className="tooltip-text">Mapas bidimensionales resultantes de aplicar los filtros del tensor convolucional.</span>
                          </span>
                        </div>
                        
                        <div className="fmaps-grid">
                          {Array.from({ length: 8 }).map((_, idx) => (
                            <div key={idx} className="fmap-card">
                              <canvas 
                                ref={(el) => (fMapRefs.current[idx] = el)}
                                width={64} 
                                height={64} 
                                className="fmap-canvas"
                              />
                              <span className="fmap-label">Map #{idx + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="dense-layer-simulation">
                        <h4>Aplanamiento & Nodos Densos</h4>
                        <div className="dense-nodes-container">
                          <div className="dense-group input-nodes">
                            {Array.from({ length: 4 }).map((_, idx) => (
                              <span key={idx} className="dense-node"></span>
                            ))}
                          </div>
                          
                          <div className="dense-synapses">
                            <svg className="synapse-wires">
                              <line x1="5%" y1="20%" x2="95%" y2="50%" className="synapse-pulse" stroke="var(--accent-secondary)" strokeWidth="0.8" />
                              <line x1="5%" y1="50%" x2="95%" y2="20%" className="synapse-pulse" stroke="var(--accent-secondary)" strokeWidth="0.8" />
                              <line x1="5%" y1="80%" x2="95%" y2="80%" className="synapse-pulse" stroke="var(--accent-primary)" strokeWidth="0.8" />
                            </svg>
                          </div>

                          <div className="dense-group output-nodes">
                            {Array.from({ length: 2 }).map((_, idx) => (
                              <span key={idx} className="dense-node dense-node-violet"></span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Column 3: Predictions / Outputs */}
          <div className="cnn-column glass-panel">
            <div className="col-header">
              <span className="col-num">03</span>
              <h3>Resultado Estadístico</h3>
            </div>

            <div className="results-container">
              {simStatus === 'idle' || simStatus === 'checking' || simStatus === 'error' ? (
                <div className="results-placeholder">
                  {simStatus === 'checking' ? (
                    <div className="inference-spinner-container">
                      <div className="inference-spinner"></div>
                      <p className="text-center" style={{ fontSize: '0.78rem' }}>Ejecutando filtros laplacianos y de normalización...</p>
                    </div>
                  ) : simStatus === 'error' ? (
                    <div className="results-waiting">
                      <ShieldAlert size={24} className="text-red" />
                      <p className="text-center text-red" style={{ fontSize: '0.78rem' }}>Muestra rechazada por el filtro de calidad.</p>
                    </div>
                  ) : (
                    <div className="inference-spinner-container">
                      <div className="inference-spinner"></div>
                      <p className="text-center" style={{ fontSize: '0.78rem' }}>Inicializando procesamiento tensor...</p>
                    </div>
                  )}
                </div>
              ) : simStatus === 'running' ? (
                <div className="inference-spinner-container">
                  <div className="inference-spinner"></div>
                  <p style={{ fontSize: '0.78rem' }}>Inferencia activa...</p>
                  <span className="console-log-text">Capa activa: {activeModel.layers[activeLayer]?.name}</span>
                </div>
              ) : (
                <motion.div 
                  className="results-active"
                  style={{ width: '100%' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="prediction-box">
                    <span className="prediction-heading">Clasificación Máxima</span>
                    <span className="prediction-val">
                      {inferenceResults[0]?.label}
                    </span>
                    <span className="prediction-prob">
                      {inferenceResults[0]?.value}% Confianza
                    </span>
                  </div>

                  <div className="probabilities-chart">
                    <h4>Distribución de Densidades (Softmax)</h4>
                    <div className="bars-list">
                      {inferenceResults.map((res, idx) => (
                        <div key={idx} className="bar-item">
                          <div className="bar-labels">
                            <span className="bar-name">{res.label}</span>
                            <span className="bar-pct font-mono">{res.value}%</span>
                          </div>
                          <div className="bar-track">
                            <motion.div 
                              className={`bar-fill ${idx === 0 ? 'bar-fill-primary' : ''}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${res.value}%` }}
                              transition={{ duration: 0.6 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="research-metrics-card">
                    <div className="metrics-header">
                      <FileText size={14} className="text-cyan" />
                      <h4>Métricas del Modelo</h4>
                    </div>
                    <div className="metrics-grid">
                      <div className="metric-cell">
                        <span className="cell-lbl">Precisión Global</span>
                        <span className="cell-val text-green">{activeModel.accuracy}</span>
                      </div>
                      <div className="metric-cell">
                        <span className="cell-lbl">Validación</span>
                        <span className="cell-val">{activeModel.metric.split(': ')[1]?.split(' ')[0] || activeModel.accuracy}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Representational notice to satisfy formal requirements */}
            <div className="representational-notice text-left font-sans">
              <span className="notice-heading">Visualizador de Visión Artificial</span>
              <p>
                Este módulo simula la descomposición espacial y convolución de imágenes en tiempo real. Ilustra cómo la red convolucional extrae bordes y texturas del tensor de entrada a través de sus filtros.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CNNVisualizer;
