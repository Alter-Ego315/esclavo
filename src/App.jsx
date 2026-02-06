import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import JerseyDesigner from './components/JerseyDesigner';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
    const [showSplash, setShowSplash] = useState(true);

    return (
        <div className="ginga-app">
            <ErrorBoundary>
                {showSplash ? (
                    <SplashScreen onComplete={() => setShowSplash(false)} />
                ) : (
                    <JerseyDesigner />
                )}
            </ErrorBoundary>
        </div>
    );
}

export default App;
