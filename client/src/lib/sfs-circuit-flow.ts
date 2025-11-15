/**
 * SFS CIRCUIT FLOW - Golden Circuit Board Animation
 * Creates an animated golden circuit pattern background
 */

interface Point {
  x: number;
  y: number;
}

interface Node extends Point {
  connections: number[];
  pulse: number;
  pulseSpeed: number;
}

interface Circuit {
  nodes: Node[];
  gridSize: number;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  animationId: number | null;
  isVisible: boolean;
}

export class CircuitFlow {
  private circuit: Circuit;
  private readonly nodeColor = 'rgba(212, 175, 55, 0.8)'; // Gold
  private readonly lineColor = 'rgba(212, 175, 55, 0.3)'; // Gold lines
  private readonly pulseColor = 'rgba(212, 175, 55, 1)'; // Bright gold pulse

  constructor(canvasId: string = 'sfs-circuit') {
    this.circuit = {
      nodes: [],
      gridSize: 80,
      canvas: null,
      ctx: null,
      animationId: null,
      isVisible: true,
    };

    this.init(canvasId);
  }

  private init(canvasId: string): void {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.warn(`Canvas with id "${canvasId}" not found`);
      return;
    }

    this.circuit.canvas = canvas;
    this.circuit.ctx = canvas.getContext('2d');

    if (!this.circuit.ctx) {
      console.warn('Failed to get 2D context');
      return;
    }

    this.setupCanvas();
    this.generateNodes();
    this.connectNodes();
    this.animate();

    // Handle resize
    window.addEventListener('resize', this.handleResize.bind(this));

    // Handle visibility
    document.addEventListener('visibilitychange', this.handleVisibility.bind(this));
  }

  private setupCanvas(): void {
    if (!this.circuit.canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = this.circuit.canvas.getBoundingClientRect();

    this.circuit.canvas.width = rect.width * dpr;
    this.circuit.canvas.height = rect.height * dpr;
    this.circuit.canvas.style.width = `${rect.width}px`;
    this.circuit.canvas.style.height = `${rect.height}px`;

    if (this.circuit.ctx) {
      this.circuit.ctx.scale(dpr, dpr);
    }
  }

  private generateNodes(): void {
    if (!this.circuit.canvas) return;

    const { gridSize } = this.circuit;
    const cols = Math.ceil(this.circuit.canvas.width / gridSize);
    const rows = Math.ceil(this.circuit.canvas.height / gridSize);

    this.circuit.nodes = [];

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Add some randomness to node placement
        const offsetX = (Math.random() - 0.5) * gridSize * 0.3;
        const offsetY = (Math.random() - 0.5) * gridSize * 0.3;

        // Only add nodes with some probability to create gaps
        if (Math.random() > 0.3) {
          this.circuit.nodes.push({
            x: i * gridSize + offsetX,
            y: j * gridSize + offsetY,
            connections: [],
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.01 + Math.random() * 0.02,
          });
        }
      }
    }
  }

  private connectNodes(): void {
    const { nodes, gridSize } = this.circuit;
    const maxDistance = gridSize * 1.5;

    // Clear existing connections
    nodes.forEach(node => node.connections = []);

    // Connect nearby nodes
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i === j) return;
        if (node.connections.length >= 3) return; // Limit connections per node

        const dx = otherNode.x - node.x;
        const dy = otherNode.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance && !node.connections.includes(j)) {
          node.connections.push(j);
        }
      });
    });
  }

  private drawNode(node: Node): void {
    if (!this.circuit.ctx) return;

    const ctx = this.circuit.ctx;
    const pulseSize = 2 + Math.sin(node.pulse) * 1;

    // Outer glow
    const gradient = ctx.createRadialGradient(
      node.x, node.y, 0,
      node.x, node.y, pulseSize * 3
    );
    gradient.addColorStop(0, this.pulseColor);
    gradient.addColorStop(0.5, this.nodeColor);
    gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(node.x, node.y, pulseSize * 3, 0, Math.PI * 2);
    ctx.fill();

    // Inner node
    ctx.fillStyle = this.nodeColor;
    ctx.beginPath();
    ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawConnection(from: Node, to: Node, alpha: number = 1): void {
    if (!this.circuit.ctx) return;

    const ctx = this.circuit.ctx;

    // Create gradient along the line
    const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
    const pulseFactor = (Math.sin(from.pulse) + 1) / 2;

    gradient.addColorStop(0, `rgba(212, 175, 55, ${0.2 * alpha * pulseFactor})`);
    gradient.addColorStop(0.5, `rgba(212, 175, 55, ${0.4 * alpha})`);
    gradient.addColorStop(1, `rgba(212, 175, 55, ${0.2 * alpha * pulseFactor})`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    // Draw data pulse traveling along line
    if (Math.random() > 0.98) {
      const progress = (Date.now() % 2000) / 2000;
      const pulseX = from.x + (to.x - from.x) * progress;
      const pulseY = from.y + (to.y - from.y) * progress;

      const pulseGradient = ctx.createRadialGradient(
        pulseX, pulseY, 0,
        pulseX, pulseY, 5
      );
      pulseGradient.addColorStop(0, this.pulseColor);
      pulseGradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

      ctx.fillStyle = pulseGradient;
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private draw(): void {
    if (!this.circuit.ctx || !this.circuit.canvas) return;

    const ctx = this.circuit.ctx;
    const { width, height } = this.circuit.canvas.getBoundingClientRect();

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw connections first (so they appear behind nodes)
    this.circuit.nodes.forEach((node, i) => {
      node.connections.forEach(connectionIndex => {
        const connectedNode = this.circuit.nodes[connectionIndex];
        if (connectedNode) {
          this.drawConnection(node, connectedNode);
        }
      });
    });

    // Draw nodes
    this.circuit.nodes.forEach(node => {
      this.drawNode(node);
      // Update pulse
      node.pulse += node.pulseSpeed;
    });
  }

  private animate(): void {
    if (!this.circuit.isVisible) return;

    this.draw();
    this.circuit.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  private handleResize(): void {
    this.setupCanvas();
    this.generateNodes();
    this.connectNodes();
  }

  private handleVisibility(): void {
    if (document.hidden) {
      this.circuit.isVisible = false;
      if (this.circuit.animationId) {
        cancelAnimationFrame(this.circuit.animationId);
        this.circuit.animationId = null;
      }
    } else {
      this.circuit.isVisible = true;
      this.animate();
    }
  }

  public destroy(): void {
    if (this.circuit.animationId) {
      cancelAnimationFrame(this.circuit.animationId);
    }
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibility);
  }

  public pause(): void {
    this.circuit.isVisible = false;
    if (this.circuit.animationId) {
      cancelAnimationFrame(this.circuit.animationId);
      this.circuit.animationId = null;
    }
  }

  public resume(): void {
    this.circuit.isVisible = true;
    this.animate();
  }
}

// Auto-initialize if canvas exists
if (typeof window !== 'undefined') {
  let circuitFlow: CircuitFlow | null = null;

  const initCircuit = () => {
    const canvas = document.getElementById('sfs-circuit');
    if (canvas && !circuitFlow) {
      circuitFlow = new CircuitFlow('sfs-circuit');
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCircuit);
  } else {
    initCircuit();
  }
}

export default CircuitFlow;
