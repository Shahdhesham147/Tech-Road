// visualization.js - Handles Cytoscape rendering for roadmaps

import { extractStepsFromData } from './extractStepsFromData.js';
import { createCytoscapeElements } from './createElements.js';
import { setupEventHandlers } from './eventHandlers.js';
import { renderRoadmapSteps } from './renderSteps.js';

/**
 * Initialize Cytoscape with roadmap data
 * @param {Object} data - The roadmap data to visualize
 * @param {string} containerId - ID of the container to render the graph in
 * @returns {Object} The cytoscape instance
 */
export function initializeCytoscape(data, containerId = 'cy') {
  // Make sure we have the required libraries
  if (!window.cytoscape) {
    console.error("Cytoscape.js not found. Please include the library.");
    return null;
  }
  
  // Add window resize handler to keep the graph properly sized
  window.addEventListener('resize', () => {
    if (window.cy) {
      window.cy.resize();
      window.cy.fit();
    }
  });

  // Cleanup any existing cytoscape instance
  if (window.cy && typeof window.cy.destroy === 'function') {
    try {
      window.cy.destroy();
      console.log("Destroyed previous Cytoscape instance");
    } catch (error) {
      console.warn("Error cleaning up previous Cytoscape instance:", error);
    }
  }

  // Get the container
  const container = document.getElementById(containerId);
  if (!container) {
    console.error("Container with ID '" + containerId + "' not found.");
    return null;
  }

  try {
    // Extract the steps from the data structure
    console.log("Extracting steps from data:", data);
    const steps = extractStepsFromData(data);
    console.log("Extracted steps:", steps);

    // If no steps were found, handle gracefully
    if (!steps || steps.length === 0) {
      console.warn("Could not find any steps in the data for visualization");
      
      // Try to extract at least the track name for the default graph
      const trackName = data.track_name || data.title || 'Roadmap';
      console.log("Using track name for default graph:", trackName);
      
      // Create a simple default graph with at least the track name
      const defaultElements = {
        nodes: [
          { data: { id: 'start', label: 'Getting Started', title: 'Getting Started', type: 'beginner' } },
          { data: { id: 'middle', label: trackName, title: trackName, type: 'intermediate' } },
          { data: { id: 'end', label: 'Advanced Topics', title: 'Advanced Topics', type: 'advanced' } }
        ],
        edges: [
          { data: { source: 'start', target: 'middle' } },
          { data: { source: 'middle', target: 'end' } }
        ]
      };
      
      console.log("Using default elements for visualization");
      
      // Use these default elements instead
      const cy = createCytoscapeInstance(container, defaultElements);
      window.cy = cy; // Store globally for access
      setupEventHandlers(cy, steps);
      return cy;
    }

    // Create cytoscape elements from steps
    const elements = createCytoscapeElements(steps);
    
    // Create the cytoscape instance
    const cy = createCytoscapeInstance(container, elements);
    
    // Store globally for access from other modules
    window.cy = cy;
    
    // Set up event handlers
    setupEventHandlers(cy, steps);
    
    // Adjust zoom for better initial view
    setTimeout(() => {
      // First fit to see everything
      cy.fit();
      
      // Then zoom in for a more visually appealing view
      const currentZoom = cy.zoom();
      // Increase the zoom factor for a better default view (1.5 instead of 1.2)
      const newZoom = Math.min(Math.max(currentZoom * 1.5, 1.0), 2.0);
      
      // Apply the new zoom centered on the viewport with a smooth animation
      cy.animation({
        zoom: {
          level: newZoom,
          position: {
            x: cy.width() / 2,
            y: cy.height() / 2
          }
        },
        easing: 'ease-in-out',
        duration: 800
      }).play();
      
      console.log(`Adjusted zoom from ${currentZoom} to ${newZoom}`);
    }, 500); // Slightly longer delay to let the layout settle properly
    
    console.log("Cytoscape graph initialized successfully");
    return cy;
  } catch (error) {
    console.error("Error initializing cytoscape:", error);
    return null;
  }
}

/**
 * Create a Cytoscape instance with the given container and elements
 * @param {HTMLElement} container - The DOM container for the graph
 * @param {Object} elements - The elements to render
 * @returns {Object} The cytoscape instance
 */
function createCytoscapeInstance(container, elements) {
  try {
    const cy = window.cytoscape({
      container: container,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#FFE0A0',
            'label': 'data(label)',
            'color': '#333',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '14px',
            'font-weight': 'bold',
            'width': '160px',  // Slightly smaller width
            'height': '55px',  // Slightly smaller height
            'border-color': '#E8C97D',
            'border-width': '1px',
            'text-wrap': 'wrap',
            'text-max-width': '170px',
            'shape': 'round-rectangle',
            'text-margin-y': 0,
            'font-weight': 'normal',
            'text-outline-width': 0,
            'cursor': 'pointer',
            'transition-property': 'background-color, border-color, border-width',
            'transition-duration': '0.2s'
          }
        },
        {
          selector: 'node[type = "beginner"]',
          style: {
            'background-color': '#e3f2fd', // Light blue for beginner
            'border-color': '#2196F3',
            'border-width': '2px'
          }
        },
        {
          selector: 'node[type = "intermediate"]',
          style: {
            'background-color': '#fff8e1', // Light amber for intermediate
            'border-color': '#FFB800',
            'border-width': '2px'
          }
        },
        {
          selector: 'node[type = "advanced"]',
          style: {
            'background-color': '#ffebee', // Light red for advanced
            'border-color': '#f44336',
            'border-width': '2px'
          }
        },
        {
          selector: 'node[hasContent]',
          style: {
            'border-color': '#FFB800',
            'border-width': '2px'
          }
        },
        {
          selector: 'node[?hasResources]',
          style: {
            'border-color': '#28a745',
            'border-width': '3px',
            'border-style': 'double'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#2196F3',
            'target-arrow-color': '#2196F3',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 1.1
          }
        },
        {
          selector: 'node.hover',
          style: {
            'background-color': '#0056b3',
            'border-color': '#ffc107',
            'border-width': '3px',
            'cursor': 'pointer',
            'box-shadow': '0 0 10px rgba(255, 193, 7, 0.8)'
          }
        },
        {
          selector: 'node.highlight',
          style: {
            'border-color': '#FF5722',
            'border-width': '4px'
          }
        },
        {
          selector: 'edge.highlight',
          style: {
            'line-color': '#FF5722',
            'target-arrow-color': '#FF5722',
            'width': 3
          }
        }
      ],
      layout: {
        name: 'dagre',
        rankDir: 'TB',
        padding: 50,
        spacingFactor: 1.5,  // Increased spacing between nodes
        fit: true,
        animate: true,
        animationDuration: 800  // Smoother animation
      },
      // Initial viewport state
      zoom: 1.4,  // Higher default zoom level for better visibility
      pan: { x: 0, y: 0 }
    });
    return cy;
  } catch (error) {
    console.error("Error creating Cytoscape instance:", error);
    return null;
  }
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
  console.log(`Loading roadmap details for ID: ${id}`);
  
  // Get references to DOM elements
  const roadmapTitle = document.getElementById(roadmapTitleElement);
  const roadmapSteps = document.getElementById(roadmapStepsElement);
  const roadmapContainer = document.getElementById(roadmapContainerElement);
  const loadingIndicator = document.getElementById(loadingIndicatorElement);
  
  // Show loading indicator if available
  if (loadingIndicator) {
    loadingIndicator.classList.remove('hidden');
  }
  
  try {
    // Fetch roadmap data
    const data = await fetchFunction(id);
    
    // Hide loading indicator
    if (loadingIndicator) {
      loadingIndicator.classList.add('hidden');
    }
    
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
    
    // Hide loading indicator
    if (loadingIndicator) {
      loadingIndicator.classList.add('hidden');
    }
    
    // Show error message
    if (roadmapSteps) {
      roadmapSteps.innerHTML = `
        <div class="alert alert-danger">
          <h4>Error Loading Roadmap</h4>
          <p>Unable to load the roadmap details: ${error.message}</p>
          <p>Please try again later or contact support.</p>
        </div>
      `;
      roadmapSteps.classList.remove('hidden');
    }
    
    return null;
  }
}