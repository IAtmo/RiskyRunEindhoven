// Export Controller - handles image and CSV exports
export class ExportController {
    constructor(gameState) {
        this.gameState = gameState;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.getElementById('saveMapImage')?.addEventListener('click', () => {
            this.saveMapImages();
        });
        
        document.getElementById('saveScoresAndAreasClaimed')?.addEventListener('click', () => {
            this.downloadCSV();
        });
    }
    
    saveMapImages() {
        this.saveMapAsImage('screenshot-container', 'GamestateFull');
        
        // Toggle area labels for clean map screenshot
        const areaLabelList = window.mapController?.areaLabelList || {};
        const areaLabelsVisible = window.mapController?.areaLabelsVisible || false;
        
        this.toggleVisibilityForExport(areaLabelList, areaLabelsVisible);
        this.saveMapAsImage('map', 'GamestateMap');
        this.toggleVisibilityForExport(areaLabelList, !areaLabelsVisible);
    }
    
    toggleVisibilityForExport(elementsList, visible) {
        Object.keys(elementsList).forEach(areaName => {
            const marker = elementsList[areaName];
            if (marker && marker.getElement) {
                marker.getElement().style.display = visible ? '' : 'none';
            }
        });
    }
    
    saveMapAsImage(containerName, filenamePrefix) {
        const container = document.getElementById(containerName);
        if (!container) return;
        
        html2canvas(container, {
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL("image/png");
            link.download = `${filenamePrefix}_${this.getTimestamp()}.png`;
            link.click();
        });
    }
    
    getTimestamp() {
        const now = new Date();
        return now.getFullYear() + "-" +
            (now.getMonth() + 1).toString().padStart(2, '0') + "-" +
            now.getDate().toString().padStart(2, '0') + "_" +
            now.getHours().toString().padStart(2, '0') + "." +
            now.getMinutes().toString().padStart(2, '0') + "." +
            now.getSeconds().toString().padStart(2, '0');
    }
    
    downloadCSV() {
        const { scoreHistory, areaHistory, timeHistory, scores } = this.gameState;
        
        if (scoreHistory.length === 0) {
            console.warn('No score history to export');
            return;
        }
        
        const names = Object.keys(scores);
        const headerRow = ["Time", "12:15", ...timeHistory];
        
        // Export scores
        this.exportScoreHistory(scoreHistory, names, headerRow);
        
        // Export areas
        this.exportAreaHistory(areaHistory, names, headerRow);
    }
    
    exportScoreHistory(scoreHistory, names, headerRow) {
        const transposed = this.transposeMatrix(scoreHistory);
        const dataRows = transposed.map((row, i) => [names[i], 0, ...row]);
        const allRows = [headerRow, ...dataRows];
        const csvContent = allRows.map(row => row.join(",")).join("\n");
        
        this.downloadFile(csvContent, "score_history.csv");
    }
    
    exportAreaHistory(areaHistory, names, headerRow) {
        const transposed = this.transposeMatrix(areaHistory);
        const dataRows = transposed.map((row, i) => [names[i], 0, ...row]);
        const allRows = [headerRow, ...dataRows];
        const csvContent = allRows.map(row => row.join(",")).join("\n");
        
        this.downloadFile(csvContent, "area_history.csv");
    }
    
    transposeMatrix(matrix) {
        if (matrix.length === 0) return [];
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }
    
    downloadFile(content, filename) {
        const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", filename);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
