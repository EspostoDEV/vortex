import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from '../../vendor/tightenco/ziggy'; // Ziggy for Vue uses the same core, but let's see for React

// Actually for React/Inertia it's usually just:
// import { Ziggy } from './ziggy.js'; if generated
// But we use the blade directive.

const appName = window.document.getElementsByTagName('title')[0]?.textContent || 'Vortex';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#00ff88',
    },
});
