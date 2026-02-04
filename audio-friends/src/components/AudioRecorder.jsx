import React, { useState } from 'react';
import { useAudio } from '../hooks/useAudio';
import './AudioRecorder.css';

const AudioRecorder = ({ onSend }) => {
    const { isRecording, startRecording, stopRecording } = useAudio();
    const [recordingStartTime, setRecordingStartTime] = useState(null);

    const handleToggleRecording = async () => {
        if (!isRecording) {
            await startRecording();
            setRecordingStartTime(Date.now());
        } else {
            const blob = await stopRecording();
            if (blob) {
                onSend(blob);
            }
            setRecordingStartTime(null);
        }
    };

    return (
        <div className="recorder-wrapper">
            <button
                className={`record-btn ${isRecording ? 'pulsate recording' : ''}`}
                onClick={handleToggleRecording}
            >
                <div className="icon">
                    {isRecording ? (
                        <div className="stop-icon"></div>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                        </svg>
                    )}
                </div>
            </button>
            <div className="hint-text">
                {isRecording ? "Recording... Click to stop" : "Start Voice Note"}
            </div>
        </div>
    );
};

export default AudioRecorder;
