// UI Controller - handles scoreboard updates and UI interactions
import { CONFIG } from './config.js';

export class UIController {
    constructor(gameState) {
        this.gameState = gameState;
        this.scoreElements = ['score_player_1', 'score_player_2', 'score_player_3', 'score_player_4'];
        this.claimedAreasElements = ['areas_claimed_player_1', 'areas_claimed_player_2', 'areas_claimed_player_3', 'areas_claimed_player_4'];
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Player selection menu toggle
        document.querySelector("#playerSelectMenu h3")?.addEventListener("click", () => {
            document.getElementById("playerSelectList")?.classList.toggle('show');
        });
        
        // Area points value selection menu toggle
        document.querySelector("#areaValueMenu h4")?.addEventListener("click", () => {
            document.getElementById("areaNamesListStyle")?.classList.toggle('show');
        });
        
        // Player selection radio buttons
        const playerSelectionList = document.querySelectorAll('#playerSelectMenu input[name="player"]');
        playerSelectionList.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.gameState.selectedPlayer = e.target.value;
            });
        });
    }
    
    updateScoreboard(selectedPlayer, originalPlayer, styleIsTemporary, oldScoreSelectedPlayer = 0, oldScoreOriginalPlayer = 0, oldAreasClaimedSelectedPlayer = 0, oldAreasClaimedOriginalPlayer = 0) {
        const { scores, claimedAreas } = this.gameState;
        
        // Calculate score changes
        const newScoreSelectedPlayer = scores[selectedPlayer];
        const newScoreOriginalPlayer = scores[originalPlayer];
        
        const scoreChangeSelectedPlayer = this.formatScoreChange(newScoreSelectedPlayer, oldScoreSelectedPlayer);
        const scoreChangeOriginalPlayer = this.formatScoreChange(newScoreOriginalPlayer, oldScoreOriginalPlayer);
        
        const areasClaimedChangeSelectedPlayer = newScoreSelectedPlayer > oldScoreSelectedPlayer ? '+1' : '-1';
        const areasClaimedChangeOriginalPlayer = newScoreOriginalPlayer > oldScoreOriginalPlayer ? '+1' : '-1';
        
        // Update score elements
        this.scoreElements.forEach((id, index) => {
            const scoreElement = document.getElementById(id);
            if (!scoreElement) return;
            
            const playerIteration = `name${index + 1}`;
            const isAffectedPlayer = playerIteration === selectedPlayer || playerIteration === originalPlayer;
            
            if (isAffectedPlayer && styleIsTemporary) {
                const oldScore = playerIteration === selectedPlayer ? oldScoreSelectedPlayer : oldScoreOriginalPlayer;
                const scoreChange = playerIteration === selectedPlayer ? scoreChangeSelectedPlayer : scoreChangeOriginalPlayer;
                scoreElement.innerHTML = `<span style="line-height: 1; vertical-align: 0px;">${oldScore}</span> (${scoreChange})`;
                scoreElement.style.color = 'grey';
            } else {
                scoreElement.innerHTML = scores[playerIteration];
                scoreElement.style.color = 'black';
            }
        });
        
        // Update claimed areas elements
        this.claimedAreasElements.forEach((id, index) => {
            const claimedElement = document.getElementById(id);
            if (!claimedElement) return;
            
            const playerIteration = `name${index + 1}`;
            const isAffectedPlayer = playerIteration === selectedPlayer || playerIteration === originalPlayer;
            
            if (isAffectedPlayer && styleIsTemporary) {
                const oldClaimedAreas = playerIteration === selectedPlayer ? oldAreasClaimedSelectedPlayer : oldAreasClaimedOriginalPlayer;
                const claimedAreasChange = playerIteration === selectedPlayer ? areasClaimedChangeSelectedPlayer : areasClaimedChangeOriginalPlayer;
                claimedElement.innerHTML = `<span style="line-height: 1; vertical-align: 0px">${oldClaimedAreas}</span> (${claimedAreasChange})`;
                claimedElement.style.color = 'grey';
            } else {
                claimedElement.innerHTML = claimedAreas[playerIteration];
                claimedElement.style.color = 'black';
            }
        });
    }
    
    formatScoreChange(newScore, oldScore) {
        const diff = newScore - oldScore;
        return diff > 0 ? `+${diff}` : `${diff}`;
    }
    
    togglePlayerTagDisplay(playerNumber) {
        const playerTags = document.querySelectorAll('.player-tag-display');
        playerTags.forEach((tag, index) => {
            tag.style.display = (index + 1 === playerNumber) ? 'block' : 'none';
        });
    }
}
