// Interaction Controller - handles page controls and interactions
export class InteractionController {
    constructor(map) {
        this.map = map;
        this.setupPageLoadHandlers();
        this.setupControlHandlers();
    }
    
    setupPageLoadHandlers() {
        window.addEventListener('load', () => {
            const checkbox = document.getElementById("disablewebsiteControls");
            if (checkbox) {
                checkbox.checked = true;
                this.disableWebsiteControls();
                checkbox.addEventListener("change", () => this.disableWebsiteControls());
            }
        });
    }
    
    setupControlHandlers() {
        // Prevent reload functionality is handled by preventReload
        // Can be expanded with more control handlers if needed
    }
    
    disableWebsiteControls() {
        const checkbox = document.getElementById("disablewebsiteControls");
        if (!checkbox || !this.map) return;
        
        if (checkbox.checked) {
            this.disableMapInteraction();
            this.disablePageZoomAndScroll(true);
        } else {
            this.enableMapInteraction();
            this.disablePageZoomAndScroll(false);
        }
    }
    
    disableMapInteraction() {
        this.map.dragging.disable();
        this.map.doubleClickZoom.disable();
        this.map.scrollWheelZoom.disable();
        this.map.touchZoom.disable();
    }
    
    enableMapInteraction() {
        this.map.dragging.enable();
        this.map.doubleClickZoom.enable();
        this.map.scrollWheelZoom.enable();
        this.map.touchZoom.enable();
    }
    
    disablePageZoomAndScroll(disable) {
        if (disable) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('wheel', this.preventPageZoomAndScroll, { passive: false });
            window.addEventListener('keydown', this.preventPageZoomAndScroll, { passive: false });
            window.addEventListener('touchstart', this.preventPageZoomAndScroll, { passive: false });
        } else {
            document.body.style.overflow = '';
            window.removeEventListener('wheel', this.preventPageZoomAndScroll);
            window.removeEventListener('keydown', this.preventPageZoomAndScroll);
            window.removeEventListener('touchstart', this.preventPageZoomAndScroll);
        }
    }
    
    preventPageZoomAndScroll(event) {
        event.preventDefault();
    }
    
    preventReload(event) {
        if ((event.key === 'F5') || (event.ctrlKey && event.key === 'r')) {
            event.preventDefault();
            alert("Page reload blocked. You can still reload with Ctrl + Shift + R.");
        }
    }
}

// Setup global functions for inline event handlers
window.togglePlayerTagDisplay = function(playerNumber) {
    const playerTags = document.querySelectorAll('.player-tag-display');
    playerTags.forEach((tag, index) => {
        tag.style.display = (index + 1 === playerNumber) ? 'block' : 'none';
    });
};
