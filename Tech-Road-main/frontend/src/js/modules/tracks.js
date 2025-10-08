// tracks.js - Manages track sidebar and recommendations

/**
 * Format track names consistently
 * @param {string} name - Track name to format
 * @returns {string} Formatted track name
 */
export function formatTrackName(name) {
  if (!name) return 'Unnamed Track';
  
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Process roadmap data and populate the track list sidebar
 * @param {Array} data - List of roadmaps
 * @param {HTMLElement} trackListElement - DOM element for the track list
 * @param {Function} onTrackSelect - Callback when a track is selected
 */
export function handleRoadmapsData(data, trackListElement, onTrackSelect) {
  trackListElement.innerHTML = ""; // Clear previous content
  
  if (!data || data.length === 0) {
    trackListElement.innerHTML = `
      <div class="alert alert-info">
        No roadmaps available. Please check the backend service.
      </div>
    `;
    return;
  }
  
  // Create a map of track names to avoid duplicates
  const trackMap = new Map();
  
  // Process all roadmaps and group by track name
  data.forEach(roadmap => {
    if (!roadmap || !roadmap.track_name) {
      console.warn("Skipping invalid roadmap:", roadmap);
      return;
    }
    
    const trackName = roadmap.track_name.toLowerCase();
    const formattedName = formatTrackName(trackName);
    
    // If this is the first roadmap we've seen for this track, add it to our map
    if (!trackMap.has(trackName)) {
      trackMap.set(trackName, {
        name: formattedName,
        slug: trackName,
        roadmaps: []
      });
    }
    
    // Add this roadmap to the track
    trackMap.get(trackName).roadmaps.push(roadmap);
  });
  
  // If we have no valid tracks, show a message
  if (trackMap.size === 0) {
    trackListElement.innerHTML = `
      <div class="alert alert-warning">
        No valid roadmaps found. Please check the data format.
      </div>
    `;
    return;
  }
  
  // Sort tracks by name for better UX
  const sortedTracks = Array.from(trackMap.values())
    .sort((a, b) => a.name.localeCompare(b.name));
  
  // Create track list items
  sortedTracks.forEach(track => {
    const listItem = document.createElement('li');
    listItem.className = 'track-item';
    listItem.innerHTML = `
      <span>${track.name}</span>
    `;
    
    // Add click handler
    listItem.addEventListener("click", (e) => {
      // Remove active class from all items
      document.querySelectorAll('.track-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Add active class to clicked item
      listItem.classList.add('active');
      
      // If there are multiple roadmaps, use the first one
      const roadmap = track.roadmaps[0];
      onTrackSelect(roadmap, track.slug);
    });
    
    trackListElement.appendChild(listItem);
  });
}

/**
 * Display the recommended roadmap in the UI
 * @param {Object} recommendedRoadmap - The recommended roadmap
 * @param {HTMLElement} trackSidebar - The track sidebar element
 * @param {HTMLElement} recommendedTrackElement - Element to display the recommended track
 * @param {HTMLElement} assessmentContainer - Container for the assessment content
 * @param {Function} onViewRoadmap - Callback when the user clicks to view the roadmap
 */
export function showRecommendation(recommendedRoadmap, trackSidebar, recommendedTrackElement, assessmentContainer, onViewRoadmap) {
  console.log("Showing recommendation, recommended roadmap:", recommendedRoadmap);
  
  // Show the sidebar with tracks
  trackSidebar.classList.remove('hidden');
  
  if (!recommendedRoadmap) {
    assessmentContainer.innerHTML = `
      <div class="recommendation-result">
        <h2>We couldn't determine your best fit</h2>
        <p>Sorry, we couldn't find a matching roadmap based on your answers. Please select a track from the sidebar.</p>
      </div>
    `;
    return;
  }
  
  const trackId = recommendedRoadmap._id;
  const trackName = recommendedRoadmap.track_name || 'Recommended Track';
  const formattedTrackName = formatTrackName(trackName);
  
  // Update the recommended track in sidebar with improved visual design
  if (recommendedTrackElement) {
    recommendedTrackElement.innerHTML = `
      <div class="sidebar-section" style="margin-top:24px;">
        <h3 style="font-size:1.15rem;color:#4080a0;margin-bottom:8px;">Recommended Track</h3>
        <div class="recommended-track-card" style="display:flex;align-items:center;background:#f5faff;border-radius:8px;padding:12px 16px;box-shadow:0 2px 8px rgba(64,128,160,0.07);">
          <div class="track-icon" style="font-size:2rem;color:#4080a0;margin-right:12px;">
            <i class="fas fa-route"></i>
          </div>
          <div class="track-info">
            <div style="font-size:1.1rem;font-weight:600;color:#222;">${formattedTrackName}</div>
            <div style="font-size:0.95rem;color:#666;">Based on your assessment results</div>
          </div>
        </div>
      </div>
    `;
  }
  // Show the recommendation and buttons (no duplicate recommended path)
  assessmentContainer.innerHTML = `
    <div class="recommendation-result" style="margin-top:0;">
      <h2 style="color:#4080a0;font-size:1.3rem;margin-bottom:10px;">Your Results</h2>
      <p style="font-size:1rem;color:#444;">Based on your answers, we recommend the <span style="font-weight:600;color:#306080;">${formattedTrackName}</span> path.</p>
      <div class="button-group" style="margin-top:18px;display:flex;gap:12px;">
        <button id="view-roadmap" class="primary-button" style="flex:1;font-size:1rem;">View Roadmap</button>
        <button id="view-recommended" class="secondary-button" style="flex:1;font-size:1rem;">Learn More</button>
      </div>
    </div>
  `;
  
  // Add click handlers for both buttons
  document.getElementById('view-roadmap').addEventListener('click', () => {
    onViewRoadmap(recommendedRoadmap._id);
  });
  
  document.getElementById('view-recommended').addEventListener('click', () => {
    onViewRoadmap(recommendedRoadmap._id);
  });
}

/**
 * Update track sidebar visibility
 * @param {string} trackSidebarId - ID of the track sidebar element
 */
export function showTrackSidebar(trackSidebarId) {
  // Make sure the track sidebar is visible
  const trackSidebar = document.getElementById(trackSidebarId);
  if (trackSidebar) trackSidebar.classList.remove('hidden');
}
