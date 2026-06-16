// Utilitários Gerais
export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};
export const formatScore = (score) => {
    if (score >= 1000000) {
        return `${(score / 1000000).toFixed(1)}M`;
    }
    if (score >= 1000) {
        return `${(score / 1000).toFixed(1)}K`;
    }
    return score.toString();
};
export const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};
export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
export const debounce = (func, wait) => {
    let timeout = null;
    return (...args) => {
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};
export const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
};
export const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
export const isColorDark = (color) => {
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    return luma < 128;
};
export const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
export const clamp = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
};
export const lerp = (start, end, t) => {
    return start + (end - start) * t;
};
export const smoothstep = (t) => {
    return t * t * (3 - 2 * t);
};
