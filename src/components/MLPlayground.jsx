import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, PlusCircle, RefreshCw } from 'lucide-react';
import {
  generateRandomPoints,
  initCentroids,
  runKMeansStep,
  costFunction,
  gradient,
  mapCoordToPixel,
  getClusterColor
} from '../utils/mlAlgorithms';
import './MLPlayground.css';

const MLPlayground = () => {
  const [activeTab, setActiveTab] = useState('kmeans');

  // Dynamic canvas width sizing
  const containerRef = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(600);

  // K-Means states
  const [k, setK] = useState(3);
  const [pointCount, setPointCount] = useState(120);
  const [kmPoints, setKmPoints] = useState([]);
  const [kmCentroids, setKmCentroids] = useState([]);
  const [kmStepCount, setKmStepCount] = useState(0);
  const [kmConverged, setKmConverged] = useState(false);
  const [kmStatus, setKmStatus] = useState('idle'); // idle, running, finished

  // Gradient Descent states
  const [lr, setLr] = useState(0.2);
  const [gdStartX, setGdStartX] = useState(-4.2);
  const [gdSteps, setGdSteps] = useState([]);
  const [gdCurrentStep, setGdCurrentStep] = useState(0);
  const [gdStatus, setGdStatus] = useState('idle'); // idle, running, finished
  const [gdOutcome, setGdOutcome] = useState('');
  const [gdCaseIdx, setGdCaseIdx] = useState(0);

  // Data Preprocessing states
  const [cleanPoints, setCleanPoints] = useState([]);
  const [cleanRegression, setCleanRegression] = useState({ m: 0, b: 0, mse: 0 });
  const [cleanStatus, setCleanStatus] = useState('idle'); // idle, playing, success

  // Virtual cursor state
  const [vCursor, setVCursor] = useState({ x: 0, y: 0, visible: false, clicking: false });

  // Refs for synchronous data updates to prevent React state race conditions
  const kmDataRef = useRef({ points: [], centroids: [] });
  const cleanDataRef = useRef({ points: [], regression: { m: 0, b: 0, mse: 0 } });

  const kmCanvasRef = useRef(null);
  const gdCanvasRef = useRef(null);
  const cleanCanvasRef = useRef(null);

  // Predefined optimization cases for Descenso de Gradiente simulation
  const gdCases = [
    { name: 'Convergencia Estándar (α = 0.25)', lr: 0.25, startX: -4.5, desc: 'Tasa de aprendizaje óptima. Convergencia limpia y directa hacia el mínimo global.' },
    { name: 'Convergencia Lenta (α = 0.05)', lr: 0.05, startX: 4.2, desc: 'Tasa de aprendizaje muy pequeña. El optimizador da pasos mínimos y tarda en converger.' },
    { name: 'Divergencia (α = 1.05)', lr: 1.05, startX: -1.5, desc: 'Tasa de aprendizaje excesiva. El modelo sobrepasa la curva de costo y rebota hacia el infinito.' },
    { name: 'Mínimo Local (α = 0.18)', lr: 0.18, startX: 3.8, desc: 'Atrapado en un pozo de potencial secundario debido a gradiente cercano a cero.' }
  ];

  // Resize handler to adjust canvas dimensions to match container width in real time
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        if (width > 0 && width !== canvasWidth) {
          setCanvasWidth(width);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [canvasWidth]);

  // Scale K-Means points when container width resizes
  const prevWidthRef = useRef(canvasWidth);
  useEffect(() => {
    const prevWidth = prevWidthRef.current;
    if (prevWidth !== canvasWidth && kmPoints.length > 0) {
      const ratio = canvasWidth / prevWidth;

      const scaledPoints = kmPoints.map(p => ({ ...p, x: p.x * ratio }));
      const scaledCentroids = kmCentroids.map(c => ({ ...c, x: c.x * ratio }));

      kmDataRef.current = { points: scaledPoints, centroids: scaledCentroids };
      setKmPoints(scaledPoints);
      setKmCentroids(scaledCentroids);
      prevWidthRef.current = canvasWidth;
    }
  }, [canvasWidth]);

  // Draw hooks
  useEffect(() => {
    if (activeTab === 'kmeans' && kmPoints.length > 0) {
      drawKMeans();
    }
  }, [kmPoints, kmCentroids, canvasWidth, activeTab]);

  useEffect(() => {
    if (activeTab === 'gd') {
      drawGD();
    }
  }, [lr, gdStartX, gdSteps, gdCurrentStep, canvasWidth, activeTab]);

  useEffect(() => {
    if (activeTab === 'clean' && cleanPoints.length > 0) {
      drawCleanGame();
    }
  }, [cleanPoints, cleanRegression, canvasWidth, activeTab]);

  // Reset logic when tab changes
  useEffect(() => {
    setVCursor({ x: 0, y: 0, visible: false, clicking: false });
    if (activeTab === 'kmeans') {
      setKmStatus('idle');
    } else if (activeTab === 'gd') {
      setGdStatus('idle');
      setGdCaseIdx(0);
    } else if (activeTab === 'clean') {
      setCleanStatus('idle');
    }
  }, [activeTab]);

  // 1. K-Means Automated Loop (Controlled via kmStatus only)
  useEffect(() => {
    if (activeTab !== 'kmeans') return;

    let timer;

    if (kmStatus === 'idle') {
      const nextK = Math.floor(Math.random() * 3) + 3;
      setK(nextK);
      const w = canvasWidth;
      const h = 380;
      const points = generateRandomPoints(120, w, h);
      const centroids = initCentroids(nextK, w, h, points);

      kmDataRef.current = { points, centroids };
      setKmPoints(points);
      setKmCentroids(centroids);
      setKmStepCount(0);
      setKmConverged(false);

      timer = setTimeout(() => {
        setKmStatus('running');
      }, 1500);
    }

    else if (kmStatus === 'running') {
      const runStep = () => {
        const { points, centroids } = kmDataRef.current;
        const result = runKMeansStep(points, centroids);

        kmDataRef.current = { points: result.points, centroids: result.centroids };
        setKmPoints(result.points);
        setKmCentroids(result.centroids);

        if (result.converged) {
          setKmConverged(true);
          setKmStatus('finished');
        } else {
          setKmStepCount(prev => prev + 1);
          timer = setTimeout(runStep, 800);
        }
      };

      timer = setTimeout(runStep, 800);
    }

    else if (kmStatus === 'finished') {
      timer = setTimeout(() => {
        setKmStatus('idle');
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [kmStatus, activeTab, canvasWidth]);

  // 2. Gradient Descent Automated Loop
  useEffect(() => {
    if (activeTab !== 'gd') return;

    let timer;

    if (gdStatus === 'idle') {
      const activeCase = gdCases[gdCaseIdx];
      setLr(activeCase.lr);
      setGdStartX(activeCase.startX);
      setGdCurrentStep(0);

      const steps = calculateGDStepsFor(activeCase.startX, activeCase.lr);
      setGdSteps(steps);

      timer = setTimeout(() => {
        setGdStatus('running');
      }, 1500);
    }

    else if (gdStatus === 'running') {
      const runGdStep = () => {
        setGdCurrentStep(prev => {
          if (prev >= gdSteps.length - 1) {
            setGdStatus('finished');
            return prev;
          } else {
            timer = setTimeout(runGdStep, 200);
            return prev + 1;
          }
        });
      };
      timer = setTimeout(runGdStep, 200);
    }

    else if (gdStatus === 'finished') {
      timer = setTimeout(() => {
        setGdCaseIdx(prev => (prev + 1) % gdCases.length);
        setGdStatus('idle');
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [gdStatus, activeTab, gdCaseIdx]);

  // 3. Data Preprocessing Automated Loop (With Virtual Cursor Simulation)
  useEffect(() => {
    if (activeTab !== 'clean') return;

    let timer;

    if (cleanStatus === 'idle') {
      initCleanGame();
    }

    else if (cleanStatus === 'playing') {
      const cleanNextOutlier = () => {
        const { points } = cleanDataRef.current;
        const nextOutlier = points.find(p => p.isOutlier && !p.isCleaned);

        if (nextOutlier) {
          const canvas = cleanCanvasRef.current;
          if (canvas) {
            const w = canvas.width;
            const h = canvas.height;
            const pt = mapCleanCoordToPixel(nextOutlier.x, nextOutlier.y, w, h);

            // Move cursor to target outlier
            setVCursor({ x: pt.x, y: pt.y, visible: true, clicking: false });

            // Wait for 800ms glide, then animate mouse down
            timer = setTimeout(() => {
              setVCursor(prev => ({ ...prev, clicking: true }));

              // Wait 200ms click ripple, then execute outlier removal
              timer = setTimeout(() => {
                const nextOutlierIdx = points.findIndex(p => p.id === nextOutlier.id);
                if (nextOutlierIdx !== -1) {
                  const updatedPoints = [...points];
                  updatedPoints[nextOutlierIdx] = { ...updatedPoints[nextOutlierIdx], isCleaned: true };

                  const activePoints = updatedPoints.filter(p => !p.isOutlier || !p.isCleaned);
                  const reg = calculateRegression(activePoints);

                  cleanDataRef.current = { points: updatedPoints, regression: reg };
                  setCleanPoints(updatedPoints);
                  setCleanRegression(reg);

                  const remainingOutliers = updatedPoints.filter(p => p.isOutlier && !p.isCleaned);
                  if (remainingOutliers.length === 0) {
                    setCleanStatus('success');
                    setVCursor({ x: w / 2, y: h / 2, visible: false, clicking: false });
                  } else {
                    setVCursor(prev => ({ ...prev, clicking: false }));
                    timer = setTimeout(cleanNextOutlier, 500); // 500ms pause before moving next
                  }
                }
              }, 200);
            }, 800);
          }
        } else {
          setCleanStatus('success');
        }
      };

      const canvas = cleanCanvasRef.current;
      if (canvas) {
        setVCursor({ x: canvas.width / 2, y: canvas.height / 2, visible: true, clicking: false });
      }
      timer = setTimeout(cleanNextOutlier, 500);
    }

    else if (cleanStatus === 'success') {
      timer = setTimeout(() => {
        setCleanStatus('idle');
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [cleanStatus, activeTab, canvasWidth]);

  const drawKMeans = () => {
    const canvas = kmCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020202';
    ctx.fillRect(0, 0, w, h);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 30) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
    }

    // Centroid connectors
    if (kmCentroids.length > 1) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      for (let i = 0; i < kmCentroids.length; i++) {
        for (let j = i + 1; j < kmCentroids.length; j++) {
          ctx.beginPath();
          ctx.moveTo(kmCentroids[i].x, kmCentroids[i].y);
          ctx.lineTo(kmCentroids[j].x, kmCentroids[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw points
    kmPoints.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = p.clusterId === -1 ? '#475569' : getClusterColor(p.clusterId);
      ctx.fill();
    });

    // Centroids
    kmCentroids.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(c.x - 6, c.y); ctx.lineTo(c.x + 6, c.y);
      ctx.moveTo(c.x, c.y - 6); ctx.lineTo(c.x, c.y + 6);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(c.x, c.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.fill();
    });
  };

  const calculateGDStepsFor = (startX, stepSize) => {
    const steps = [startX];
    let currX = startX;
    let maxSteps = 30;
    let outcome = 'normal';

    for (let i = 0; i < maxSteps; i++) {
      const grad = gradient(currX);
      const nextX = currX - stepSize * grad;

      if (Math.abs(nextX) > 10) {
        outcome = 'divergent';
        steps.push(nextX > 0 ? 7 : -7);
        break;
      }

      if (Math.abs(nextX - currX) < 0.001) {
        break;
      }

      currX = nextX;
      steps.push(currX);
    }

    const finalX = steps[steps.length - 1];
    if (outcome !== 'divergent' && Math.abs(finalX - 0) > 1 && Math.abs(gradient(finalX)) < 0.01) {
      outcome = 'local-min';
    }

    setGdOutcome(outcome);
    return steps;
  };

  const drawGD = () => {
    const canvas = gdCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020202';
    ctx.fillRect(0, 0, w, h);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 30) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
    }

    // Function Curve
    ctx.beginPath();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.5;
    for (let mathX = -6; mathX <= 6; mathX += 0.05) {
      const mathY = costFunction(mathX);
      const pixel = mapCoordToPixel(mathX, mathY, w, h);
      if (mathX === -6) {
        ctx.moveTo(pixel.x, pixel.y);
      } else {
        ctx.lineTo(pixel.x, pixel.y);
      }
    }
    ctx.stroke();

    // Trace path
    if (gdSteps.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([3, 3]);

      for (let i = 0; i <= gdCurrentStep; i++) {
        const xVal = gdSteps[i];
        const yVal = costFunction(xVal);
        const pixel = mapCoordToPixel(xVal, yVal, w, h);
        if (i === 0) {
          ctx.moveTo(pixel.x, pixel.y);
        } else {
          ctx.lineTo(pixel.x, pixel.y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Dots
      for (let i = 0; i <= gdCurrentStep; i++) {
        const xVal = gdSteps[i];
        const yVal = costFunction(xVal);
        const pixel = mapCoordToPixel(xVal, yVal, w, h);

        ctx.beginPath();
        ctx.arc(pixel.x, pixel.y, i === gdCurrentStep ? 6 : 3, 0, Math.PI * 2);
        ctx.fillStyle = i === gdCurrentStep ? '#ef4444' : '#3b82f6';
        ctx.fill();
      }
    }
  };

  const calculateRegression = (points) => {
    if (points.length < 2) return { m: 0, b: 0, mse: 0 };

    let sumX = 0;
    let sumY = 0;
    points.forEach(p => {
      sumX += p.x;
      sumY += p.y;
    });

    const meanX = sumX / points.length;
    const meanY = sumY / points.length;

    let numerator = 0;
    let denominator = 0;
    points.forEach(p => {
      numerator += (p.x - meanX) * (p.y - meanY);
      denominator += (p.x - meanX) * (p.x - meanX);
    });

    const m = denominator === 0 ? 0 : numerator / denominator;
    const b = meanY - m * meanX;

    let sumErrorSq = 0;
    points.forEach(p => {
      const predY = m * p.x + b;
      const err = p.y - predY;
      sumErrorSq += err * err;
    });
    const mse = sumErrorSq / points.length;

    return { m, b, mse };
  };

  const initCleanGame = () => {
    const points = [];
    // Linear base trend
    for (let i = 0; i < 25; i++) {
      const x = 1 + (i / 24) * 8;
      const y = 0.8 * x + 1.5 + (Math.random() - 0.5) * 0.4;
      points.push({
        id: `clean-${i}`,
        x,
        y,
        isOutlier: false,
        isCleaned: false
      });
    }

    // 5 outliers
    const outliers = [
      { id: 'out-1', x: 1.5, y: 8.5, isOutlier: true, isCleaned: false },
      { id: 'out-2', x: 3.5, y: 9.0, isOutlier: true, isCleaned: false },
      { id: 'out-3', x: 5.0, y: 1.2, isOutlier: true, isCleaned: false },
      { id: 'out-4', x: 7.2, y: 1.8, isOutlier: true, isCleaned: false },
      { id: 'out-5', x: 8.5, y: 9.5, isOutlier: true, isCleaned: false }
    ];

    const allPoints = [...points, ...outliers];
    const reg = calculateRegression(allPoints.filter(p => !p.isOutlier || !p.isCleaned));

    cleanDataRef.current = { points: allPoints, regression: reg };
    setCleanPoints(allPoints);
    setCleanRegression(reg);
    setCleanStatus('playing');
  };

  const handleCleanCanvasClick = (e) => {
    try {
      if (cleanStatus !== 'playing') return;
      const canvas = cleanCanvasRef.current;
      if (!canvas) return;

      const { points } = cleanDataRef.current;
      if (!points || points.length === 0) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width > 0 ? (canvas.width / rect.width) : 1;
      const scaleY = rect.height > 0 ? (canvas.height / rect.height) : 1;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      const w = canvas.width;
      const h = canvas.height;

      let clickedAnyOutlier = false;
      const updatedPoints = points.map(p => {
        if (p.isOutlier && !p.isCleaned) {
          const screenPt = mapCleanCoordToPixel(p.x, p.y, w, h);
          const dx = clickX - screenPt.x;
          const dy = clickY - screenPt.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 18) { // Click hit target
            clickedAnyOutlier = true;
            return { ...p, isCleaned: true };
          }
        }
        return p;
      });

      if (clickedAnyOutlier) {
        const activePoints = updatedPoints.filter(p => !p.isOutlier || !p.isCleaned);
        const reg = calculateRegression(activePoints);

        cleanDataRef.current = { points: updatedPoints, regression: reg };
        setCleanPoints(updatedPoints);
        setCleanRegression(reg);

        const remainingOutliers = updatedPoints.filter(p => p.isOutlier && !p.isCleaned);
        if (remainingOutliers.length === 0) {
          setCleanStatus('success');
          setVCursor({ x: w / 2, y: h / 2, visible: false, clicking: false });
        }
      }
    } catch (err) {
      console.error("Error in click handler:", err);
    }
  };

  const mapCleanCoordToPixel = (x, y, w, h) => {
    const margin = 40;
    const px = margin + (x / 10) * (w - 2 * margin);
    const py = h - margin - (y / 10) * (h - 2 * margin);
    return { x: px, y: py };
  };

  const drawCleanGame = () => {
    const canvas = cleanCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#020202';
    ctx.fillRect(0, 0, w, h);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 30) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
    }

    // Draw regression line
    const { m, b } = cleanRegression;
    const pt1 = mapCleanCoordToPixel(0, b, w, h);
    const pt2 = mapCleanCoordToPixel(10, m * 10 + b, w, h);

    ctx.beginPath();
    ctx.moveTo(pt1.x, pt1.y);
    ctx.lineTo(pt2.x, pt2.y);
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw points
    cleanPoints.forEach(p => {
      const pt = mapCleanCoordToPixel(p.x, p.y, w, h);

      if (p.isOutlier) {
        if (!p.isCleaned) {
          // Uncleaned outlier: Red glowing point
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#ef4444';
          ctx.fill();

          // Outer glowing ring
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 12, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          // Cleaned outlier: faint green point
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(34, 197, 94, 0.35)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      } else {
        // Normal point
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fill();
      }
    });
  };

  const getRemainingOutliers = () => {
    return cleanPoints.filter(p => p.isOutlier && !p.isCleaned).length;
  };

  return (
    <section id="ml-playground" className="section ml-section">
      <div className="container">
        <h2 className="section-title">Algoritmos & Laboratorio ML</h2>
        <p className="section-subtitle">
          Simulaciones autónomas en tiempo real de modelos de clustering, optimización convexa e integridad de datos.
        </p>

        <div className="ml-tabs">
          <button
            className={`ml-tab-btn ${activeTab === 'kmeans' ? 'ml-tab-btn-active' : ''}`}
            onClick={() => setActiveTab('kmeans')}
          >
            K-Means Clustering
          </button>
          <button
            className={`ml-tab-btn ${activeTab === 'gd' ? 'ml-tab-btn-active' : ''}`}
            onClick={() => setActiveTab('gd')}
          >
            Descenso de Gradiente
          </button>
          <button
            className={`ml-tab-btn ${activeTab === 'clean' ? 'ml-tab-btn-active' : ''}`}
            onClick={() => setActiveTab('clean')}
          >
            Limpieza de Datos (Integridad)
          </button>
        </div>

        <div className="ml-playground-container glass-panel" ref={containerRef} style={{ position: 'relative' }}>



          {activeTab === 'kmeans' ? (
            <div className="playground-layout">
              <div className="playground-canvas-area">
                <canvas
                  ref={kmCanvasRef}
                  width={canvasWidth}
                  height={380}
                  className="playground-canvas"
                  style={{ cursor: 'default' }}
                />
              </div>

              <div className="playground-sidebar">
                <h3>K-Means Activo</h3>

                <div className="algorithm-stats" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <h4>Parámetros de Simulación</h4>
                  <div className="stats-row">
                    <span>Clusters (K):</span>
                    <span className="stat-val font-mono">{k}</span>
                  </div>
                  <div className="stats-row">
                    <span>Densidad (N):</span>
                    <span className="stat-val font-mono">{pointCount}</span>
                  </div>
                </div>

                <div className="algorithm-stats">
                  <h4>Métricas de Estado</h4>
                  <div className="stats-row">
                    <span>Iteración actual:</span>
                    <span className="stat-val font-mono">{kmStepCount}</span>
                  </div>
                  <div className="stats-row">
                    <span>Convergencia:</span>
                    <span className={`stat-val font-mono ${kmConverged ? 'text-green' : 'text-amber'}`}>
                      {kmConverged ? 'ALCANZADA (ESTABLE)' : 'CALCULANDO...'}
                    </span>
                  </div>
                </div>

                <div className="sidebar-actions" style={{ marginTop: 'auto' }}>
                  <div className="simulation-live-badge" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', padding: '6px', borderRadius: '3px', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981', background: 'rgba(16, 185, 129, 0.05)' }}>
                    <span className="spinner-loader" style={{ width: '10px', height: '10px', borderWidth: '1px', borderTopColor: '#10b981' }}></span>
                    <span>CICLO DE SIMULACIÓN ACTIVO</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'gd' ? (
            <div className="playground-layout">
              <div className="playground-canvas-area">
                <canvas
                  ref={gdCanvasRef}
                  width={canvasWidth}
                  height={380}
                  className="playground-canvas"
                  style={{ cursor: 'default' }}
                />
              </div>

              <div className="playground-sidebar">
                <h3>Descenso de Gradiente</h3>

                <div className="academic-quote-box" style={{ background: 'rgba(59, 130, 246, 0.02)', borderLeftColor: '#3b82f6' }}>
                  <p className="quote-text" style={{ fontStyle: 'normal', fontSize: '0.75rem' }}>
                    <strong>{gdCases[gdCaseIdx].name}</strong>: {gdCases[gdCaseIdx].desc}
                  </p>
                </div>

                <div className="algorithm-stats" style={{ background: 'rgba(0,0,0,0.3)', marginTop: '8px' }}>
                  <h4>Parámetros de Optimización</h4>
                  <div className="stats-row">
                    <span>Tasa de aprendizaje (α):</span>
                    <span className="stat-val font-mono">{lr}</span>
                  </div>
                  <div className="stats-row">
                    <span>Punto de partida (X₀):</span>
                    <span className="stat-val font-mono">{gdStartX.toFixed(2)}</span>
                  </div>
                </div>

                <div className="algorithm-stats">
                  <h4>Métricas del Descenso</h4>
                  <div className="stats-row">
                    <span>Pasos Calculados:</span>
                    <span className="stat-val font-mono">{gdCurrentStep}</span>
                  </div>
                  <div className="stats-row">
                    <span>Costo f(x):</span>
                    <span className="stat-val font-mono">
                      {gdSteps.length > 0 ? costFunction(gdSteps[gdCurrentStep]).toFixed(4) : costFunction(gdStartX).toFixed(4)}
                    </span>
                  </div>
                </div>

                <div className="outcome-alert-area" style={{ minHeight: '50px' }}>
                  <AnimatePresence mode="wait">
                    {gdOutcome === 'divergent' && gdStatus === 'finished' && (
                      <motion.div
                        className="gd-alert gd-alert-danger"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <AlertTriangle size={14} />
                        <div>
                          <strong>DIVERGENCIA DETECTADA</strong>
                          <p>La tasa de aprendizaje es muy alta. El optimizador desborda y explota hacia el infinito.</p>
                        </div>
                      </motion.div>
                    )}
                    {gdOutcome === 'local-min' && gdStatus === 'finished' && (
                      <motion.div
                        className="gd-alert gd-alert-warning"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <AlertTriangle size={14} />
                        <div>
                          <strong>MÍNIMO LOCAL DETECTADO</strong>
                          <p>El optimizador quedó atrapado en un valle secundario de la curva de costo.</p>
                        </div>
                      </motion.div>
                    )}
                    {gdStatus === 'finished' && gdOutcome === 'normal' && (
                      <motion.div
                        className="gd-alert gd-alert-success"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <CheckCircle size={14} />
                        <div>
                          <strong>CONVERGENCIA EXITOSA</strong>
                          <p>Se alcanzó satisfactoriamente el mínimo global de la curva.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            <div className="playground-layout">
              <div className="playground-canvas-area">
                <div className="canvas-interactive-tag">

                </div>
                <div style={{ position: 'relative', width: '100%', height: '380px' }}>
                  <canvas
                    ref={cleanCanvasRef}
                    width={canvasWidth}
                    height={380}
                    className="playground-canvas"
                    onClick={handleCleanCanvasClick}
                  />
                  {vCursor.visible && (
                    <div
                      style={{
                        position: 'absolute',
                        left: vCursor.x,
                        top: vCursor.y,
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
                </div>
              </div>

              <div className="playground-sidebar">
                <h3>Integridad de Datos</h3>

                {/* Deming Quote Box */}
                <div className="academic-quote-box">
                  <p className="quote-text">
                    "En Dios confiamos, todos los demás deben traer datos."
                  </p>
                  <span className="quote-author">— W. Edwards Deming</span>
                </div>

                <div className="algorithm-stats" style={{ background: 'rgba(0, 0, 0, 0.3)', marginTop: '8px' }}>
                  <h4>Métricas del Dataset</h4>
                  <div className="stats-row">
                    <span>Muestras Totales:</span>
                    <span className="stat-val font-mono">30</span>
                  </div>
                  <div className="stats-row">
                    <span>Outliers Restantes:</span>
                    <span className="stat-val font-mono text-red" style={{ color: getRemainingOutliers() > 0 ? '#ff5252' : '#05d59e' }}>
                      {getRemainingOutliers()} / 5
                    </span>
                  </div>
                  <div className="stats-row">
                    <span>Error Cuadrático Medio (MSE):</span>
                    <span className="stat-val font-mono text-green">
                      {cleanRegression.mse.toFixed(5)}
                    </span>
                  </div>
                </div>

                <div className="outcome-alert-area" style={{ minHeight: '60px' }}>
                  <AnimatePresence mode="wait">
                    {cleanStatus === 'playing' && (
                      <motion.div
                        className="gd-alert gd-alert-warning"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        key="playing"
                      >
                        <AlertTriangle size={14} />
                        <div>
                          <strong>PROCESANDO OUTLIERS...</strong>
                          <p>Eliminando puntos atípicos para purificar la muestra y estabilizar la pendiente en tiempo real.</p>
                        </div>
                      </motion.div>
                    )}
                    {cleanStatus === 'success' && (
                      <motion.div
                        className="gd-alert gd-alert-success"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        key="success"
                      >
                        <CheckCircle size={14} />
                        <div>
                          <strong>MODELO CONVERGIDO</strong>
                          <p className="font-mono" style={{ fontSize: '0.62rem', marginTop: '4px' }}>
                            [SUCCESS]: Preprocessing completed. MSE reduced to {cleanRegression.mse.toFixed(5)}. Model converges.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MLPlayground;
