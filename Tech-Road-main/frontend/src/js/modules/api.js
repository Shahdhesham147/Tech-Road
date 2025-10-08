// api.js - Handles all API communication with the backend

/**
 * Check if the backend API is available
 * @returns {Promise<boolean>} True if the backend is available, false otherwise
 */
export function checkBackendStatus() {
  return fetch("http://localhost:3000", {
    method: 'GET',
    mode: 'cors',
    credentials: 'same-origin'
  })
    .then(response => {
      if (!response.ok) {
        console.error(`Backend server error: ${response.status} - ${response.statusText}`);
        throw new Error(`Backend server returned ${response.status}`);
      }
      return true;
    })
    .catch(error => {
      console.error("Backend connection error:", error);
      return false;
    });
}

/**
 * Fetch all roadmaps from the API
 * @returns {Promise<Array>} List of roadmaps
 */
export function fetchRoadmaps() {
  console.log("Fetching roadmaps from API");
  return fetch("http://localhost:3000/api/roadmaps", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    credentials: 'same-origin'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch roadmaps: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Received roadmaps data:", data);
      return data;
    })
    .catch(error => {
      console.error("Error fetching roadmaps:", error);
      return [];
    });
}

/**
 * Fetch a specific roadmap by its ID
 * @param {string} id - The ID of the roadmap to fetch
 * @returns {Promise<Object>} The roadmap data
 */
export function fetchRoadmapById(id) {
  console.log(`Fetching from API: http://localhost:3000/api/roadmaps/${id}`);
  return fetch(`http://localhost:3000/api/roadmaps/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    credentials: 'same-origin'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch roadmap: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Roadmap data received:", data);
      return data;
    })
    .catch(error => {
      console.error("Error fetching roadmap:", error);
      return null;
    });
}

/**
 * Fetch a roadmap by its slug
 * @param {string} slug - The slug of the roadmap
 * @returns {Promise<Object>} The roadmap data
 */
export function fetchRoadmapBySlug(slug) {
  console.log(`Fetching from API: http://localhost:3000/api/roadmaps/${slug}`);
  return fetch(`http://localhost:3000/api/roadmaps/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    credentials: 'same-origin'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch roadmap: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Roadmap data received:", data);
      return data;
    })
    .catch(error => {
      console.error("Error fetching roadmap:", error);
      return null;
    });
}
