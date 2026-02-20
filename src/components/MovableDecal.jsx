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

    return (
        <group onPointerMissed={() => isSelected && onSelect(null)}>
            <Decal
                mesh={meshRef}
                ref={decalRef}
                position={position}
                rotation={[0, 0, rotation]}
                scale={[scale, scale, 0.1]}
                map={texture}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
            >
                <meshStandardMaterial
                    transparent
                    polygonOffset
                    polygonOffsetFactor={-10}
                    depthWrite={false}
                    map={texture}
                />
            </Decal>

            {isSelected && (
                <Html position={position} center distanceFactor={1.5}>
                    <div
                        className="logo-gizmo"
                        style={{
                            display: 'flex',
                            gap: '10px',
                            background: 'rgba(0,0,0,0.85)',
                            padding: '10px 15px',
                            borderRadius: '30px',
                            border: '1px solid rgba(255,255,255,0.3)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.5)',
                            pointerEvents: 'auto',
                            userSelect: 'none',
                            backdropFilter: 'blur(5px)',
                            alignItems: 'center'
                        }}
                    >
                        <button
                            onClick={handleRotate}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
                            title="Rotate"
                        >
                            <RotateCw size={20} />
                        </button>
                        <button
                            onClick={handleScaleUp}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
                            title="Size Up"
                        >
                            <Plus size={20} />
                        </button>
                        <button
                            onClick={handleScaleDown}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
                            title="Size Down"
                        >
                            <Minus size={20} />
                        </button>
                        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 5px' }} />
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', display: 'flex' }}
                            title="Delete"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </Html>
            )}
        </group>
    );
};

export default MovableDecal;
