import { useState, useRef } from 'react';

export const useAudio = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            setDuration(0);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);

            const startTime = Date.now();
            timerRef.current = setInterval(() => {
                setDuration(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);

        } catch (err) {
            console.error("Microphone error:", err);
        }
    };

    const stopRecording = () => {
        return new Promise((resolve) => {
            if (mediaRecorderRef.current && isRecording) {
                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    setIsRecording(false);
                    clearInterval(timerRef.current);
                    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
                    resolve({ blob: audioBlob, duration });
                };
                mediaRecorderRef.current.stop();
            } else {
                resolve({ blob: null, duration: 0 });
            }
        });
    };

    return { isRecording, duration, startRecording, stopRecording };
};
