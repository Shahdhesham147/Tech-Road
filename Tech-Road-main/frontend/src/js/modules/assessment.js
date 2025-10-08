// assessment.js - Handles the assessment flow

// Assessment questions
export const assessmentQuestions = [
  {
    question: "Which aspect of technology interests you the most?",
    options: [
      "Building user interfaces and visual designs", 
      "Working with data and algorithms",
      "Creating software that runs on servers",
      "Developing mobile applications",
      "Working with artificial intelligence and machine learning"
    ]
  },
  {
    question: "What is your current skill level with programming?",
    options: [
      "Beginner - little to no experience", 
      "Intermediate - some experience with basic concepts",
      "Advanced - comfortable with multiple languages",
      "Expert - professional experience in software development"
    ]
  },
  {
    question: "What type of problems do you enjoy solving?",
    options: [
      "Visual and creative problems",
      "Mathematical and analytical problems",
      "System architecture and optimization problems",
      "User experience and interaction problems",
      "Data analysis and pattern recognition problems"
    ]
  }
];

/**
 * Displays a question from the assessment
 * @param {number} index - Index of the question to display
 * @param {HTMLElement} container - Container to render the question in
 * @param {Function} onNext - Callback when "Next" button is clicked
 * @param {Array} userAnswers - Array to store user answers
 */
export function showQuestion(index, container, onNext, userAnswers) {
  console.log(`Showing question ${index}`);
  
  if (index >= assessmentQuestions.length) {
    onNext();
    return;
  }
  
  const question = assessmentQuestions[index];
  console.log("Question data:", question);
  
  const questionElement = document.createElement('div');
  questionElement.className = 'assessment-question';
  questionElement.innerHTML = `
    <h2>Question ${index + 1}</h2>
    <p>${question.question}</p>
    <div class="options-container">
      ${question.options.map((option, i) => `
        <div class="option">
          <input type="radio" name="q${index}" id="q${index}o${i}" value="${i}">
          <label for="q${index}o${i}">${option}</label>
        </div>
      `).join('')}
    </div>
    <button id="next-question" class="primary-button">Next</button>
  `;
  
  // Clear and append the new question
  console.log("Appending question to container");
  container.innerHTML = ''; // Clear any existing content first
  container.appendChild(questionElement);
  
  // Add event listener to the next button
  const nextButton = document.getElementById('next-question');
  console.log("Next button found:", !!nextButton);
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      console.log("Next button clicked for question", index);
      
      // Get the selected answer
      const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
      if (selectedOption) {
        userAnswers[index] = parseInt(selectedOption.value, 10);
        console.log(`Answer for question ${index}: ${userAnswers[index]}`);
        
        // Move to the next question or complete the assessment
        if (index + 1 < assessmentQuestions.length) {
          showQuestion(index + 1, container, onNext, userAnswers);
        } else {
          onNext();
        }
      } else {
        alert('Please select an answer before proceeding.');
      }
    });
  } else {
    console.error("Next button not found!");
  }
}

/**
 * Analyzes assessment results and determines the recommended roadmap
 * @param {Array} userAnswers - Array of user's answers to the assessment questions
 * @param {Array} allRoadmaps - All available roadmaps to choose from
 * @returns {Object|null} The recommended roadmap or null if none found
 */
export function analyzeResults(userAnswers, allRoadmaps) {
  console.log("Analyzing assessment results...");
  console.log("User answers:", userAnswers);
  
  // Make sure we have all the answers
  if (userAnswers.length < assessmentQuestions.length) {
    console.error("Incomplete answers. Expected", assessmentQuestions.length, "got", userAnswers.length);
    return null;
  }
  
  // Track affinities based on user answers - using exact track names from your data
  const trackAffinities = {
    'frontend': 0,
    'backend': 0,
    'full-stack': 0,
    'data-analyst': 0,
    'ai-engineer': 0,
    'flutter': 0,
    'cyber-security': 0,
    'ux-design': 0
  };
  
  console.log("Track affinities initialized:", trackAffinities);
  
  // Question 1: Interest area
  switch(userAnswers[0]) {
    case 0: // UI and visual design
      trackAffinities['frontend'] += 3;
      trackAffinities['ux-design'] += 2;
      trackAffinities['flutter'] += 1;
      break;
    case 1: // Data and algorithms
      trackAffinities['data-analyst'] += 3;
      trackAffinities['backend'] += 2;
      trackAffinities['ai-engineer'] += 1;
      break;
    case 2: // Server software
      trackAffinities['backend'] += 3;
      trackAffinities['full-stack'] += 2;
      trackAffinities['cyber-security'] += 1;
      break;
    case 3: // Mobile apps
      trackAffinities['flutter'] += 3;
      trackAffinities['frontend'] += 1;
      trackAffinities['full-stack'] += 1;
      break;
    case 4: // AI and ML
      trackAffinities['ai-engineer'] += 3;
      trackAffinities['data-analyst'] += 2;
      break;
  }
  
  // Question 2: Skill level - adjust weights based on experience
  const experienceLevel = userAnswers[1];
  
  // Question 3: Problem-solving preference
  switch(userAnswers[2]) {
    case 0: // Visual and creative
      trackAffinities['ux-design'] += 3;
      trackAffinities['frontend'] += 2;
      break;
    case 1: // Mathematical and analytical
      trackAffinities['data-analyst'] += 3;
      trackAffinities['ai-engineer'] += 2;
      break;
    case 2: // System architecture
      trackAffinities['backend'] += 3;
      trackAffinities['full-stack'] += 2;
      trackAffinities['cyber-security'] += 1;
      break;
    case 3: // User experience
      trackAffinities['frontend'] += 3;
      trackAffinities['ux-design'] += 2;
      trackAffinities['flutter'] += 1;
      break;
    case 4: // Data analysis and patterns
      trackAffinities['ai-engineer'] += 3;
      trackAffinities['data-analyst'] += 2;
      break;
  }
  
  // Find track with highest affinity
  let highestAffinity = -1;
  let recommendedTrackName = '';
  
  for (const [track, affinity] of Object.entries(trackAffinities)) {
    console.log(`Track "${track}" affinity: ${affinity}`);
    if (affinity > highestAffinity) {
      highestAffinity = affinity;
      recommendedTrackName = track;
    }
  }
  
  console.log(`Highest affinity: ${recommendedTrackName} (${highestAffinity})`);
  
  // Find matching roadmap from our data
  let recommendedRoadmap = allRoadmaps.find(roadmap => 
    roadmap.track_name && roadmap.track_name.toLowerCase() === recommendedTrackName
  );
  
  // If no exact match, try a partial match
  if (!recommendedRoadmap) {
    console.log("No exact match found, trying partial match");
    recommendedRoadmap = allRoadmaps.find(roadmap => 
      roadmap.track_name && roadmap.track_name.toLowerCase().includes(recommendedTrackName)
    );
  }
  
  // If still no match, pick the first one with the track name as fallback
  if (!recommendedRoadmap && allRoadmaps.length > 0) {
    console.log("No match found, using first roadmap as fallback");
    recommendedRoadmap = allRoadmaps[0];
  }
  
  return recommendedRoadmap;
}
