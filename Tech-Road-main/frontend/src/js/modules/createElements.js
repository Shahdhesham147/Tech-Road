/**
 * Create Cytoscape elements from roadmap steps
 * @param {Array} steps - The steps to convert to elements
 * @returns {Array} Cytoscape elements with nodes and edges
 */
export function createCytoscapeElements(steps) {
  console.log("Creating Cytoscape elements from steps:", steps);
  
  // Create collections for all elements
  const elements = [];
  
  // Track relationships between nodes
  const relationships = [];
  
  // Create nodes first
  steps.forEach((step, index) => {
    // Make sure step has an id
    const id = step.id || ('step-' + index);
    
    // Basic node data
    const nodeData = {
      id: id,
      title: step.name || step.title || ('Step ' + (index + 1)),
      label: step.name || step.title || ('Step ' + (index + 1)),
      index: index, // Store the index to lookup in steps array later
      type: step.type || 'default',
      hasContent: !!step.content,
      description: step.description || '',
      originalData: step // Store the original data for reference
    };
    
    // If there are resources, mark the node
    if ((step.links && step.links.length > 0) || 
        (step.resources && step.resources.length > 0) ||
        (step.content && step.content.resources && step.content.resources.length > 0)) {
      nodeData.hasResources = true;
    }
    
    // Check for prerequisites and dependencies to create edges later
    if (step.prerequisites && Array.isArray(step.prerequisites)) {
      step.prerequisites.forEach(preId => {
        relationships.push({ source: preId, target: id });
      });
    }
    
    // Add any additional data from the step
    if (step.content) {
      nodeData.content = step.content;
      nodeData.description = step.content.description || step.description;
      
      // Also copy the title if available
      if (step.content.title) {
        nodeData.title = step.content.title;
      }
    } else {
      nodeData.description = step.description;
    }
    
    // Handle resources properly
    nodeData.resources = [];
    
    // Gather resources from all possible locations
    if (step.links && Array.isArray(step.links)) {
      nodeData.resources = [...nodeData.resources, ...step.links];
    }
    
    if (step.resources && Array.isArray(step.resources)) {
      nodeData.resources = [...nodeData.resources, ...step.resources];
    }
    
    if (step.content && step.content.resources && Array.isArray(step.content.resources)) {
      nodeData.resources = [...nodeData.resources, ...step.content.resources];
    }
    
    // Add the node to elements
    elements.push({
      group: 'nodes',
      data: nodeData
    });
    
    // Create edges for this node's connections
    if (step.connections && Array.isArray(step.connections)) {
      step.connections.forEach(targetId => {
        elements.push({
          group: 'edges',
          data: {
            id: id + '-' + targetId,
            source: id,
            target: targetId
          }
        });
      });
    }
    
    // Also look for "requires" relationships
    if (step.requires && Array.isArray(step.requires)) {
      step.requires.forEach(sourceId => {
        elements.push({
          group: 'edges',
          data: {
            id: sourceId + '-' + id,
            source: sourceId,
            target: id
          }
        });
      });
    }
  });
  
  // If no explicit connections, infer a linear path
  let hasExplicitConnections = elements.some(el => el.group === 'edges');
  
  if (!hasExplicitConnections && steps.length > 1) {
    console.log("No explicit connections found, creating linear path");
    
    for (let i = 0; i < steps.length - 1; i++) {
      const source = steps[i].id || ('step-' + i);
      const target = steps[i + 1].id || ('step-' + (i + 1));
      
      elements.push({
        group: 'edges',
        data: {
          id: source + '-' + target,
          source: source,
          target: target
        }
      });
    }
  }
  
  return elements;
}
