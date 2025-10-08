/**
 * Set up event handlers for the Cytoscape graph
 * @param {Object} cy - The Cytoscape instance
 * @param {Array} steps - The roadmap steps
 */
import { ensureNodeTranslations, createArabicPlaceholder } from './translationHelper.js';

export function setupEventHandlers(cy, steps) {
  // Make sure steps is an array to avoid errors
  if (!steps || !Array.isArray(steps)) {
    console.warn("Steps parameter is not an array. Initializing empty array.");
    steps = [];
  }

  // Setup hover effects
  cy.on('mouseover', 'node', function(evt) {
    const node = evt.target;
    node.addClass('hover');
  });
  
  cy.on('mouseout', 'node', function(evt) {
    const node = evt.target;
    node.removeClass('hover');
  });
  
  // Setup sidebar elements
  const nodeSidebar = document.getElementById('node-detail-sidebar');
  const detailTitle = document.getElementById('detail-title');
  const detailContent = document.getElementById('detail-content');
  const closeSidebar = document.getElementById('close-sidebar');
  // View Resources button removed from UI
  const viewResourcesBtn = null;
  
  // Store current node's resources and description language state
  let currentNodeResources = [];
  let isArabicActive = false; // Track current language
  
  // Close sidebar when clicking the close button
  if (closeSidebar) {
    closeSidebar.addEventListener('click', () => {
      // First remove active to trigger the transition
      nodeSidebar.classList.remove('active');
      // Add hidden class after transition completes
      setTimeout(() => {
        nodeSidebar.classList.add('hidden');
      }, 300); // Match the CSS transition time
      
      // Reset graph highlighting
      window.cy.elements().style({ 'opacity': 1 });
    });
  }
  
  // View Resources button has been removed from the UI
  // Functionality kept here as a reference for future use
  /*
  if (viewResourcesBtn) {
    viewResourcesBtn.addEventListener('click', () => {
      if (currentNodeResources.length > 0) {
        // Open the first resource in a new tab
        const resource = currentNodeResources[0];
        const url = (typeof resource === 'string') ? resource : resource.url;
        if (url && url !== '#') {
          window.open(url, '_blank');
        }
      }
    });
  }
  */
  
  // Close sidebar when clicking outside (on the graph background)
  cy.on('tap', function(evt) {
    // When clicking on the background, reset all styles
    if (evt.target === cy) {
      cy.elements().style({ 'opacity': 1 });
      
      // Also close the sidebar when clicking on the background
      if (nodeSidebar && nodeSidebar.classList.contains('active')) {
        // First remove active to trigger the transition
        nodeSidebar.classList.remove('active');
        // Add hidden class after transition completes
        setTimeout(() => {
          nodeSidebar.classList.add('hidden');
        }, 300); // Match the CSS transition time
      }
    }
  });
  
  // Handle node clicks - show sidebar with details
  cy.on('tap', 'node', function(evt) {
    // When a node is clicked, highlight it and connected edges
    const node = evt.target;
    const data = node.data();
    
    // Debug node data
    console.log("Clicked on node:", data);
    
    // Highlight this node and connected elements
    cy.elements().style({ 'opacity': 0.3 });
    node.style({ 'opacity': 1 });
    node.connectedEdges().style({ 'opacity': 1 });
    node.connectedEdges().connectedNodes().style({ 'opacity': 1 });
    
    // Get detailed information about this node
    let nodeInfo = {
      id: data.id,
      title: data.title || data.label || 'Node Details',
      description: data.description || 'No description available.',
      descriptionAr: data.descriptionAr || data.description_ar || '',
      resources: data.resources || []
    };
    
    // Ensure this node has translations available
    nodeInfo = ensureNodeTranslations(nodeInfo);
    
    console.log("Original node data:", data);
    
    // Check different data structures to find the detailed information
    // First check if we have step data in our steps array
    let stepData = null;
    if (Array.isArray(steps) && steps.length > 0) {
      stepData = steps.find(s => {
        // Check for various ways the node might be identified
        return s && (
          s.id === data.id || 
          s.name === data.label || 
          s.title === data.title ||
          s.name === data.title ||
          (data.originalData && s.id === data.originalData.id)
        );
      });
    }
    
    console.log("Found step data:", stepData);
    
    if (stepData) {
      console.log("Found step data:", stepData);
      nodeInfo.title = stepData.title || stepData.name || nodeInfo.title;
      nodeInfo.description = stepData.description || nodeInfo.description;
      
      // For Tech Road data format, make sure we get the proper title and description
      if (stepData.originalData) {
        if (stepData.originalData.title) {
          nodeInfo.title = stepData.originalData.title;
        }
        if (stepData.originalData.description) {
          nodeInfo.description = stepData.originalData.description;
        }
      }
      
      // Gather all resources
      nodeInfo.resources = [];
      
      // Get resources from stepData
      if (Array.isArray(stepData.links)) {
        nodeInfo.resources = [...nodeInfo.resources, ...stepData.links];
      } 
      
      if (Array.isArray(stepData.resources)) {
        nodeInfo.resources = [...nodeInfo.resources, ...stepData.resources];
      }
      
      // Also look for resources in content
      if (stepData.content && Array.isArray(stepData.content.resources)) {
        nodeInfo.resources = [...nodeInfo.resources, ...stepData.content.resources];
      }
      
      // Special case for Tech Road data format
      if (stepData.originalData && Array.isArray(stepData.originalData.links)) {
        nodeInfo.resources = [...nodeInfo.resources, ...stepData.originalData.links];
      }
    }
    
    // Also check if node has its own content data (from roadmap.sh format)
    if (data.content) {
      nodeInfo.title = data.content.title || nodeInfo.title;
      nodeInfo.description = data.content.description || nodeInfo.description;
      
      // Get resources from content data
      if (Array.isArray(data.content.resources)) {
        nodeInfo.resources = [
          ...nodeInfo.resources, 
          ...data.content.resources.map(r => typeof r === 'string' ? { url: r } : r)
        ];
      }
    }
    
    // Format resource icons based on type or URL
    const getResourceIcon = (resource) => {
      if (resource.type) {
        switch(resource.type?.toLowerCase()) {
          case 'video': return '<i class="fas fa-video resource-icon"></i>';
          case 'article': return '<i class="fas fa-newspaper resource-icon"></i>';
          case 'course': return '<i class="fas fa-graduation-cap resource-icon"></i>';
          default: return '<i class="fas fa-link resource-icon"></i>';
        }
      }
      
      // If no type, try to infer from URL
      const url = resource.url || resource.href || resource;
      if (typeof url === 'string') {
        if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
          return '<i class="fas fa-video resource-icon"></i>';
        } else if (url.includes('udemy.com') || url.includes('coursera.org') || url.includes('edx.org')) {
          return '<i class="fas fa-graduation-cap resource-icon"></i>';
        } else if (url.includes('medium.com') || url.includes('dev.to') || url.includes('blog')) {
          return '<i class="fas fa-newspaper resource-icon"></i>';
        }
      }
      
      return '<i class="fas fa-link resource-icon"></i>';
    };
    
    // Generate HTML content for the sidebar
    let resourcesHtml = '';
    if (nodeInfo.resources && nodeInfo.resources.length > 0) {
      let resourcesList = '';
      
      // Store resources for later use
      currentNodeResources = nodeInfo.resources;
      
      nodeInfo.resources.forEach((res, index) => {
        if (!res) return;
        
        if (typeof res === 'string') {
          // Handle plain string URLs
          const displayUrl = res.length > 50 ? res.substring(0, 47) + '...' : res;
          
          // Determine resource type from URL
          let resourceType = 'other';
          if (res.includes('youtube.com') || res.includes('youtu.be') || res.includes('vimeo.com')) {
            resourceType = 'video';
          } else if (res.includes('medium.com') || res.includes('dev.to') || res.includes('blog')) {
            resourceType = 'article';
          } else if (res.includes('udemy.com') || res.includes('coursera.org') || res.includes('edx.org')) {
            resourceType = 'course';
          }
          
          const badge = `<span class="resource-type-badge resource-type-${resourceType}">${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}</span>`;
          
          resourcesList += '<li>' + 
            badge +
            getResourceIcon(res) + 
            '<a href="' + res + '" target="_blank" rel="noopener noreferrer">' + displayUrl + '</a>' +
          '</li>';
        } else {
          // Handle resource objects
          const url = res.url || res.href || '#';
          const title = res.title || res.name || url;
          const displayTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
          const type = res.type || '';
          const icon = getResourceIcon(res);
          
          // Create visually appealing badge
          let resourceType = type.toLowerCase();
          if (!['article', 'video', 'course', 'book'].includes(resourceType)) {
            resourceType = 'other';
          }
          const badge = `<span class="resource-type-badge resource-type-${resourceType}">${type || 'Resource'}</span>`;
          
          resourcesList += '<li>' + 
            badge +
            icon + 
            '<a href="' + url + '" target="_blank">' + displayTitle + '</a>' +
          '</li>';
        }
      });
      
      resourcesHtml = `
        <div class="detail-resources">
          <h4>Learning Resources</h4>
          <p class="resource-hint">Click any link to visit the resource</p>
          <ul class="resource-list">
            ${resourcesList}
          </ul>
        </div>
      `;
    } else {
      resourcesHtml = `
        <p class="no-resources">
          <i class="fas fa-info-circle"></i> 
          No resources available for this topic yet.
        </p>
      `;
    }
    
    // Update the sidebar content
    if (detailTitle) detailTitle.textContent = nodeInfo.title;
    
    // Prepare description HTML
    let descriptionHtml = '';
    let descriptionArabicHtml = '';
    let hasArabicDescription = false;
    
    if (nodeInfo.description) {
      // Convert URLs to clickable links for English description
      const linkedDescription = nodeInfo.description.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      descriptionHtml = `<div class="node-description">${linkedDescription}</div>`;
      
      // Use translation helper to get Arabic description
      let arabicDesc = nodeInfo.descriptionAr || nodeInfo.description_ar || 
                     stepData?.descriptionAr || stepData?.description_ar;
      
      // If no Arabic description is available, create one with our helper
      if (!arabicDesc || arabicDesc.trim() === '') {
        arabicDesc = createArabicPlaceholder(nodeInfo.description);
      }
      
      // Always set hasArabicDescription to true so language toggle is always shown
      hasArabicDescription = true;
      
      // Convert URLs to clickable links for Arabic description
      const linkedArabicDescription = arabicDesc.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      
      descriptionArabicHtml = `<div class="node-description description-ar">${linkedArabicDescription}</div>`;
    }
    
    // Store current node resources (kept for potential future use)
    currentNodeResources = nodeInfo.resources || [];
    
    // View Resources button has been removed from the UI
    
    if (detailContent) {
      // Make sure we have title and description
      const title = nodeInfo.title || nodeInfo.label || nodeInfo.id || 'Unknown';
      const description = nodeInfo.description || 'No description available';
      
      // Only show the English description, no language toggle
      detailContent.innerHTML = 
        '<h2 style="color: #4080a0; margin-bottom: 8px;">' + title + '</h2>' +
        '<div class="detail-description">' +
        (descriptionHtml || ('<p>' + description + '</p>')) +
        '</div>' +
        resourcesHtml;
      // Show the sidebar - first remove hidden then add active for proper transition
      nodeSidebar.classList.remove('hidden');
      setTimeout(() => {
        nodeSidebar.classList.add('active');
      }, 10);
    }
  });
  
  // Setup zoom controls
  const zoomIn = document.getElementById('cy-zoom-in');
  if (zoomIn) {
    zoomIn.addEventListener('click', () => {
      cy.zoom({
        level: cy.zoom() * 1.2,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 }
      });
    });
  }
  
  const zoomOut = document.getElementById('cy-zoom-out');
  if (zoomOut) {
    zoomOut.addEventListener('click', () => {
      cy.zoom({
        level: cy.zoom() * 0.8,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 }
      });
    });
  }
  
  const resetZoom = document.getElementById('cy-reset');
  if (resetZoom) {
    resetZoom.addEventListener('click', () => {
      cy.fit();
      cy.center();
    });
  }
}
