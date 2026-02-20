import React, { useRef, useState } from 'react';
import { Decal, Html, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Trash2, RotateCw, Maximize, Minus, Plus } from 'lucide-react';

const MovableDecal = ({
    position,
    rotation,
    scale,
    textureUrl,
    isSelected,
    onSelect,
    onUpdate,
    onDelete,
    meshRef
}) => {
    const decalRef = useRef();
    const texture = useTexture(textureUrl);
    const [isDragging, setIsDragging] = useState(false);

    // dragging logic
    const handlePointerDown = (e) => {
        e.stopPropagation();
        onSelect();
        setIsDragging(true);
        e.target.setPointerCapture(e.pointerId);
    };

    const handlePointerUp = (e) => {
        setIsDragging(false);
        e.target.releasePointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (isDragging && isSelected && meshRef.current) {
            e.stopPropagation();
            const intersects = e.intersections.filter(i => i.object === meshRef.current);
            if (intersects.length > 0) {
                const point = intersects[0].point;
                onUpdate({
                    pos: [point.x, point.y, point.z],
                    rot: rotation,
                    scale: scale
                });
            }
        }
    };

    // Gizmo button handlers
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
    const gizmoPosition = [position[0], position[1] - (scale * 0.6) - 0.05, position[2]];

    return (
        <group onPointerMissed={() => isSelected && onSelect(null)}>
            <Decal
                mesh={meshRef}
                ref={decalRef}
                position={position}
                rotation={[0, 0, rotation]}
                scale={[scale, scale, 0.2]} // Increased depth to 0.2
                map={texture}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
            >
                <meshStandardMaterial
                    transparent
                    polygonOffset
                    polygonOffsetFactor={-15} // Slightly stronger
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
                            gap: '4px',
                            background: 'rgba(0,0,0,0.9)',
                            padding: '4px 8px',
                            borderRadius: '15px',
                            border: '1px solid rgba(255,255,255,0.4)',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                            pointerEvents: 'auto',
                            userSelect: 'none',
                            backdropFilter: 'blur(4px)',
                            alignItems: 'center',
                            transform: 'scale(0.8)' // Extra shrink
                        }}
                    >
                        <button
                            onClick={handleRotate}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', padding: '3px' }}
                            title="Rotate"
                        >
                            <RotateCw size={12} />
                        </button>
                        <button
                            onClick={handleScaleUp}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', padding: '3px' }}
                            title="Size Up"
                        >
                            <Plus size={12} />
                        </button>
                        <button
                            onClick={handleScaleDown}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', padding: '3px' }}
                            title="Size Down"
                        >
                            <Minus size={12} />
                        </button>
                        <div style={{ width: '1px', height: '10px', background: 'rgba(255,255,255,0.2)', margin: '0 3px' }} />
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            style={{ background: 'none', border: 'none', color: '#ff5555', cursor: 'pointer', display: 'flex', padding: '3px' }}
                            title="Delete"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                </Html>
            )}
        </group>
    );
};

export default MovableDecal;
