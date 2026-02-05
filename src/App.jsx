import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import JerseyDesigner from './components/JerseyDesigner';
import './index.css';

function App() {
    const [showSplash, setShowSplash] = useState(true);

    return (
        <div className="ginga-app">
            {showSplash ? (
                <SplashScreen onComplete={() => setShowSplash(false)} />
            ) : (
                <JerseyDesigner />
            )}
        </div>
    );
}

export default App;
