import React, { useState } from 'react';
import { Decal, Html, useTexture } from '@react-three/drei';
import { RotateCw, Plus, Minus, Trash2 } from 'lucide-react';
import * as THREE from 'three';

const MovableDecal = ({
    position, rotation, scale, textureUrl, isSelected,
    onSelect, onUpdate, onDelete, meshRef, onDragChange
}) => {
    const texture = useTexture(textureUrl);
    const [isDragging, setIsDragging] = useState(false);

    // Initial texture setup
    if (texture) {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = false;
    }

    const handlePointerDown = (e) => {
        e.stopPropagation();
        onSelect();
        setIsDragging(true);
        if (onDragChange) onDragChange(true);
        e.target.setPointerCapture(e.pointerId);
    };

    const handlePointerUp = (e) => {
        e.stopPropagation();
        setIsDragging(false);
        if (onDragChange) onDragChange(false);
        e.target.releasePointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        // Movement logic is now handled by parents mesh to avoid gimbal lock/stutter
        if (isDragging) e.stopPropagation();
    };

    const handleRotate = (e) => {
        e.stopPropagation();
        onUpdate({ pos: position, rot: rotation + Math.PI / 8, scale });
    };

    const handleScaleUp = (e) => {
        e.stopPropagation();
        onUpdate({ pos: position, rot: rotation, scale: Math.min(0.5, scale + 0.02) });
    };

    const handleScaleDown = (e) => {
        e.stopPropagation();
        onUpdate({ pos: position, rot: rotation, scale: Math.max(0.05, scale - 0.02) });
    };

    // Calculate a position slightly below the decal
    const gizmoPosition = [position[0], position[1] - (scale * 0.6) - 0.08, position[2]];

    return (
        <group>
            <Decal
                mesh={meshRef}
                position={position}
                rotation={[0, 0, rotation + Math.PI]}
                scale={[scale, scale, 0.2]}
                map={texture}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
            >
                <meshStandardMaterial
                    transparent
                    polygonOffset
                    polygonOffsetFactor={-15}
                    depthWrite={false}
                    map={texture}
                />
            </Decal>

            {isSelected && (
                <Html position={gizmoPosition} center distanceFactor={1.2}>
                    <div
                        className="logo-gizmo"
                        style={{
                            display: 'flex',
                            gap: '3px',
                            background: 'rgba(0,0,0,0.95)',
                            padding: '3px 6px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.5)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                            pointerEvents: 'auto',
                            userSelect: 'none',
                            backdropFilter: 'blur(5px)',
                            alignItems: 'center',
                            transform: 'scale(0.75)'
                        }}
                    >
                        <button
                            onClick={handleRotate}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', padding: '2px' }}
                            title="Rotate"
                        >
                            <RotateCw size={11} />
                        </button>
                        <button
                            onClick={handleScaleUp}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', padding: '2px' }}
                            title="Size Up"
                        >
                            <Plus size={11} />
                        </button>
                        <button
                            onClick={handleScaleDown}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', padding: '2px' }}
                            title="Size Down"
                        >
                            <Minus size={11} />
                        </button>
                        <div style={{ width: '1px', height: '8px', background: 'rgba(255,255,255,0.3)', margin: '0 2px' }} />
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            style={{ background: 'none', border: 'none', color: '#ff5555', cursor: 'pointer', display: 'flex', padding: '2px' }}
                            title="Delete"
                        >
                            <Trash2 size={11} />
                        </button>
                    </div>
                </Html>
            )}
        </group>
    );
};

export default MovableDecal;
