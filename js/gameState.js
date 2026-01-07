// Game state management
import { CONFIG } from './config.js';

class GameState {
    constructor() {
        this.selectedPlayer = 'name1';
        this.scores = this.initializePlayerData(0);
        this.claimedAreas = this.initializePlayerData(0);
        this.oldScores = this.initializePlayerData(0);
        this.oldClaimedAreas = this.initializePlayerData(0);
        this.scoreHistory = [];
        this.areaHistory = [];
        this.timeHistory = [];
        this.areaPoints = {};
        this.areaPointsPrevious = {};
        this.lastClickedPolygon = null;
    }
    
    initializePlayerData(defaultValue) {
        const data = {};
        for (let i = 1; i <= CONFIG.PLAYER_COUNT; i++) {
            data[`name${i}`] = defaultValue;
        }
        return data;
    }
    
    get selectedPlayerColor() {
        return CONFIG.PLAYER_COLORS[this.selectedPlayer];
    }
    
    saveScoreSnapshot() {
        this.scoreHistory.push([...Object.values(this.scores)]);
        this.areaHistory.push([...Object.values(this.claimedAreas)]);
        const now = new Date();
        this.timeHistory.push(now.toTimeString().slice(0, 5));
    }
    
    switchScoreTracking(saveScoresAsOldScores, selectedPlayer, originalPlayer) {
        if (saveScoresAsOldScores === true) {
            this.oldScores[selectedPlayer] = this.scores[selectedPlayer];
            this.oldClaimedAreas[selectedPlayer] = this.claimedAreas[selectedPlayer];
            this.oldScores[originalPlayer] = this.scores[originalPlayer];
            this.oldClaimedAreas[originalPlayer] = this.claimedAreas[originalPlayer];
        } else if (saveScoresAsOldScores === false) {
            this.scores[selectedPlayer] = this.oldScores[selectedPlayer];
            this.claimedAreas[selectedPlayer] = this.oldClaimedAreas[selectedPlayer];
            this.scores[originalPlayer] = this.oldScores[originalPlayer];
            this.claimedAreas[originalPlayer] = this.oldClaimedAreas[originalPlayer];
        }
    }
}

export default GameState;
