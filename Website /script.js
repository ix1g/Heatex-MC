tailwind.config = {
  theme: {
      extend: {
// TAILWIND CSS CUSTOMIZATION ( configuration )
          colors: {
              'htx-bg': '#0A0E14',
              'htx-text': '#B3B1AD',
              'htx-accent': '#FF9940',
              'htx-secondary': '#C8C8C8',
              'htx-highlight': '#E6B673',
              'htx-border': 'rgba(179, 177, 173, 0.1)',
              'htx-card-bg': 'rgba(26, 31, 41, 0.7)',
              'htx-card-hover': 'rgba(30, 36, 48, 0.9)',
              'htx-success': '#4CAF50',
              'htx-error': '#F44336',
              'toast-bg': '#232531',
              'toast-success-icon': '#2b9875',
              'toast-error-icon': '#F44336',
              'toast-close': '#6b7280',
          },

          fontFamily: {
              sans: ['Inter', 'sans-serif'],
              minecraft: ['Minecraft', 'Inter', 'sans-serif'], 
          },

          boxShadow: {
              'glow-accent': '0 0 20px rgba(255, 153, 64, 0.4)',
              'glow-accent-hover': '0 0 30px rgba(255, 153, 64, 0.7)',
          },

          animation: {
              'glow': 'glow 2s infinite alternate',
              'menuSlide': 'menuSlide 0.3s ease-out forwards', // Mobile drop-menu slide-down
              'pulse': 'pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          },
          keyframes: {
              glow: {
                  'from': { textShadow: '0 0 10px rgba(255, 153, 64, 0.3)' },
                  'to': { textShadow: '0 0 30px rgba(255, 153, 64, 0.6)' },
              },
              menuSlide: {
                  'from': { transform: 'translateY(-20px)', opacity: '0' },
                  'to': { transform: 'translateY(0)', opacity: '1' },
              },
              pulse: { // Used for skeleton loading
                  '0%, 100%': { opacity: '1' },
                  '50%': { opacity: '.4' },
              }
          }
      }
  }
};

document.addEventListener('DOMContentLoaded', () => {

  const loadingOverlay = document.getElementById('loading-overlay');
  const loadingTime = 1500;

  setTimeout(() => {
      if (loadingOverlay) {
          loadingOverlay.style.opacity = '0';
          setTimeout(() => {
              loadingOverlay.style.display = 'none';
          }, 700);
      }
  }, loadingTime);

  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-link') : []; // Ensure mobileMenu exists

  if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
          // tggle the visibility of the mobile menu.
          mobileMenu.classList.toggle('hidden');
          // TOoggle the hamburger/close icon.
          const icon = menuToggle.querySelector('i');
          if (icon) {
              icon.classList.toggle('fa-bars');
              icon.classList.toggle('fa-times');
          }
      });

      mobileLinks.forEach(link => {
          link.addEventListener('click', () => {
               mobileMenu.classList.add('hidden'); // Mobile menu hides after link click
               const icon = menuToggle.querySelector('i');
               if (icon) {
                   icon.classList.remove('fa-times');
                   icon.classList.add('fa-bars');
               }
          });
      });
  } else {
      console.warn("Mobile menu toggle or menu element not found.");
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
              const targetElement = document.querySelector(targetId);
              if (targetElement) {
                  e.preventDefault();
                  targetElement.scrollIntoView({ behavior: 'smooth' });

                  if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                       mobileMenu.classList.add('hidden');
                       const icon = menuToggle.querySelector('i');
                       if (icon) {
                          icon.classList.remove('fa-times');
                          icon.classList.add('fa-bars');
                       }
                  }
              } else {
                  console.warn(`Smooth scroll target not found: ${targetId}`);
              }
          }
      });
  });

  // --- toast Notification Logic --- its from https://uiverse.io
  const toastContainer = document.getElementById('toast-container');

  /**
   * Creates and displays a toast notification.
   * @param {string} message - The main message (title) of the toast.
   * @param {string} description - Optional secondary text for the toast.
   * @param {'success' | 'error'} type - The type of toast ('success' or 'error').
   */
  function createToast(message, description, type = 'success') {
      if (!toastContainer) {
          console.error("Toast container not found.");
          return;
      }

      const toast = document.createElement('div');
      toast.className = `toast ${type}`; 

      // SVG icons
      const successIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="toast-icon"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"></path></svg>`;
      const errorIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="toast-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>`;

      // set the inner HTML of the toast its from https://uiverse.io
      toast.innerHTML = `
          <div class="flex items-center flex-grow">
              <div class="toast-icon-container">
                  ${type === 'success' ? successIconSvg : errorIconSvg}
              </div>
              <div class="toast-content">
                  <p class="toast-title">${message}</p>
                  ${description ? `<p class="toast-description">${description}</p>` : ''}
              </div>
          </div>
          <button class="toast-close-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="toast-close-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
              </svg>
          </button>
          <div class="toast-progress-container">
              <div class="toast-progress"></div>
          </div>
      `;

      toastContainer.appendChild(toast);

      requestAnimationFrame(() => {
          toast.classList.add('show');
      });

      // Set a timeout to automaticalkly remove the toast
      const timeoutDuration = 5000; // 5 seconds
      const timeoutId = setTimeout(() => {
          toast.classList.remove('show');
          // Remove thee element from the DOM after the slide-out transition ends
          toast.addEventListener('transitionend', () => toast.remove(), { once: true });
      }, timeoutDuration);

      // Add click listener to the close button
      const closeButton = toast.querySelector('.toast-close-button');
      if (closeButton) {
          closeButton.addEventListener('click', () => {
              clearTimeout(timeoutId); // Cancel the automatic removal
              toast.classList.remove('show');
              // Remove the element from the DOM after the slide-out transition ends
              toast.addEventListener('transitionend', () => toast.remove(), { once: true });
          });
      } else {
           console.warn("Toast close button not found within the toast element.");
      }
  }

  // --- Copy IP Address Action ---
  const copyButton = document.getElementById('copy-ip-button');
  if (copyButton) {
      copyButton.addEventListener('click', () => {
          const ipAddress = "play.heatexmc.net";
          // Use the Clipboard API to copy text
          navigator.clipboard.writeText(ipAddress)
              .then(() => {
                  // Show success toast on successful copy
                  createToast("IP Copied!", "Server address is ready to paste.", "success");
              })
              .catch(err => {
                  // Log error and show error toast on failure
                  console.error("Failed to copy IP:", err);
                  createToast("Copy Failed", "Could not copy IP to clipboard.", "error");
              });
      });
  } else {
      console.warn("Copy IP button not found.");
  }

  // --- Interactive 3D Card Effect for Game Cards ---
  const interactiveCards = document.querySelectorAll('.game-card-interactive');
  interactiveCards.forEach(card => {
      const innerCard = card.querySelector('.game-card-inner');
      if (!innerCard) {
          console.warn("Inner card element not found for a game card.");
          return; // Skip this card if the inner element is missing
      }

      const maxRotation = 8; // Maximum rotation angle in degrees

      // Event listener for mouse movement over the card
      card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect(); // Get card dimensions and position
          // Calculate mouse position relative to the card center
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const cardWidth = rect.width;
          const cardHeight = rect.height;
          // Calculate rotation angles based on mouse position
          // The further from the center, the greater the rotation
          const rotateY = maxRotation * ((x - cardWidth / 2) / (cardWidth / 2));
          const rotateX = -maxRotation * ((y - cardHeight / 2) / (cardHeight / 2));

          // Apply the 3D rotation and a slight scale effect to the inner card element
          innerCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
      });

      // Event listener for when the mouse leaves the card
      card.addEventListener('mouseleave', () => {
          // Reset the inner card's transform to its default state
          innerCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
          // Optionally reset transition speed if it was changed on mouseenter
          // innerCard.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'; // Example if needed
      });
      // Event listener for when the mouse enters the card (optional)
      // Can be used to set a faster transition for the hover effect if desired
       card.addEventListener('mouseenter', () => {
           // Make the transform react quickly to mouse movements
           innerCard.style.transition = 'transform 0.1s linear';
       });
  });

});
