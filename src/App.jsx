import React, { useState } from 'react';
import IntroAnimation from './components/IntroAnimation';
import JerseyDesigner from './components/JerseyDesigner';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
    const [showIntro, setShowIntro] = useState(true);

    return (
        <div className="ginga-app">
            {showIntro ? (
                <IntroAnimation onComplete={() => setShowIntro(false)} />
            ) : (
                <ErrorBoundary>
                    <JerseyDesigner />
                </ErrorBoundary>
            )}
        </div>
    );
}

export default App;
