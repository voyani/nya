class AdventureFlow {
  constructor() {
      this.currentStep = 0;
      this.userChoices = { avatar: null };
      this.elements = {
          steps: document.querySelectorAll('[data-step]'),
          startBtn: document.querySelector('.start-btn'),
          avatars: document.querySelectorAll('.avatar'),
          navBtns: document.querySelectorAll('.nav-btn'),
          progressBar: document.querySelector('.progress-bar')
      };
      
      this.init();
  }

  init() {
      this.elements.startBtn.addEventListener('click', () => this.showStep(1));
      
      this.elements.avatars.forEach(avatar => {
          avatar.addEventListener('click', () => this.selectAvatar(avatar));
      });

      this.elements.navBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
              const nextStep = parseInt(e.target.dataset.next);
              this.validateStep(nextStep);
          });
      });

      this.preloadAssets();
  }

  preloadAssets() {
      ['avatar-panda.webp', 'avatar-tiger.webp', 'avatar-parrot.webp'].forEach(src => {
          new Image().src = `images/${src}`;
      });
  }

  showStep(stepNumber) {
      this.currentStep = stepNumber;
      this.elements.steps.forEach(step => {
          step.classList.toggle('hidden', parseInt(step.dataset.step) !== stepNumber);
      });

      if(stepNumber === 2) this.initGame();
  }

  selectAvatar(avatar) {
      if(avatar.classList.contains('selected')) return;
      
      this.elements.avatars.forEach(a => a.classList.remove('selected'));
      avatar.classList.add('selected');
      this.userChoices.avatar = avatar.dataset.animal;
  }

  validateStep(nextStep) {
      // Only validate when moving from avatar selection (step 1)
      if(this.currentStep === 1 && !this.userChoices.avatar) {
          alert("Please choose an animal friend first!");
          return;
      }
      
      this.showStep(nextStep);
  }

  initGame() {
      const gameConfig = {
          canvasId: 'ecoGameCanvas',
          targetItems: 15,
          progressBar: this.elements.progressBar,
          onComplete: () => {
              const continueBtn = document.querySelector('[data-next="3"]');
              continueBtn.disabled = false;
              this.elements.progressBar.style.width = '100%';
          }
      };
      
      window.startEcoGame(gameConfig);
      document.querySelector('[data-next="3"]').disabled = true;
  }
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => new AdventureFlow());