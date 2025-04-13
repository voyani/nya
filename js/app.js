class AdventureFlow {
    constructor() {
      this.currentStep = 0;
      this.userChoices = {
        avatar: null,
        name: null
      };
      
      this.elements = {
        steps: document.querySelectorAll('[data-step]'),
        startBtn: document.querySelector('.start-btn'),
        avatars: document.querySelectorAll('.avatar'),
        nameBtns: document.querySelectorAll('.name-bubble'),
        consentCheckbox: document.getElementById('guardianCheck'),
        navBtns: document.querySelectorAll('.nav-btn')
      };
      
      this.init();
    }
  
    init() {
      this.elements.startBtn.addEventListener('click', () => this.showStep(1));
      
      this.elements.avatars.forEach(avatar => {
        avatar.addEventListener('click', () => this.selectAvatar(avatar));
      });
  
      this.elements.nameBtns.forEach(btn => {
        btn.addEventListener('click', () => this.selectName(btn));
      });
  
      this.elements.navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const nextStep = parseInt(e.target.dataset.next);
          this.validateStep(nextStep);
        });
      });
  
      document.querySelector('.enter-clubhouse').addEventListener('click', () => {
        window.location.href = 'clubhouse.html';
      });
  
      this.preloadAssets();
    }
  
    preloadAssets() {
      ['images/mascot-owl.webp', 'images/avatar-panda.webp'].forEach(src => {
        new Image().src = src;
      });
    }
  
    showStep(stepNumber) {
      this.currentStep = stepNumber;
      this.elements.steps.forEach(step => {
        step.classList.toggle('hidden', step.dataset.step != stepNumber);
      });
  
      if(stepNumber === 3) this.initGame();
    }
  
    selectAvatar(avatar) {
      this.elements.avatars.forEach(a => a.classList.remove('selected'));
      avatar.classList.add('selected');
      this.userChoices.avatar = avatar.dataset.animal;
    }
  
    selectName(btn) {
      this.elements.nameBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      this.userChoices.name = btn.textContent;
    }
  
    validateStep(nextStep) {
      if(this.currentStep === 1 && !this.userChoices.avatar) {
        alert("Please choose an animal friend first!");
        return;
      }
      
      if(this.currentStep === 2 && !this.userChoices.name) {
        alert("Pick your awesome hero name!");
        return;
      }
      
      if(this.currentStep === 4 && !this.elements.consentCheckbox.checked) {
        alert("Need a grown-up's OK to continue!");
        return;
      }
  
      this.showStep(nextStep);
    }
  
    initGame() {
      window.startEcoGame({
        canvasId: 'ecoGameCanvas',
        targetItems: 15,
        onComplete: () => {
          document.querySelector('.progress-bar').style.width = '100%';
          document.querySelector('[data-next="4"]').disabled = false;
        }
      });
    }
  }
  
  // Initialize when page loads
  window.addEventListener('DOMContentLoaded', () => new AdventureFlow());