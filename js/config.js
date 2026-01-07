// Game configuration constants
export const CONFIG = {
    // Player settings
    PLAYER_COLORS: {
        name1: 'orange',
        name2: 'yellow',
        name3: 'blue',
        name4: 'purple'
    },
    
    PLAYER_COUNT: 4,
    
    // Area settings
    STARTING_POINTS: 4,
    OPACITY_NOT_CLAIMED: 0.5,
    OPACITY_CLAIMED: 0.8,
    OPACITY_HOVERING: 0.2,
    FILL_COLOR_NOT_CLAIMED: 'lightgrey',
    
    // Polygon settings
    WEIGHT_POLYGON: 1,
    WEIGHT_CLAIMED_RECENTLY: 3,
    
    // Icon settings
    DEFAULT_AREA_LABEL_ANCHOR: [60, -60],
    DEFAULT_AREA_LABEL_ICON_SIZE: [20, 20],
    DEFAULT_POINTS_VALUE_ICON_ANCHOR: [15, -10],
    DEFAULT_POINTS_VALUE_ICON_SIZE: [12, 15],
    CHANGE_IN_ICON_ANCHOR: 10,
    CHANGE_IN_ICON_SIZE: 18,
    
    // Map settings
    MAP_CENTER: [51.440, 5.474],
    MAP_ZOOM: 13.6,
    
    // CRS
    EPSG_28992: "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs",
    
    // Custom area label anchors
    CUSTOM_AREA_LABEL_ANCHORS: {
        2: [70, -30],
        3: [70, -25],
        4: [105, -50],
        5: [70, -75],
        8: [92, -83],
        9: [60, -40],
        11: [143, -23],
        12: [70, -50],
        13: [90, -30],
        14: [95, -30],
        17: [60, -60],
        18: [90, -30],
        20: [60, -30],
        21: [100, -100]
    },
    
    // Custom points value label anchors
    CUSTOM_POINTS_VALUE_ANCHORS: {
        'Binnenstad Noord': [30, -20],
        'Binnenstad West': [5, -20],
        'Binnenstad Zuid': [2, 20],
        'Binnenstad Oost': [10, 5],
        'Brinkhorst Zuid': [20, -10],
        'Brummelhof Noord': [30, -15],
        'Brummelhof Oost': [30, 35],
        'Brummelhof Zuid': [40, -10],
        'De Haven': [15, -25],
        'De Heeze': [30, -10],
        'De Parken Noord': [35, 5],
        'De Parken Oost': [5, 32],
        'De Parken Zuid': [30, 25],
        'Holthuizen': [0, 30],
        'Sprengenweg Noord': [35, 20],
        'Sluisoord': [20, 40],
        'Station': [0, 10]
    }
};
