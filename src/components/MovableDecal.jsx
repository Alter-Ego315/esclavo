import React, { useRef, useState, useEffect } from 'react';
import { Decal, Html, useTexture } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Trash2, RotateCw, Maximize, Copy } from 'lucide-react'; // Using Lucide icons for handles

const MovableDecal = ({
    position,
    rotation,
    scale,
    textureUrl,
    isSelected,
    onSelect,
    onUpdate,
    onDelete,
    meshRef // Reference to the parent mesh (shirt) for raycasting
}) => {
    const decalRef = useRef();
    const texture = useTexture(textureUrl);
    const { camera, raycaster, gl } = useThree();
    const [isDragging, setIsDragging] = useState(false);

    // Helper to converting 3D position to screen coordinates for HTML overlay
    const [screenPos, setScreenPos] = useState({ x: 0, y: 0 });

    // Drag Logic
    const handlePointerDown = (e) => {
        e.stopPropagation();
        onSelect();
        setIsDragging(true);
    };

    const handlePointerUp = (e) => {
        setIsDragging(false);
    };

    const handlePointerMove = (e) => {
        if (isDragging && isSelected && meshRef.current) {
            e.stopPropagation();
            // Raycast against the shirt mesh to find point on surface
            const intersects = e.intersections.filter(i => i.object === meshRef.current);
            if (intersects.length > 0) {
                const point = intersects[0].point;
                // Update position
                onUpdate({
                    pos: [point.x, point.y, point.z],
                    rot: rotation,
                    scale: scale
                });
            }
        }
    };

    // Handlers for Gizmo Buttons
    const handleRotate = (e) => {
        e.stopPropagation();
        // Simple 90 degree rotation or enter rotation mode (simplified for now to 45 deg increments)
        onUpdate({ pos: position, rot: rotation + Math.PI / 4, scale });
    };

    const handleScale = (e) => {
        e.stopPropagation();
        // Simple scale up (cycle)
        const newScale = scale >= 0.3 ? 0.1 : scale + 0.05;
        onUpdate({ pos: position, rot: rotation, scale: newScale });
    };

    return (
        <group>
            <Decal
                mesh={meshRef} // Explicitly pass the parent mesh
                ref={decalRef}
                position={position}
                rotation={[0, 0, rotation]} // Z-axis rotation for 2D feel on surface
                scale={[scale, scale, 0.3]} // Reduce depth to avoid appearing on back/wrong sides
                map={texture}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
            >
                <meshStandardMaterial
                    transparent
                    polygonOffset
                    polygonOffsetFactor={-1} // Draw on top of shirt
                    map={texture}
                    roughness={1}
                    clearcoat={0}
                    metalness={0}
                    depthTest={true}
                    depthWrite={false}
                />
            </Decal>

            {isSelected && (
                <Html position={position} center zIndexRange={[100, 0]}>
                    <div
                        className="decal-gizmo"
                        style={{
                            width: `${scale * 1000}px`, // Approximate px size based on scale
                            height: `${scale * 1000 * (texture.image ? texture.image.height / texture.image.width : 1)}px`,
                            border: '2px dashed #0099ff',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none', // Let clicks pass through context
                            transform: `rotate(${-rotation}rad)` // Counter-rotate container to keep handles upright? No, rotate with it.
                        }}
                    >
                        {/* Handles - Pointer events re-enabled */}
                        <div style={{ pointerEvents: 'auto' }}>
                            {/* Delete - Bottom Left */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                                style={handleStyle('bottom', 'left')}
                            >
                                <Trash2 size={12} />
                            </button>

                            {/* Rotate - Top Right */}
                            <button
                                onClick={handleRotate}
                                style={handleStyle('top', 'right')}
                            >
                                <RotateCw size={12} />
                            </button>

                            {/* Scale - Bottom Right */}
                            <button
                                onClick={handleScale}
                                style={handleStyle('bottom', 'right')}
                            >
                                <Maximize size={12} />
                            </button>
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
};

const handleStyle = (v, h) => ({
    position: 'absolute',
    [v]: '-12px',
    [h]: '-12px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'white',
    border: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#333',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
});

export default MovableDecal;
