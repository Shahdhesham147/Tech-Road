// index.js - Main entry point that glues all modules together

import * as api from './api.js';
import * as assessment from './assessment.js';
import * as tracks from './tracks.js';
import { loadRoadmapDetails } from './renderSteps.js';

document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  const trackList = document.getElementById("track-list");
  const userAssessment = document.getElementById("user-assessment");
  const startAssessmentButton = document.getElementById("start-assessment");
  const assessmentContainer = document.getElementById("assessment-container");
  const roadmapContainer = document.getElementById("roadmap-container");
  const trackSidebar = document.getElementById("track-sidebar");
  const recommendedTrack = document.getElementById("recommended-track");
  
  // Debug: Check if elements are found
  console.log("Elements found:", {
    startAssessmentButton: !!startAssessmentButton,
    assessmentContainer: !!assessmentContainer
  });
  
  // Store all roadmaps data globally
  let allRoadmaps = [];
  let currentQuestion = 0;
  let userAnswers = [];
  let recommendedRoadmap = null;
  
  // Check if backend is available and load roadmaps
  api.checkBackendStatus().then(isAvailable => {
    if (isAvailable) {
      // Show a loading message
      userAssessment.innerHTML = `
        <div style="padding: 10px; color: #0c5460; background-color: #d1ecf1; border: 1px solid #bee5eb; border-radius: 5px; margin: 10px 0;">
          <p><i class="fas fa-sync fa-spin"></i> Loading roadmaps data...</p>
        </div>
      `;
      
      // Fetch roadmaps
      api.fetchRoadmaps()
        .then(data => {
          allRoadmaps = data;
          
          // Process roadmaps data to populate track list
          tracks.handleRoadmapsData(data, trackList, loadSelectedTrack);
          
          // Show assessment start UI
          userAssessment.innerHTML = `
            <div class="assessment-intro">
              <h2>Find Your Path in Tech</h2>
              <p>Answer a few questions to get a personalized tech roadmap.</p>
              <p>Ready to find your ideal tech path? Click the "Start Assessment" button to begin.</p>
              <button id="start-assessment" class="primary-button">Start Assessment</button>
            </div>
          `;
          
          // Reattach event listener to the new button
          document.getElementById("start-assessment").addEventListener("click", startAssessment);
        })
        .catch(error => {
          userAssessment.innerHTML = `
            <div style="padding: 10px; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; margin: 10px 0;">
              <p>Error loading roadmaps data: ${error.message}</p>
              <p>Please refresh the page or try again later.</p>
            </div>
          `;
        });
    } else {
      userAssessment.innerHTML = `
        <div style="padding: 10px; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; margin: 10px 0;">
          <p>Backend service is not available. Please make sure the server is running.</p>
          <p>Server URL: http://localhost:3000</p>
        </div>
      `;
    }
  });
  
  // Start the assessment when the button is clicked
  if (startAssessmentButton) {
    startAssessmentButton.addEventListener("click", startAssessment);
  }
  
  // Start the assessment process
  function startAssessment() {
    console.log("Start Assessment button clicked!");
    // Hide the start button and show the first question
    assessmentContainer.innerHTML = '';
    assessment.showQuestion(0, assessmentContainer, analyzeAndShowResults, userAnswers);
  }
  
  // Analyze results and show recommendation
  function analyzeAndShowResults() {
    // Analyze the results
    recommendedRoadmap = assessment.analyzeResults(userAnswers, allRoadmaps);
    
    // Show the recommendation UI
    tracks.showRecommendation(
      recommendedRoadmap, 
      trackSidebar, 
      recommendedTrack, 
      assessmentContainer, 
      loadRecommendedRoadmap
    );
  }
  
  // Load the recommended roadmap
  function loadRecommendedRoadmap(id) {
    // Make sure the track sidebar is visible
    tracks.showTrackSidebar('track-sidebar');
    
    // Load the roadmap
    loadRoadmap(id);
  }
  
  // Load a selected track/roadmap
  function loadSelectedTrack(roadmap) {
    const id = roadmap._id;
    loadRoadmap(id);
  }
  
  // Dynamic roadmap loader using Cytoscape
  async function loadRoadmap(id) {
    console.log("Loading roadmap for:", id);
    
    try {
      // Load roadmap details
      await loadRoadmapDetails(
        id,
        api.fetchRoadmapById,
        'roadmap-title',
        'roadmap-steps',
        'roadmap-container',
        'loading-indicator',
        'cy'
      );
    } catch (error) {
      console.error("Error loading roadmap:", error);
    }
  }
});
