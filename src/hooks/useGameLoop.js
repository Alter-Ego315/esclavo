import { useState, useEffect, useRef } from 'react';

const PITCH_W = 1200;
const PITCH_H = 800;
const BALL_FRICTION = 0.985;
const PLAYER_SPEED = 6;
const AI_SPEED = 5;
const PLAYER_RADIUS = 20;
const BALL_RADIUS = 10;
const GOAL_WIDTH = 140;

export function useGameLoop(matchConfig) {
    const [score, setScore] = useState({ home: 0, away: 0 });
    const [time, setTime] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const gameStateRef = useRef({
        homePlayer: { x: 300, y: PITCH_H / 2, vx: 0, vy: 0 },
        awayPlayer: { x: PITCH_W - 300, y: PITCH_H / 2, vx: 0, vy: 0 },
        ball: { x: PITCH_W / 2, y: PITCH_H / 2, vx: 0, vy: 0 },
        keys: {}
    });

    useEffect(() => {
        const handleKeyDown = (e) => { gameStateRef.current.keys[e.code] = true; };
        const handleKeyUp = (e) => { gameStateRef.current.keys[e.code] = false; };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const interval = setInterval(() => {
            if (!isPaused) {
                updatePhysics();
            }
        }, 1000 / 60);

        const timerInterval = setInterval(() => {
            if (!isPaused) setTime(prev => prev + 1);
        }, 1000);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            clearInterval(interval);
            clearInterval(timerInterval);
        };
    }, [isPaused, matchConfig]);

    const updatePhysics = () => {
        const state = gameStateRef.current;

        // Player 1 (Home) - WASD
        if (state.keys['KeyW']) state.homePlayer.y -= PLAYER_SPEED;
        if (state.keys['KeyS']) state.homePlayer.y += PLAYER_SPEED;
        if (state.keys['KeyA']) state.homePlayer.x -= PLAYER_SPEED;
        if (state.keys['KeyD']) state.homePlayer.x += PLAYER_SPEED;

        // Player 2 or AI (Away)
        if (matchConfig.gameMode === 'pvp') {
            if (state.keys['ArrowUp']) state.awayPlayer.y -= PLAYER_SPEED;
            if (state.keys['ArrowDown']) state.awayPlayer.y += PLAYER_SPEED;
            if (state.keys['ArrowLeft']) state.awayPlayer.x -= PLAYER_SPEED;
            if (state.keys['ArrowRight']) state.awayPlayer.x += PLAYER_SPEED;
        } else {
            // Improved AI: Predicts ball trajectory and has slight delay/inertia
            const targetX = state.ball.x + state.ball.vx * 10;
            const targetY = state.ball.y + state.ball.vy * 10;

            const dx = targetX - state.awayPlayer.x;
            const dy = targetY - state.awayPlayer.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 5) {
                const angle = Math.atan2(dy, dx);
                state.awayPlayer.x += Math.cos(angle) * AI_SPEED;
                state.awayPlayer.y += Math.sin(angle) * AI_SPEED;
            }
        }

        // Ball movement
        state.ball.x += state.ball.vx;
        state.ball.y += state.ball.vy;
        state.ball.vx *= BALL_FRICTION;
        state.ball.vy *= BALL_FRICTION;

        // Pitch Boundaries & Collisions
        [state.homePlayer, state.awayPlayer, state.ball].forEach(obj => {
            const radius = obj === state.ball ? BALL_RADIUS : PLAYER_RADIUS;
            const margin = 30; // Matches visual margin in Match.jsx

            // Wall bounce for ball, simple block for players
            if (obj === state.ball) {
                if (obj.x < margin + radius || obj.x > PITCH_W - margin - radius) {
                    // Check if it's a goal
                    const inGoalRange = obj.y > PITCH_H / 2 - (GOAL_WIDTH / 2) && obj.y < PITCH_H / 2 + (GOAL_WIDTH / 2);
                    if (!inGoalRange) {
                        state.ball.vx *= -0.6;
                        obj.x = obj.x < PITCH_W / 2 ? margin + radius : PITCH_W - margin - radius;
                    }
                }
                if (obj.y < margin + radius || obj.y > PITCH_H - margin - radius) {
                    state.ball.vy *= -0.6;
                    obj.y = obj.y < PITCH_H / 2 ? margin + radius : PITCH_H - margin - radius;
                }
            } else {
                if (obj.x < margin + radius) obj.x = margin + radius;
                if (obj.x > PITCH_W - margin - radius) obj.x = PITCH_W - margin - radius;
                if (obj.y < margin + radius) obj.y = margin + radius;
                if (obj.y > PITCH_H - margin - radius) obj.y = PITCH_H - margin - radius;
            }
        });

        // Improved Player-Ball Collision
        const checkCollision = (player) => {
            const dx = state.ball.x - player.x;
            const dy = state.ball.y - player.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < PLAYER_RADIUS + BALL_RADIUS) {
                const angle = Math.atan2(dy, dx);
                const overlap = PLAYER_RADIUS + BALL_RADIUS - dist;

                // Move ball out of player overlap
                state.ball.x += Math.cos(angle) * overlap;
                state.ball.y += Math.sin(angle) * overlap;

                // Kick power based on velocity and direction
                const power = 12;
                state.ball.vx = Math.cos(angle) * power;
                state.ball.vy = Math.sin(angle) * power;
            }
        };

        checkCollision(state.homePlayer);
        checkCollision(state.awayPlayer);

        // Goal detection
        if (state.ball.y > PITCH_H / 2 - (GOAL_WIDTH / 2) && state.ball.y < PITCH_H / 2 + (GOAL_WIDTH / 2)) {
            if (state.ball.x <= 15) { // Left Goal
                setScore(prev => ({ ...prev, away: prev.away + 1 }));
                resetBall();
            } else if (state.ball.x >= PITCH_W - 15) { // Right Goal
                setScore(prev => ({ ...prev, home: prev.home + 1 }));
                resetBall();
            }
        }
    };

    const resetBall = () => {
        const state = gameStateRef.current;
        state.ball = { x: PITCH_W / 2, y: PITCH_H / 2, vx: 0, vy: 0 };
        state.homePlayer = { x: 300, y: PITCH_H / 2, vx: 0, vy: 0 };
        state.awayPlayer = { x: PITCH_W - 300, y: PITCH_H / 2, vx: 0, vy: 0 };
    };

    return { score, time, gameState: gameStateRef.current };
}
