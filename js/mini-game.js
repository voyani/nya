class EcoGame {
  constructor(config) {
      this.canvas = document.getElementById(config.canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.items = [];
      this.collected = 0;
      this.target = config.targetItems;
      this.onComplete = config.onComplete;
      this.progressBar = config.progressBar;
      
      this.setupCanvas();
      this.createItems();
      this.bindEvents();
      this.gameLoop();
  }

  setupCanvas() {
      const rect = this.canvas.getBoundingClientRect();
      this.canvas.width = rect.width * devicePixelRatio;
      this.canvas.height = rect.height * devicePixelRatio;
      this.ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  createItems() {
      for(let i = 0; i < this.target; i++) {
          this.items.push({
              x: Math.random() * this.canvas.width,
              y: Math.random() * this.canvas.height,
              type: Math.random() > 0.5 ? 'bottle' : 'can',
              collected: false
          });
      }
  }

  bindEvents() {
      const getTouchPos = (e) => {
          const rect = this.canvas.getBoundingClientRect();
          return {
              x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
              y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
          };
      };

      const handleInteraction = (e) => {
          e.preventDefault();
          this.checkClick(getTouchPos(e));
      };

      this.canvas.addEventListener('click', handleInteraction);
      this.canvas.addEventListener('touchstart', handleInteraction, { passive: false });
  }

  checkClick(pos) {
      const scale = this.canvas.width / this.canvas.getBoundingClientRect().width;
      const scaledPos = {
          x: pos.x * scale,
          y: pos.y * scale
      };

      this.items.forEach(item => {
          if(item.collected) return;
          const distance = Math.hypot(scaledPos.x - item.x, scaledPos.y - item.y);
          if(distance < 30 * scale) {
              item.collected = true;
              this.collected++;
              this.progressBar.style.width = `${(this.collected/this.target)*100}%`;
              if(this.collected === this.target) this.onComplete();
          }
      });
  }

  draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw background
      this.ctx.fillStyle = 'rgba(50, 150, 50, 0.3)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw items
      this.items.forEach(item => {
          if(!item.collected) {
              this.ctx.beginPath();
              this.ctx.arc(item.x, item.y, 20, 0, Math.PI * 2);
              this.ctx.fillStyle = item.type === 'bottle' ? '#3498db' : '#e67e22';
              this.ctx.fill();
          }
      });

      // Draw counter
      this.ctx.fillStyle = 'white';
      this.ctx.font = '24px Bubblegum Sans';
      this.ctx.fillText(`Cleanup: ${this.collected}/${this.target}`, 10, 30);
  }

  gameLoop() {
      this.draw();
      requestAnimationFrame(() => this.gameLoop());
  }
}

window.startEcoGame = (config) => new EcoGame(config);