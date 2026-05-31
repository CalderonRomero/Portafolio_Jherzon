import React, { useEffect, useRef } from 'react';
import './BackgroundNetwork.css';

const BackgroundNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const maxParticles = Math.min(85, Math.floor((width * height) / 22000));
    const connectionDist = 160; // Slightly increased connection distance
    const mouse = { x: null, y: null, radius: 180 };
    const pulses = [];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.radius = Math.random() * 1.8 + 1.2;
        this.neighbors = [];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around instead of bouncing for a smoother infinite flow
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Subtle mouse draw attraction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= dx * force * 0.015;
            this.y -= dy * force * 0.015;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'; // Clearer nodes
        ctx.fill();
        
        // Draw a tiny glowing core inside the node
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
      }
    }

    class Pulse {
      constructor(fromPart, toPart) {
        this.from = fromPart;
        this.to = toPart;
        this.progress = 0;
        this.speed = Math.random() * 0.012 + 0.008; // smooth travel speed
      }

      update() {
        this.progress += this.speed;
        return this.progress < 1;
      }

      draw() {
        const x = this.from.x + (this.to.x - this.from.x) * this.progress;
        const y = this.from.y + (this.to.y - this.from.y) * this.progress;

        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'; // bright active synapse pulse
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
        ctx.shadowBlur = 0; // reset glow
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    const drawConnections = () => {
      // Clear neighbors list for this frame
      particles.forEach(p => p.neighbors = []);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.28; // Brighter and clearer connection lines
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Populate neighbors lists for pulse spawning
            particles[i].neighbors.push(particles[j]);
            particles[j].neighbors.push(particles[i]);
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Update and draw particles/nodes
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // 2. Draw connections and populate neighbors
      drawConnections();

      // 3. Randomly spawn active synaptic pulses
      particles.forEach((p) => {
        if (p.neighbors.length > 0 && Math.random() < 0.002) { // organical trigger rate
          const target = p.neighbors[Math.floor(Math.random() * p.neighbors.length)];
          if (pulses.length < 50) {
            pulses.push(new Pulse(p, target));
          }
        }
      });

      // 4. Update and draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        if (pulse.update()) {
          pulse.draw();
        } else {
          pulses.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="global-bg-network" />;
};

export default BackgroundNetwork;
