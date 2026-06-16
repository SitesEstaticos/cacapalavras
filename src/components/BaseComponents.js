// Componentes base do jogo
import React from 'react';
export const Cell = ({ letter, isSelected, isFound, isError, onClick, onMouseEnter, }) => {
    let className = 'cell-default';
    if (isError) {
        className = 'cell-error';
    }
    else if (isFound) {
        className = 'cell-found';
    }
    else if (isSelected) {
        className = 'cell-selected';
    }
    return (<div className={className} onClick={onClick} onMouseEnter={onMouseEnter} role="button" tabIndex={0} aria-label={`Letter ${letter}`}>
      {letter}
    </div>);
};
export const Button = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
    const variantClass = `btn-${variant}`;
    const sizeClass = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
    }[size] || '';
    return (<button className={`${variantClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>);
};
export const Card = ({ children, className = '' }) => {
    return <div className={`card-lg ${className}`}>{children}</div>;
};
export const Badge = ({ variant = 'primary', children }) => {
    const variantClass = `badge-${variant}`;
    return <div className={`badge ${variantClass}`}>{children}</div>;
};
export const HUDItem = ({ label, value }) => {
    return (<div className="hud-section">
      <span className="hud-label">{label}</span>
      <span className="hud-value">{value}</span>
    </div>);
};
export const Timer = ({ seconds }) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formatted = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return <HUDItem label="Tempo" value={formatted}/>;
};
export const ProgressBar = ({ current, total, animated = true }) => {
    const percentage = Math.round((current / total) * 100);
    return (<div className="w-full bg-white bg-opacity-10 rounded-full h-2 overflow-hidden">
      <div className={`h-full bg-secondary transition-all duration-300 ${animated ? 'animate-pulse-soft' : ''}`} style={{ width: `${percentage}%` }}/>
    </div>);
};
export const Tooltip = ({ text, children }) => {
    return (<div className="relative group inline-block">
      {children}
      <div className="tooltip opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {text}
      </div>
    </div>);
};
