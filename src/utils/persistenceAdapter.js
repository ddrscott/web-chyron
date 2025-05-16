/**
 * Persistence Adapter for Chyron Application
 * 
 * Provides a consistent interface for storing and retrieving data
 * Currently uses localStorage, but designed to be replaceable with
 * other storage mechanisms like Firebase in the future.
 */

// Default data structure with reasonable defaults
const DEFAULT_DATA = {
  segments: [
    {
      id: '1',
      name: 'Introduction',
      description: 'Welcome and show overview',
      timecode: '00:00'
    },
    {
      id: '2',
      name: 'News Recap',
      description: 'This week\'s tech highlights',
      timecode: '05:00'
    },
    {
      id: '3',
      name: 'Guest Interview',
      description: 'Sarah Johnson, AI Researcher',
      timecode: '15:00'
    },
    {
      id: '4',
      name: 'Demo Segment',
      description: 'Live code demonstration',
      timecode: '30:00'
    },
    {
      id: '5',
      name: 'Q&A Session',
      description: 'Audience questions',
      timecode: '45:00'
    },
    {
      id: '6',
      name: 'Closing Remarks',
      description: 'Summary and next week\'s preview',
      timecode: '55:00'
    }
  ],
  script: `# Show Script

## Introduction
- Welcome viewers to the show
- Introduce today's topics
- Brief overview of the schedule

## News Recap
- Tech story 1: Latest Apple announcements
- Tech story 2: AI developments this week
- Tech story 3: Open source highlights

## Guest Interview
- Introduce Sarah Johnson, AI Researcher
- Question 1: What's your background in AI?
- Question 2: Current projects and research
- Question 3: Future of AI ethics

## Demo Segment
- Setup the demonstration environment
- Show key features and functionality
- Explain technical concepts

## Q&A Session
- Address viewer questions from chat
- Dive deeper on popular topics

## Closing Remarks
- Summarize key takeaways
- Preview next week's topics
- Thank viewers and sponsors`,
  guests: [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'AI Research Lead, OpenMind Labs'
    },
    {
      id: '2',
      name: 'David Chen',
      title: 'Full Stack Developer, TechStart'
    },
    {
      id: '3',
      name: 'Maria Rodriguez',
      title: 'Product Design Director, UXFlow'
    }
  ],
  settings: {
    chyron: {
      name: 'John Doe',
      title: 'Software Engineer',
      icon: 'users', // users, award, info
      position: 'top', // top, middle, bottom
      style: 'default' // default, centered, minimal
    },
    display: {
      theme: 'cupcake',
      autoSave: false,
      showTimecodes: true
    }
  },
  activeSegment: null,
  activeGuest: null
};

// Storage key for the entire application data
const STORAGE_KEY = 'chyron_app_data';

/**
 * Initialize the storage with default data if it doesn't exist
 * @returns {Object} The current data
 */
function initStorage() {
  // Check if we can use localStorage
  const canUseStorage = typeof window !== 'undefined' && window.localStorage;
  
  if (!canUseStorage) {
    console.warn('LocalStorage is not available. Data will not persist between sessions.');
    return { ...DEFAULT_DATA };
  }
  
  // Get existing data or initialize with defaults
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
    return { ...DEFAULT_DATA };
  }
  
  try {
    return JSON.parse(existingData);
  } catch (error) {
    console.error('Failed to parse stored data', error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
    return { ...DEFAULT_DATA };
  }
}

/**
 * Get the entire data object
 * @returns {Object} The current data
 */
function getData() {
  // Check if we can use localStorage
  const canUseStorage = typeof window !== 'undefined' && window.localStorage;
  
  if (!canUseStorage) {
    return { ...DEFAULT_DATA };
  }
  
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) {
    return initStorage();
  }
  
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Failed to parse stored data', error);
    return { ...DEFAULT_DATA };
  }
}

/**
 * Save the entire data object
 * @param {Object} data - The data to save
 */
function saveData(data) {
  // Check if we can use localStorage
  const canUseStorage = typeof window !== 'undefined' && window.localStorage;
  
  if (!canUseStorage) {
    console.warn('LocalStorage is not available. Data will not persist between sessions.');
    return;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Get a specific section of data
 * @param {string} section - The section to get (segments, script, guests, settings)
 * @returns {any} The requested data section
 */
function getSection(section) {
  const data = getData();
  return data[section] || DEFAULT_DATA[section];
}

/**
 * Update a specific section of data
 * @param {string} section - The section to update (segments, script, guests, settings)
 * @param {any} newData - The new data for this section
 */
function updateSection(section, newData) {
  const data = getData();
  data[section] = newData;
  saveData(data);
}

/**
 * Set the active segment
 * @param {string} segmentId - The ID of the active segment
 */
function setActiveSegment(segmentId) {
  const data = getData();
  data.activeSegment = segmentId;
  saveData(data);
}

/**
 * Get the active segment
 * @returns {Object|null} The active segment or null
 */
function getActiveSegment() {
  const data = getData();
  
  if (!data.activeSegment) {
    return null;
  }
  
  const segments = data.segments || [];
  return segments.find(segment => segment.id === data.activeSegment) || null;
}

/**
 * Set the active guest
 * @param {string} guestId - The ID of the active guest
 */
function setActiveGuest(guestId) {
  const data = getData();
  data.activeGuest = guestId;
  saveData(data);
}

/**
 * Get the active guest
 * @returns {Object|null} The active guest or null
 */
function getActiveGuest() {
  const data = getData();
  
  if (!data.activeGuest) {
    return null;
  }
  
  const guests = data.guests || [];
  return guests.find(guest => guest.id === data.activeGuest) || null;
}

/**
 * Add a new segment
 * @param {Object} segment - The segment to add
 * @returns {string} The ID of the new segment
 */
function addSegment(segment) {
  const data = getData();
  const segments = data.segments || [];
  
  // Generate a new ID
  const newId = Date.now().toString();
  const newSegment = {
    id: newId,
    ...segment
  };
  
  segments.push(newSegment);
  data.segments = segments;
  saveData(data);
  
  return newId;
}

/**
 * Update a segment
 * @param {string} segmentId - The ID of the segment to update
 * @param {Object} updates - The updates to apply
 * @returns {boolean} Whether the update was successful
 */
function updateSegment(segmentId, updates) {
  const data = getData();
  const segments = data.segments || [];
  
  const index = segments.findIndex(segment => segment.id === segmentId);
  if (index === -1) {
    return false;
  }
  
  segments[index] = { ...segments[index], ...updates };
  data.segments = segments;
  saveData(data);
  
  return true;
}

/**
 * Delete a segment
 * @param {string} segmentId - The ID of the segment to delete
 * @returns {boolean} Whether the deletion was successful
 */
function deleteSegment(segmentId) {
  const data = getData();
  const segments = data.segments || [];
  
  const filteredSegments = segments.filter(segment => segment.id !== segmentId);
  if (filteredSegments.length === segments.length) {
    return false;
  }
  
  data.segments = filteredSegments;
  
  // Clear active segment if needed
  if (data.activeSegment === segmentId) {
    data.activeSegment = null;
  }
  
  // If we have no segments left but had deleted the last one, select first available
  if (filteredSegments.length > 0 && segments.length !== filteredSegments.length && data.activeSegment === null) {
    data.activeSegment = filteredSegments[0].id;
  }
  
  saveData(data);
  return true;
}

/**
 * Add a new guest
 * @param {Object} guest - The guest to add
 * @returns {string} The ID of the new guest
 */
function addGuest(guest) {
  const data = getData();
  const guests = data.guests || [];
  
  // Generate a new ID
  const newId = Date.now().toString();
  const newGuest = {
    id: newId,
    ...guest
  };
  
  guests.push(newGuest);
  data.guests = guests;
  saveData(data);
  
  return newId;
}

/**
 * Update a guest
 * @param {string} guestId - The ID of the guest to update
 * @param {Object} updates - The updates to apply
 * @returns {boolean} Whether the update was successful
 */
function updateGuest(guestId, updates) {
  const data = getData();
  const guests = data.guests || [];
  
  const index = guests.findIndex(guest => guest.id === guestId);
  if (index === -1) {
    return false;
  }
  
  guests[index] = { ...guests[index], ...updates };
  data.guests = guests;
  saveData(data);
  
  return true;
}

/**
 * Delete a guest
 * @param {string} guestId - The ID of the guest to delete
 * @returns {boolean} Whether the deletion was successful
 */
function deleteGuest(guestId) {
  const data = getData();
  const guests = data.guests || [];
  
  const filteredGuests = guests.filter(guest => guest.id !== guestId);
  if (filteredGuests.length === guests.length) {
    return false;
  }
  
  data.guests = filteredGuests;
  
  // Clear active guest if needed
  if (data.activeGuest === guestId) {
    data.activeGuest = null;
  }
  
  // If we have no guests left but had deleted the last one, select first available
  if (filteredGuests.length > 0 && guests.length !== filteredGuests.length && data.activeGuest === null) {
    data.activeGuest = filteredGuests[0].id;
  }
  
  saveData(data);
  return true;
}

/**
 * Update the script
 * @param {string} script - The new script content
 */
function updateScript(script) {
  const data = getData();
  data.script = script;
  saveData(data);
}

/**
 * Update settings
 * @param {Object} settings - The new settings
 */
function updateSettings(settings) {
  const data = getData();
  data.settings = { ...data.settings, ...settings };
  saveData(data);
}

/**
 * Update chyron settings specifically
 * @param {Object} chyronSettings - The new chyron settings
 */
function updateChyronSettings(chyronSettings) {
  const data = getData();
  data.settings.chyron = { ...data.settings.chyron, ...chyronSettings };
  saveData(data);
}

/**
 * Update display settings specifically
 * @param {Object} displaySettings - The new display settings
 */
function updateDisplaySettings(displaySettings) {
  const data = getData();
  data.settings.display = { ...data.settings.display, ...displaySettings };
  saveData(data);
}

// Export the public API
export default {
  initStorage,
  getData,
  saveData,
  getSection,
  updateSection,
  setActiveSegment,
  getActiveSegment,
  setActiveGuest,
  getActiveGuest,
  addSegment,
  updateSegment,
  deleteSegment,
  addGuest,
  updateGuest,
  deleteGuest,
  updateScript,
  updateSettings,
  updateChyronSettings,
  updateDisplaySettings
};