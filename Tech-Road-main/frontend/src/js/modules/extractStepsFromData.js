/**
 * Extract steps from the roadmap data, handling different          // Create base node
          const node = {
            id: itemId,
            title: item.name || item.title || "Unnamed Step",
            name: item.name || item.title || "Unnamed Step", 
            description: item.description || "",
            descriptionAr: item.description_ar || item.descriptionAr || "",
            type: item.level || "intermediate",
            resources: item.links || [],
            links: item.links || [],
            // Set any connections if they exist
            connections: item.connects_to ? item.connects_to.map(targetName => {tures
 * @param {Object} data - The roadmap data
 * @returns {Array} The steps to visualize
 */
import { ensureNodeTranslations, createArabicPlaceholder } from './translationHelper.js';

export function extractStepsFromData(data) {
  console.log("Analyzing roadmap data structure:", JSON.stringify(data, null, 2));
  
  // Safety check
  if (!data) {
    console.error("Data is null or undefined");
    return [];
  }
  
  // MongoDB document might be in raw format
  if (data._doc) {
    data = data._doc;
  }
  
  // Special case for Tech Road format with data field containing object with multiple entries
  if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
    console.log("Found Tech Road data format with data object");
    
    // Convert the data object to an array of items
    const dataEntries = Object.entries(data.data).map(([id, item]) => {
      if (!item || typeof item !== 'object') return null;
      
      // Create node with basic properties
      const node = {
        id: id,
        title: item.title || "Unnamed Step",
        description: item.description || "",
        descriptionAr: item.description_ar || item.descriptionAr || "",
        links: Array.isArray(item.links) ? item.links : [],
        type: item.level || "intermediate"
      };
      
      // Ensure node has both English and Arabic descriptions
      return ensureNodeTranslations(node);
    }).filter(item => item !== null && item.title); // Filter out empty items and items without titles
    
    console.log(`Extracted ${dataEntries.length} valid data entries`);
    return dataEntries;
  }
  
  // Check if this is our specific database format for roadmaps
  if (data.content && typeof data.content === 'string') {
    try {
      const contentObj = JSON.parse(data.content);
      console.log("Successfully parsed roadmap content:", contentObj);
      
      if (contentObj && Array.isArray(contentObj) && contentObj.length > 0) {
        console.log("Found content array with roadmap data");
        
        // Create nodes with the expected format for visualization
        return contentObj.map(item => {
          // Generate a unique ID if none exists
          const itemId = item.id || item.name?.toLowerCase().replace(/\s+/g, '-') || 
                        `node-${Math.random().toString(36).substring(2, 9)}`;
          
          // Create node with basic properties
          const node = {
            id: itemId,
            title: item.name || item.title || "Unnamed Step",
            name: item.name || item.title || "Unnamed Step", 
            description: item.description || "",
            descriptionAr: item.description_ar || item.descriptionAr || "",
            type: item.level || "intermediate",
            resources: item.links || [],
            links: item.links || [],
            // Set any connections if they exist
            connections: item.connects_to ? item.connects_to.map(targetName => {
              // Find the target node by name
              const targetNode = contentObj.find(node => node.name === targetName);
              // Return target ID if found, otherwise return the name as is
              return targetNode ? targetNode.id || targetNode.name.toLowerCase().replace(/\s+/g, '-') : 
                      targetName.toLowerCase().replace(/\s+/g, '-');
            }) : []
          };
          
          // Ensure node has both English and Arabic descriptions
          return ensureNodeTranslations(node);
        });
      }
    } catch (e) {
      console.warn("Failed to parse content as JSON:", e);
    }
  }
  
  // Check if this is a roadmap.sh style data format
  const hasSteps = !!data.steps && Array.isArray(data.steps);
  const hasNestedData = !!data.data && typeof data.data === 'object';
  const hasNestedSteps = hasNestedData && !!data.data.steps && Array.isArray(data.data.steps);
  const hasNodes = !!data.nodes && Array.isArray(data.nodes);
  const hasItems = !!data.items && Array.isArray(data.items);
  const hasTrack = !!data.track && typeof data.track === 'object';
  
  console.log({
    hasSteps,
    hasNestedData,
    hasNestedSteps,
    hasNodes,
    hasItems,
    hasTrack
  });
  
  // First, try to use steps directly from the data
  if (hasSteps && data.steps.length > 0) {
    console.log("Using steps directly from data object");
    return data.steps;
  }
  
  // Next, try to use steps from the nested data object (roadmap.sh format)
  if (hasNestedSteps && data.data.steps.length > 0) {
    console.log("Using steps from nested data.steps object");
    return data.data.steps;
  }
  
  // Try nodes array if available (common graph format)
  if (hasNodes && data.nodes.length > 0) {
    console.log("Using nodes array as steps");
    return data.nodes;
  }
  
  // Try items array if available
  if (hasItems && data.items.length > 0) {
    console.log("Using items array as steps");
    return data.items;
  }
  
  // Try track content if available
  if (hasTrack && data.track) {
    console.log("Analyzing track data structure");
    
    // Try track.steps
    if (data.track.steps && Array.isArray(data.track.steps) && data.track.steps.length > 0) {
      console.log("Using track.steps array");
      return data.track.steps;
    }
    
    // Try track.skills
    if (data.track.skills && Array.isArray(data.track.skills) && data.track.skills.length > 0) {
      console.log("Using track.skills array as steps");
      return data.track.skills.map(skill => ({
        id: skill._id || skill.id || `skill-${Math.random().toString(36).substr(2, 9)}`,
        title: skill.name || skill.title || "Skill",
        description: skill.description || "No description available",
        type: skill.level || "intermediate"
      }));
    }
  }
  
  // If we have a data.content property and it contains a valid JSON string
  if (data.content) {
    try {
      console.log("Trying to parse data.content");
      const parsedContent = typeof data.content === 'string' 
        ? JSON.parse(data.content) 
        : data.content;
      
      if (parsedContent) {
        if (parsedContent.steps && Array.isArray(parsedContent.steps)) {
          console.log("Using steps from parsed content");
          return parsedContent.steps;
        } else if (parsedContent.nodes && Array.isArray(parsedContent.nodes)) {
          console.log("Using nodes from parsed content");
          return parsedContent.nodes;
        }
      }
    } catch (error) {
      console.warn("Failed to parse data.content as JSON:", error);
    }
  }

  // If we have track_name or track_id, we can create a basic step structure
  if (data.track_name || data.track_id) {
    console.log("Creating basic steps from track info");
    return [
      ensureNodeTranslations({
        id: 'start',
        title: 'Start Learning',
        description: 'Begin your journey',
        type: 'beginner'
      }),
      ensureNodeTranslations({
        id: 'middle',
        title: data.track_name || 'Core Concepts',
        description: 'Master the fundamentals',
        type: 'intermediate'
      }),
      ensureNodeTranslations({
        id: 'end',
        title: 'Advanced Topics',
        description: 'Become an expert',
        type: 'advanced'
      })
    ];
  }
  
  // As a fallback, create a single step from the data itself
  if (data.title || data.name) {
    console.log("Creating a single step from the data itself");
    return [ensureNodeTranslations({
      id: 'root',
      title: data.title || data.name,
      description: data.description || 'No description available',
      type: 'beginner'
    })];
  }
  
  // Create default steps if nothing else works
  console.warn("Creating default steps as no data structure was recognized");
  return [
    ensureNodeTranslations({
      id: 'default-1',
      title: 'Getting Started',
      description: 'Begin your learning journey',
      type: 'beginner'
    }),
    ensureNodeTranslations({
      id: 'default-2',
      title: 'Building Skills',
      description: 'Develop your expertise',
      type: 'intermediate'
    })
  ];
}
