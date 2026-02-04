import React, { useState } from 'react';
import TeamSelection from './components/TeamSelection';
import Match from './components/Match';
import './index.css';

function App() {
    const [gameState, setGameState] = useState('selection'); // 'selection' or 'match'
    const [matchConfig, setMatchConfig] = useState(null);

    const handleStartMatch = (config) => {
        setMatchConfig(config);
        setGameState('match');
    };

    const handleEndMatch = () => {
        setGameState('selection');
        setMatchConfig(null);
    };

    return (
        <div className="app-container">
            {gameState === 'selection' ? (
                <TeamSelection onStartMatch={handleStartMatch} />
            ) : (
                <Match matchConfig={matchConfig} onQuit={handleEndMatch} />
            )}
        </div>
    );
}

export default App;
