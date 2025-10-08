// Main.js - Entry point for the application
// Handles AI assistant movement and imports modular code for pages that need it

// Handle AI assistant floating behavior
const ai = document.querySelector(".AI");

if (ai) {
  window.addEventListener("scroll", () => {
    let scrollY = window.scrollY;
    ai.style.top = `${scrollY + 20}px`; 
  });
}

// Import our modular code conditionally based on the current page
if (window.location.pathname.includes('roadmaps.html')) {
  // Import the roadmap modules functionality
  import('./modules/index.js')
    .then(() => console.log('Roadmap modules loaded successfully'))
    .catch(error => console.error('Error loading roadmap modules:', error));
} else {
  // For other pages, just do basic API check
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Main.js loaded - checking API status");
    
    // Simple API check
    fetch("http://localhost:3000/api/status")
      .then(response => response.json())
      .then(data => {
        console.log("API Status:", data);
      })
      .catch(error => console.error("Error checking API status:", error));
  });
}
