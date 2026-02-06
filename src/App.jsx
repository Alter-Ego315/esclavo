import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import JerseyDesigner from './components/JerseyDesigner';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
    return (
        <div className="ginga-app">
            <ErrorBoundary>
                <JerseyDesigner />
            </ErrorBoundary>
        </div>
    );
}

export default App;
