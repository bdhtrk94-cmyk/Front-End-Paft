'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeSwitcher() {
    const { theme, toggleTheme } = useTheme();
    const isLight = theme === 'light';

    return (
        <button
            onClick={toggleTheme}
            className="theme-switcher-btn"
            aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
            title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
        >
            {/* Track */}
            <div className="theme-switcher-track">
                {/* Icons */}
                <div className="theme-switcher-icons">
                    <Sun
                        className="theme-switcher-icon theme-switcher-icon-sun"
                        style={{
                            opacity: isLight ? 1 : 0.3,
                            transform: isLight ? 'scale(1) rotate(0deg)' : 'scale(0.7) rotate(-45deg)',
                        }}
                    />
                    <Moon
                        className="theme-switcher-icon theme-switcher-icon-moon"
                        style={{
                            opacity: isLight ? 0.3 : 1,
                            transform: isLight ? 'scale(0.7) rotate(45deg)' : 'scale(1) rotate(0deg)',
                        }}
                    />
                </div>
                {/* Sliding knob */}
                <div
                    className="theme-switcher-knob"
                    style={{
                        transform: isLight ? 'translateX(2px)' : 'translateX(26px)',
                    }}
                />
            </div>
        </button>
    );
}
