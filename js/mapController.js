// Map Controller - handles map initialization and area management
import { CONFIG } from './config.js';

export class MapController {
    constructor(gameState, uiController) {
        this.gameState = gameState;
        this.uiController = uiController;
        this.map = null;
        this.areaPointsValueList = {};
        this.areaLabelList = {};
        this.areaLocationMarkerlist = {};
        this.areaLabelsVisible = false;
        this.pointsValueVisible = false;
        this.locationsVisible = false;
        this.initializeMap();
        this.setupToggleListeners();
    }
    
    initializeMap() {
        this.map = L.map('map', {
            renderer: L.canvas(),
            zoomControl: false,
            zoomSnap: 0.1
        }).setView(CONFIG.MAP_CENTER, CONFIG.MAP_ZOOM);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            crossOrigin: 'anonymous'
        }).addTo(this.map);
        
        // Define CRS
        proj4.defs("EPSG:28992", CONFIG.EPSG_28992);
    }
    
    setupToggleListeners() {
        document.getElementById("toggleAreaLabelButton")?.addEventListener("click", () => {
            this.toggleVisibility(this.areaLabelList, this.areaLabelsVisible, (val) => { this.areaLabelsVisible = val; });
        });
        
        document.getElementById("togglePointsValueButton")?.addEventListener("click", () => {
            this.toggleVisibility(this.areaPointsValueList, this.pointsValueVisible, (val) => { this.pointsValueVisible = val; });
        });
        
        document.getElementById("toggleLocationMarkerButton")?.addEventListener("click", () => {
            this.toggleVisibility(this.areaLocationMarkerlist, this.locationsVisible, (val) => { this.locationsVisible = val; });
        });
    }
    
    toggleVisibility(elementsList, currentVisibility, setVisibility) {
        const newVisibility = !currentVisibility;
        setVisibility(newVisibility);
        
        Object.keys(elementsList).forEach(areaName => {
            const marker = elementsList[areaName];
            if (marker && marker.getElement) {
                marker.getElement().style.display = newVisibility ? '' : 'none';
            }
        });
    }
    
    async loadGeoData() {
        try {
            const response = await axios.get('EindhovenGebieden.json');
            const areasData = response.data.features;
            const areaNamesList = document.getElementById('areaNamesListStyle');
            
            areasData.forEach(area => {
                this.processArea(area, areaNamesList);
            });
        } catch (error) {
            console.error('Error loading the JSON file:', error);
        }
    }
    
    processArea(area, areaNamesList) {
        const areaName = area.attributes.gebiednaam;
        const areaLabel = area.attributes.gebiednummer;
        const challengeLocationX = area.attributes.ChallengeLocatieX;
        const challengeLocationY = area.attributes.ChallengeLocatieY;
        
        // Transform coordinates
        const areaCoordinates = area.geometry.rings || area.geometry.coordinates;
        const transformedCoords = areaCoordinates[0].map(coord => 
            proj4("EPSG:28992", "EPSG:4326", [coord[0] - 35, coord[1] - 113]).reverse()
        );
        
        // Create polygon
        const areaPolygon = this.createAreaPolygon(transformedCoords);
        
        // Add location marker
        this.addLocationMarker(areaName, challengeLocationY, challengeLocationX);
        
        // Add area to points selection menu
        this.addAreaToMenu(areaName, areaLabel, areaNamesList);
        
        // Add area label
        this.addAreaLabel(areaPolygon, areaName, areaLabel);
        
        // Add points value label
        this.addPointsValueLabel(areaPolygon, areaName);
        
        // Setup area interactions
        this.setupAreaInteractions(areaPolygon, areaName, areaNamesList);
    }
    
    createAreaPolygon(transformedCoords) {
        return L.polygon(transformedCoords, {
            color: 'black',
            weight: CONFIG.WEIGHT_POLYGON,
            fillColor: CONFIG.FILL_COLOR_NOT_CLAIMED,
            fillOpacity: CONFIG.OPACITY_NOT_CLAIMED
        }).addTo(this.map);
    }
    
    addLocationMarker(areaName, lat, lng) {
        const latlng = L.latLng(lat, lng);
        const marker = L.marker(latlng, {
            icon: L.icon({
                iconUrl: 'LocationPin.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: null
            })
        }).addTo(this.map);
        this.areaLocationMarkerlist[areaName] = marker;
    }
    
    addAreaToMenu(areaName, areaLabel, areaNamesList) {
        this.gameState.areaPoints[areaName] = CONFIG.STARTING_POINTS;
        
        const listItem = document.createElement('li');
        const dropdown = document.createElement('select');
        dropdown.classList.add('point-selector');
        
        for (let i = 1; i <= CONFIG.STARTING_POINTS; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            if (i === CONFIG.STARTING_POINTS) option.selected = true;
            dropdown.appendChild(option);
        }
        
        dropdown.addEventListener('change', () => {
            this.gameState.areaPoints[areaName] = parseInt(dropdown.value);
            this.updatePointsValueLabel(areaName, true);
        });
        
        listItem.appendChild(dropdown);
        
        const areaNameText = document.createElement('span');
        areaNameText.textContent = `${areaName} (${areaLabel})`;
        listItem.appendChild(areaNameText);
        
        areaNamesList?.appendChild(listItem);
        
        return dropdown;
    }
    
    addAreaLabel(areaPolygon, areaName, areaLabel) {
        const areaLabelAnchor = CONFIG.CUSTOM_AREA_LABEL_ANCHORS[areaLabel] || CONFIG.DEFAULT_AREA_LABEL_ANCHOR;
        
        const areaLabelPlaceholder = L.divIcon({
            className: 'area_number_label',
            html: `<span>${areaLabel}</span>`,
            iconSize: CONFIG.DEFAULT_AREA_LABEL_ICON_SIZE,
            iconAnchor: areaLabelAnchor
        });
        
        const areaLabelMarker = L.marker(areaPolygon.getBounds().getNorthEast(), { 
            icon: areaLabelPlaceholder 
        }).addTo(this.map);
        this.areaLabelList[areaName] = areaLabelMarker;
    }
    
    addPointsValueLabel(areaPolygon, areaName) {
        const pointsValueIconAnchor = CONFIG.CUSTOM_POINTS_VALUE_ANCHORS[areaName] || CONFIG.DEFAULT_POINTS_VALUE_ICON_ANCHOR;
        
        const pointsLabel = L.divIcon({
            className: 'area_points_label',
            html: `<span>${this.gameState.areaPoints[areaName]}</span>`,
            iconSize: CONFIG.DEFAULT_POINTS_VALUE_ICON_SIZE,
            iconAnchor: pointsValueIconAnchor
        });
        
        const center = areaPolygon.getBounds().getCenter();
        const pointsValueMarker = L.marker(center, { icon: pointsLabel }).addTo(this.map);
        pointsValueMarker.options.interactive = false;
        this.areaPointsValueList[areaName] = pointsValueMarker;
    }
    
    updatePointsValueLabel(areaName, manuallyChanged = false) {
        if (!this.areaPointsValueList[areaName]) return;
        
        const points = this.gameState.areaPoints[areaName];
        const previousPoints = this.gameState.areaPointsPrevious[areaName];
        const isUnclaimed = !(areaName in this.gameState.areaPointsPrevious);
        const noPointsValueChange = points === previousPoints;
        
        // Determine icon anchor
        let pointsValueIconAnchor;
        const customAnchor = CONFIG.CUSTOM_POINTS_VALUE_ANCHORS[areaName];
        
        if (customAnchor) {
            const finalChangeInIconAnchor = manuallyChanged ? 0 : CONFIG.CHANGE_IN_ICON_ANCHOR;
            pointsValueIconAnchor = noPointsValueChange 
                ? customAnchor 
                : [customAnchor[0] + finalChangeInIconAnchor, customAnchor[1]];
        } else if (isUnclaimed) {
            pointsValueIconAnchor = CONFIG.DEFAULT_POINTS_VALUE_ICON_ANCHOR;
        } else {
            pointsValueIconAnchor = noPointsValueChange 
                ? CONFIG.DEFAULT_POINTS_VALUE_ICON_ANCHOR 
                : [[CONFIG.DEFAULT_POINTS_VALUE_ICON_ANCHOR[0] + CONFIG.CHANGE_IN_ICON_ANCHOR], CONFIG.DEFAULT_POINTS_VALUE_ICON_ANCHOR[1]];
        }
        
        // Determine icon size
        const pointsValueIconSize = isUnclaimed || noPointsValueChange 
            ? CONFIG.DEFAULT_POINTS_VALUE_ICON_SIZE 
            : [[CONFIG.DEFAULT_POINTS_VALUE_ICON_SIZE[0] + CONFIG.CHANGE_IN_ICON_SIZE], CONFIG.DEFAULT_POINTS_VALUE_ICON_SIZE[1]];
        
        // Determine label text
        const pointsValueLabelText = isUnclaimed || noPointsValueChange 
            ? `${points}` 
            : `${points} (${previousPoints})`;
        
        this.areaPointsValueList[areaName].setIcon(L.divIcon({
            className: 'area_points_label',
            html: `<span>${pointsValueLabelText}</span>`,
            iconSize: pointsValueIconSize,
            iconAnchor: pointsValueIconAnchor
        }));
    }
    
    setupAreaInteractions(areaPolygon, areaName, dropdown) {
        let originalPlayerFillColor = CONFIG.FILL_COLOR_NOT_CLAIMED;
        let originalPlayer = null;
        let clickCount = 0;
        
        // Store area-specific state for lastClickedPolygon tracking
        areaPolygon._areaState = {
            originalPlayer: null,
            originalPlayerFillColor: CONFIG.FILL_COLOR_NOT_CLAIMED
        };
        
        // Mouse over
        areaPolygon.on('mouseover', () => {
            clickCount = 0;
            
            const currentAreaPointsValue = this.gameState.areaPoints[areaName];
            const areaPreviousPoints = this.gameState.areaPointsPrevious[areaName];
            const selectedPlayer = this.gameState.selectedPlayer;
            
            // Save current scores before preview
            this.gameState.switchScoreTracking(true, selectedPlayer, originalPlayer);
            
            // Create preview scores (don't modify actual game state directly)
            const previewScores = { ...this.gameState.scores };
            const previewClaimedAreas = { ...this.gameState.claimedAreas };
            
            // Calculate preview changes
            if (originalPlayer && selectedPlayer !== originalPlayer) {
                previewScores[originalPlayer] -= areaPreviousPoints || 0;
                previewClaimedAreas[originalPlayer] -= 1;
            }
            
            if (selectedPlayer !== originalPlayer) {
                previewScores[selectedPlayer] += currentAreaPointsValue;
                previewClaimedAreas[selectedPlayer] += 1;
            } else if (originalPlayer) {
                previewScores[selectedPlayer] -= areaPreviousPoints || 0;
                previewClaimedAreas[selectedPlayer] -= 1;
            }
            
            // Temporarily apply preview scores for display
            const oldActualScores = { ...this.gameState.scores };
            const oldActualClaimedAreas = { ...this.gameState.claimedAreas };
            this.gameState.scores = previewScores;
            this.gameState.claimedAreas = previewClaimedAreas;
            
            this.uiController.updateScoreboard(
                selectedPlayer, 
                originalPlayer || selectedPlayer, 
                true,
                this.gameState.oldScores[selectedPlayer],
                originalPlayer ? this.gameState.oldScores[originalPlayer] : 0,
                this.gameState.oldClaimedAreas[selectedPlayer],
                originalPlayer ? this.gameState.oldClaimedAreas[originalPlayer] : 0
            );
            
            // Restore actual scores
            this.gameState.scores = oldActualScores;
            this.gameState.claimedAreas = oldActualClaimedAreas;
            
            areaPolygon.setStyle({ 
                fillColor: this.gameState.selectedPlayerColor, 
                fillOpacity: CONFIG.OPACITY_HOVERING 
            });
        });
        
        // Click
        areaPolygon.on('click', () => {
            clickCount += 1;
            const selectedPlayer = this.gameState.selectedPlayer;
            const currentAreaPointsValue = this.gameState.areaPoints[areaName];
            
            // Calculate what the actual score changes should be
            if (originalPlayer && selectedPlayer !== originalPlayer) {
                // Taking from another player
                this.gameState.scores[originalPlayer] -= this.gameState.areaPointsPrevious[areaName] || 0;
                this.gameState.claimedAreas[originalPlayer] -= 1;
            }
            
            if (selectedPlayer !== originalPlayer) {
                // Claiming new or taking from another
                this.gameState.scores[selectedPlayer] += currentAreaPointsValue;
                this.gameState.claimedAreas[selectedPlayer] += 1;
            } else if (originalPlayer) {
                // Unclaiming own area
                this.gameState.scores[selectedPlayer] -= this.gameState.areaPointsPrevious[areaName] || 0;
                this.gameState.claimedAreas[selectedPlayer] -= 1;
            }
            
            this.gameState.areaPointsPrevious[areaName] = currentAreaPointsValue;
            
            // Reset previous lastClickedPolygon to normal weight
            if (this.gameState.lastClickedPolygon && this.gameState.lastClickedPolygon !== areaPolygon) {
                const prevState = this.gameState.lastClickedPolygon._areaState;
                if (prevState) {
                    this.gameState.lastClickedPolygon.setStyle({ 
                        fillColor: prevState.originalPlayerFillColor, 
                        fillOpacity: prevState.originalPlayer ? CONFIG.OPACITY_CLAIMED : CONFIG.OPACITY_NOT_CLAIMED,
                        weight: CONFIG.WEIGHT_POLYGON
                    });
                }
            }
            
            this.gameState.lastClickedPolygon = areaPolygon;
            
            // Auto-decrement points
            if (selectedPlayer !== originalPlayer && this.gameState.areaPoints[areaName] > 1) {
                this.gameState.areaPoints[areaName]--;
            }
            
            // Update dropdown
            const dropdownElement = dropdown.querySelector ? dropdown : dropdown.parentElement?.querySelector('select');
            if (dropdownElement) {
                dropdownElement.value = this.gameState.areaPoints[areaName].toString();
            }
            
            this.updatePointsValueLabel(areaName);
            
            const newFillOpacity = (originalPlayer === selectedPlayer) ? CONFIG.OPACITY_NOT_CLAIMED : CONFIG.OPACITY_CLAIMED;
            const newFillColor = (originalPlayer === selectedPlayer) ? CONFIG.FILL_COLOR_NOT_CLAIMED : this.gameState.selectedPlayerColor;
            const newWeight = (originalPlayer === selectedPlayer) ? CONFIG.WEIGHT_POLYGON : CONFIG.WEIGHT_CLAIMED_RECENTLY;
            
            areaPolygon.setStyle({ fillColor: newFillColor, fillOpacity: newFillOpacity, weight: newWeight });
            
            // Update area state
            originalPlayer = (newFillColor !== CONFIG.FILL_COLOR_NOT_CLAIMED) ? selectedPlayer : null;
            originalPlayerFillColor = newFillColor;
            areaPolygon._areaState.originalPlayer = originalPlayer;
            areaPolygon._areaState.originalPlayerFillColor = originalPlayerFillColor;
            
            this.gameState.saveScoreSnapshot();
            this.uiController.updateScoreboard(selectedPlayer, originalPlayer || selectedPlayer, false);
        });
        
        // Mouse out
        areaPolygon.on('mouseout', () => {
            const selectedPlayer = this.gameState.selectedPlayer;
            
            // Just update UI to show actual scores (no modifications)
            this.uiController.updateScoreboard(selectedPlayer, originalPlayer || selectedPlayer, false);
            
            const appliedOpacity = (originalPlayerFillColor === CONFIG.FILL_COLOR_NOT_CLAIMED) ? CONFIG.OPACITY_NOT_CLAIMED : CONFIG.OPACITY_CLAIMED;
            areaPolygon.setStyle({ fillColor: originalPlayerFillColor, fillOpacity: appliedOpacity });
        });
    }
}
