import { extractStepsFromData } from './extractStepsFromData.js';

/**
 * Render a roadmap steps list
 * @param {Object} data - Roadmap data
 * @param {HTMLElement} roadmapSteps - Container for roadmap steps
 */
export function renderRoadmapSteps(data, roadmapSteps) {
  if (!roadmapSteps) return;
  
  // Extract steps from data
  const steps = extractStepsFromData(data);
  
  // Clear the steps container but still populate it (for potential future reference)
  roadmapSteps.innerHTML = '';
  
  // Only continue if we have steps
  if (!steps || steps.length === 0) {
    console.warn("No steps found to render, creating a placeholder");
    roadmapSteps.classList.remove('hidden');
    
    roadmapSteps.innerHTML = `
      <div class="alert alert-warning">
        <h4>No detailed steps available for this roadmap</h4>
        <p>We're still working on adding detailed steps for this learning path.</p>
        <p>Check back soon for updates!</p>
      </div>
    `;
    return;
  }
  
  // Keep the steps container hidden since we'll use the sidebar instead
  roadmapSteps.classList.add('hidden');
  
  // Create step elements
  steps.forEach((step, index) => {
    const stepElement = document.createElement('div');
    stepElement.className = 'roadmap-step';
    stepElement.dataset.id = step.id;
    stepElement.dataset.index = index;
    
    // Get step title and description
    let title = step.title || step.name || ('Step ' + (index + 1));
    let description = step.description || 'No description available.';
    
    // Check if step has content (roadmap.sh format)
    if (step.content) {
      title = step.content.title || title;
      description = step.content.description || description;
    }
    
    // Resources list
    let resourcesHtml = '';
    
    // Get resources from different possible sources
    const resources = [];
    
    if (Array.isArray(step.links)) {
      resources.push(...step.links);
    }
    
    if (Array.isArray(step.resources)) {
      resources.push(...step.resources);
    }
    
    if (step.content && Array.isArray(step.content.resources)) {
      resources.push(...step.content.resources);
    }
    
    // If we have resources, generate the HTML
    if (resources.length > 0) {
      let resourceItems = '';
      
      resources.forEach(resource => {
        if (!resource) return;
        
        if (typeof resource === 'string') {
          resourceItems += '<li><a href="' + resource + '" target="_blank">' + resource + '</a></li>';
        } else {
          const url = resource.url || '#';
          const title = resource.title || url;
          resourceItems += '<li><a href="' + url + '" target="_blank">' + title + '</a></li>';
        }
      });
      
      resourcesHtml = 
        '<div class="step-resources">' +
          '<h4>Resources</h4>' +
          '<ul>' + resourceItems + '</ul>' +
        '</div>';
    }
    
    // Create the step HTML
    stepElement.innerHTML = 
      '<div class="step-header">' +
        '<h3>' + title + '</h3>' +
        '<button class="toggle-btn">+</button>' +
      '</div>' +
      '<div class="step-body hidden">' +
        '<p>' + description + '</p>' +
        resourcesHtml +
      '</div>';
    
    // Add toggle functionality
    const toggleBtn = stepElement.querySelector('.toggle-btn');
    const stepBody = stepElement.querySelector('.step-body');
    
    toggleBtn.addEventListener('click', () => {
      stepBody.classList.toggle('hidden');
      toggleBtn.textContent = stepBody.classList.contains('hidden') ? '+' : '-';
    });
    
    roadmapSteps.appendChild(stepElement);
  });
}

/**
 * Load the details of a roadmap and render it
 * @param {string} id - The ID of the roadmap to load
 * @param {Function} fetchFunction - Function to fetch roadmap data
 * @param {string} roadmapTitleElement - ID of element to show roadmap title
 * @param {string} roadmapStepsElement - ID of element for steps display
 * @param {string} roadmapContainerElement - ID of element containing the roadmap
 * @param {string} loadingIndicatorElement - ID of loading indicator element
 * @param {string} cytoscapeElement - ID of cytoscape container
 * @returns {Promise<Object>} The loaded roadmap data
 */
export async function loadRoadmapDetails(id, fetchFunction, roadmapTitleElement, roadmapStepsElement, roadmapContainerElement, loadingIndicatorElement, cytoscapeElement) {
  console.log("Loading roadmap details for ID: " + id);
  
  // Get references to DOM elements
  const roadmapTitle = document.getElementById(roadmapTitleElement);
  const roadmapSteps = document.getElementById(roadmapStepsElement);
  const roadmapContainer = document.getElementById(roadmapContainerElement);
  const loadingIndicator = document.getElementById(loadingIndicatorElement);
  
  // Show loading indicator
  if (loadingIndicator) {
    loadingIndicator.classList.remove('hidden');
  }
  
  // Hide steps container temporarily
  if (roadmapSteps) {
    roadmapSteps.innerHTML = '';
  }
  
  try {
    // Fetch roadmap data
    const data = await fetchFunction(id);
    console.log("API response data:", data);
    
    if (!data) {
      throw new Error("No data received from API");
    }
    
    // Extract basic information
    const title = data.title || data.name || "Roadmap";
    
    // Update page title
    if (roadmapTitle) {
      roadmapTitle.textContent = title;
    }
    
    // Show the roadmap container
    if (roadmapContainer) {
      roadmapContainer.classList.remove('hidden');
    }
    
    // Render steps list
    if (roadmapSteps) {
      renderRoadmapSteps(data, roadmapSteps);
    }
    
    // Initialize the visualization with a try-catch block
    try {
      const { initializeCytoscape } = await import('./visualization.js');
      const cyInstance = initializeCytoscape(data, cytoscapeElement);
      
      if (!cyInstance) {
        console.warn("Cytoscape instance not created. Falling back to simplified view.");
        if (roadmapSteps) {
          roadmapSteps.classList.remove('hidden');
        }
      }
    } catch (vizError) {
      console.error("Error initializing visualization:", vizError);
      // Still continue with the function and show steps list
      if (roadmapSteps) {
        roadmapSteps.classList.remove('hidden');
      }
    }
    
    // Return the data for further processing
    return data;
  } catch (error) {
    console.error("Error loading roadmap details:", error);
    
    // Show error message
    if (roadmapSteps) {
      roadmapSteps.innerHTML = 
        '<div class="alert alert-danger">' +
          '<p>Error loading roadmap: ' + error.message + '</p>' +
          '<p>Please try again later or contact support if the problem persists.</p>' +
        '</div>';
      roadmapSteps.classList.remove('hidden');
    }
    
    return null;
  } finally {
    // Hide loading indicator
    if (loadingIndicator) {
      loadingIndicator.classList.add('hidden');
    }
  }
}
