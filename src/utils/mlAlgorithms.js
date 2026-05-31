// Helper calculations for ML Playground (K-Means & Gradient Descent)

// 1. K-Means Helpers
export const generateRandomPoints = (count, width, height) => {
  const points = [];
  // Generate points in 3-4 natural Gaussian-like clusters so K-Means looks beautiful
  const clusters = [
    { cx: width * 0.3, cy: height * 0.3, rx: width * 0.1, ry: height * 0.1 },
    { cx: width * 0.7, cy: height * 0.4, rx: width * 0.12, ry: height * 0.12 },
    { cx: width * 0.4, cy: height * 0.7, rx: width * 0.1, ry: height * 0.1 },
    { cx: width * 0.8, cy: height * 0.8, rx: width * 0.08, ry: height * 0.08 }
  ];

  for (let i = 0; i < count; i++) {
    const cluster = clusters[i % clusters.length];
    // Box-Muller transform for normal distribution approximation
    const u1 = Math.random() || 0.0001;
    const u2 = Math.random() || 0.0001;
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

    const px = cluster.cx + z0 * cluster.rx;
    const py = cluster.cy + z1 * cluster.ry;

    // Constrain within bounds
    points.push({
      x: Math.max(10, Math.min(width - 10, px)),
      y: Math.max(10, Math.min(height - 10, py)),
      clusterId: -1
    });
  }
  return points;
};

export const initCentroids = (k, width, height, points = []) => {
  const centroids = [];
  if (points.length >= k) {
    // K-Means++ style initial choice (choose from existing points to look spread out)
    const indices = new Set();
    while (indices.size < k) {
      indices.add(Math.floor(Math.random() * points.length));
    }
    indices.forEach(idx => {
      centroids.push({
        x: points[idx].x,
        y: points[idx].y,
        color: getClusterColor(centroids.length)
      });
    });
  } else {
    // Fallback random choice
    for (let i = 0; i < k; i++) {
      centroids.push({
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 40) + 20,
        color: getClusterColor(i)
      });
    }
  }
  return centroids;
};

export const getClusterColor = (index) => {
  const colors = [
    '#00f2fe', // Cyan
    '#8b5cf6', // Violet
    '#05d59e', // Emerald
    '#f59e0b', // Amber
    '#ff5252'  // Coral
  ];
  return colors[index % colors.length];
};

export const runKMeansStep = (points, centroids) => {
  let changed = false;

  // 1. Assign points to nearest centroid
  const newPoints = points.map(p => {
    let minDist = Infinity;
    let nearestId = -1;

    centroids.forEach((c, idx) => {
      const dx = p.x - c.x;
      const dy = p.y - c.y;
      const dist = dx * dx + dy * dy; // squared distance is enough
      if (dist < minDist) {
        minDist = dist;
        nearestId = idx;
      }
    });

    if (p.clusterId !== nearestId) {
      changed = true;
    }

    return { ...p, clusterId: nearestId };
  });

  // 2. Update centroids to mean of assigned points
  const newCentroids = centroids.map((c, idx) => {
    const assigned = newPoints.filter(p => p.clusterId === idx);
    if (assigned.length === 0) return c; // keep same if no points

    let sumX = 0;
    let sumY = 0;
    assigned.forEach(p => {
      sumX += p.x;
      sumY += p.y;
    });

    return {
      ...c,
      x: sumX / assigned.length,
      y: sumY / assigned.length
    };
  });

  return { points: newPoints, centroids: newCentroids, converged: !changed };
};


// 2. Gradient Descent Helpers
// Cost Function: f(x) = x^2 + 6*cos(x)
// Derivative (Gradient): f'(x) = 2*x - 6*sin(x)

export const costFunction = (x) => {
  return (x * x) / 5 + 3 * Math.cos(x);
};

export const gradient = (x) => {
  return (2 * x) / 5 - 3 * Math.sin(x);
};

// Maps mathematical coordinates to screen pixels
export const mapCoordToPixel = (x, y, w, h) => {
  // mathematical domain: x in [-6, 6], y in [-3, 10]
  const screenX = ((x + 6) / 12) * w;
  const screenY = h - ((y + 3) / 13) * h;
  return { x: screenX, y: screenY };
};
