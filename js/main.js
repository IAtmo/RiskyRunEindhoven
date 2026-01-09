// Main application entry point
import GameState from './gameState.js';
import { UIController } from './uiController.js';
import { MapController } from './mapController.js';
import { ExportController } from './exportController.js';
import { InteractionController } from './interactionController.js';

// Initialize application
async function initApp() {
    // Create game state
    const gameState = new GameState();
    
    // Initialize UI controller
    const uiController = new UIController(gameState);
    
    // Initialize map controller
    const mapController = new MapController(gameState, uiController);
    
    // Make mapController available globally for export functionality
    window.mapController = mapController;
    
    // Initialize export controller
    const exportController = new ExportController(gameState);
    
    // Initialize interaction controller
    const interactionController = new InteractionController(mapController.map);
    
    // Load geo data
    await mapController.loadGeoData();
    
    console.log('Risky Run Eindhoven initialized successfully');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
