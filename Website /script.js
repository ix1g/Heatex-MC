 const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });

    const notificationBox = document.getElementById("copy-notification");
    const notificationMessage = document.getElementById("notification-message");
    const progressBar = document.getElementById("progress-bar");
    const dismissIcon = document.getElementById("dismiss-icon");
    let notificationTimeout;

    function showNotification(message, type) {
      clearTimeout(notificationTimeout);
      notificationMessage.textContent = message;
      if (type === "success") {
        notificationBox.style.borderColor = varColor("--success");
        notificationMessage.style.color = varColor("--success");
        progressBar.style.color = varColor("--success");
      } else {
        notificationBox.style.borderColor = varColor("--error");
        notificationMessage.style.color = varColor("--error");
        progressBar.style.color = varColor("--error");
      }
      notificationBox.classList.add("show");
      progressBar.style.animation = "none";
      progressBar.offsetHeight; // restart animation
      progressBar.style.animation = "progress 5s linear forwards";

      notificationTimeout = setTimeout(() => {
        notificationBox.classList.remove("show");
      }, 5000);
    }

    function varColor(variable) {
      return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    }

    dismissIcon.addEventListener("click", () => {
      notificationBox.classList.remove("show");
      clearTimeout(notificationTimeout);
    });

    function copyIP() {
      navigator.clipboard.writeText("play.heatexmc.net")
        .then(() => {
          showNotification("Server IP copied!", "success");
        })
        .catch(() => {
          showNotification("Failed to copy IP.", "error");
        });
    }
