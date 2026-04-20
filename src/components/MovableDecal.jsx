import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Decal, Html } from '@react-three/drei';
import { Trash2 } from 'lucide-react';
import * as THREE from 'three';

/**
 * MovableDecal — logo 3D con gizmo de transformación libre.
 *
 * CONTROLES (clic izquierdo):
 *  - Arrastrar la imagen → mover
 *  - Arrastrar handle de rotación (arriba) → rotar libremente
 *  - Arrastrar handles de borde/esquina → escalar X y/o Y
 */
const MovableDecal = ({
    position, rotation, scaleX, scaleY,
    texture, isSelected, noFlip,
    onSelect, onUpdate, onDelete, meshRef, onDragChange
}) => {
    // texture is already a THREE.Texture object passed in from Jersey3D
    useEffect(() => {
        if (texture) {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.flipY = false;
            texture.anisotropy = 16;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.needsUpdate = true;
        }
    }, [texture]);

    const [isDragging, setIsDragging] = useState(false);

    // ── Mover arrastrando la imagen ───────────────────────────────────────────
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
        if (e.target.hasPointerCapture && e.target.hasPointerCapture(e.pointerId)) {
            e.target.releasePointerCapture(e.pointerId);
        }
    };

    const handlePointerMove = (e) => {
        if (isDragging) e.stopPropagation();
    };

    // ── Gizmo handles ────────────────────────────────────────────────────────
    const gizmoRef = useRef();
    const dragStateRef = useRef(null);

    // Tamaño del gizmo ajustado para ser más ceñido a la imagen visible.
    // Factor ~670 empíricamente calibrado para cámara a z=0.9, fov=45, distanceFactor=1.2
    const gizmoW = Math.max(35, scaleX * 670);
    const gizmoH = Math.max(25, scaleY * 670);
    const HANDLE_SIZE = 9;

    const scaleHandles = [
        { id: 'tl', x: -0.5, y: -0.5, cursor: 'nw-resize', dx: -1, dy: -1 },
        { id: 'tr', x: 0.5, y: -0.5, cursor: 'ne-resize', dx: 1, dy: -1 },
        { id: 'bl', x: -0.5, y: 0.5, cursor: 'sw-resize', dx: -1, dy: 1 },
        { id: 'br', x: 0.5, y: 0.5, cursor: 'se-resize', dx: 1, dy: 1 },
        { id: 'ml', x: -0.5, y: 0, cursor: 'w-resize', dx: -1, dy: 0 },
        { id: 'mr', x: 0.5, y: 0, cursor: 'e-resize', dx: 1, dy: 0 },
        { id: 'mt', x: 0, y: -0.5, cursor: 'n-resize', dx: 0, dy: -1 },
        { id: 'mb', x: 0, y: 0.5, cursor: 's-resize', dx: 0, dy: 1 },
    ];

    const startHandleDrag = useCallback((e, type, handleDef) => {
        e.preventDefault();
        e.stopPropagation();
        e.target.setPointerCapture(e.pointerId);
        if (onDragChange) onDragChange(true);

        const gizmoEl = gizmoRef.current;
        let cx = 0, cy = 0;
        if (gizmoEl) {
            const rect = gizmoEl.getBoundingClientRect();
            cx = rect.left + rect.width / 2;
            cy = rect.top + rect.height / 2;
        }

        dragStateRef.current = {
            type,
            startX: e.clientX, startY: e.clientY,
            startRot: rotation,
            startSX: scaleX, startSY: scaleY,
            cx, cy, handleDef,
            pointerId: e.pointerId, target: e.target,
        };

        const onMove = (ev) => {
            const ds = dragStateRef.current;
            if (!ds) return;

            if (ds.type === 'rotate') {
                const angleStart = Math.atan2(ds.startY - ds.cy, ds.startX - ds.cx);
                const angleCurrent = Math.atan2(ev.clientY - ds.cy, ev.clientX - ds.cx);
                const newRot = ds.startRot - (angleCurrent - angleStart);
                onUpdate({ pos: position, rot: newRot, scaleX: ds.startSX, scaleY: ds.startSY });

            } else if (ds.type === 'scale') {
                const dMx = ev.clientX - ds.startX;
                const dMy = ev.clientY - ds.startY;
                const { dx, dy } = ds.handleDef;
                const SENS = 80;

                let newSX = ds.startSX;
                let newSY = ds.startSY;
                if (dx !== 0) newSX = Math.max(0.01, ds.startSX + (dMx * dx / SENS) * ds.startSX);
                if (dy !== 0) newSY = Math.max(0.01, ds.startSY + (dMy * dy / SENS) * ds.startSY);

                onUpdate({ pos: position, rot: ds.startRot, scaleX: newSX, scaleY: newSY });
            } else if (ds.type === 'move') {
                // Para mover en 3D basado en pixeles arrastrados
                const dMx = ev.clientX - ds.startX;
                const dMy = ev.clientY - ds.startY;
                // Sensibilidad ajustada para que el arrastre en pantalla coincida aprox con el modelo
                const moveScale = 0.0015;
                const newPos = [
                    position[0] + dMx * moveScale,
                    position[1] - dMy * moveScale, // Invertimos Y porque en CSS Y crece hacia abajo
                    position[2]
                ];
                onUpdate({ pos: newPos, rot: ds.startRot, scaleX: ds.startSX, scaleY: ds.startSY });
            }
        };

        const onUp = () => {
            if (onDragChange) onDragChange(false);
            dragStateRef.current = null;
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
        };

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
    }, [position, rotation, scaleX, scaleY, onUpdate, onDragChange]);

    // ── Teclado para mover (flechas) ──────────────────────────────────────────
    React.useEffect(() => {
        if (!isSelected) return;

        const handleKeyDown = (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                const step = 0.002; // Tamaño del paso al pulsar una flecha
                let newPos = [...position];

                if (e.key === 'ArrowUp') newPos[1] += step;
                if (e.key === 'ArrowDown') newPos[1] -= step;
                if (e.key === 'ArrowLeft') newPos[0] -= step;
                if (e.key === 'ArrowRight') newPos[0] += step;

                onUpdate({ pos: newPos, rot: rotation, scaleX, scaleY });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSelected, position, rotation, scaleX, scaleY, onUpdate]);

    // ── Estilos ───────────────────────────────────────────────────────────────
    const hBase = {
        position: 'absolute',
        width: `${HANDLE_SIZE}px`,
        height: `${HANDLE_SIZE}px`,
        background: 'white',
        border: '1.5px solid #333',
        boxSizing: 'border-box',
        pointerEvents: 'auto',
        zIndex: 10,
    };

    // Icono de rotación (coherente con el estilo del botón de mover)
    const RotateIcon = () => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
            <polyline points="21 3 21 8 16 8"></polyline>
        </svg>
    );

    return (
        <>
            <Decal
                position={position}
                rotation={[0, 0, rotation]}
                scale={[noFlip ? scaleX : -scaleX, scaleY, 0.2]}
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
                <Html position={position} center distanceFactor={1.2}>
                    <div
                        ref={gizmoRef}
                        onContextMenu={(e) => e.preventDefault()}
                        style={{
                            position: 'relative',
                            width: `${gizmoW}px`,
                            height: `${gizmoH}px`,
                            border: '1.5px dashed rgba(57,255,20,0.85)',
                            borderRadius: '2px',
                            pointerEvents: 'none',
                            userSelect: 'none',
                            boxSizing: 'border-box',
                        }}
                    >
                        {/* Línea al handle de rotación */}
                        <div style={{
                            position: 'absolute', top: '-20px', left: '50%',
                            transform: 'translateX(-50%)',
                            width: '1px', height: '20px',
                            background: 'rgba(100,100,100,0.6)',
                            pointerEvents: 'none',
                        }} />

                        {/* Handle de rotación (arriba) */}
                        <div
                            title="Rotar (arrastra)"
                            style={{
                                position: 'absolute',
                                top: '-44px',
                                left: '50%', transform: 'translateX(-50%)',
                                width: '26px', height: '26px',
                                background: 'rgba(255,255,255,0.92)',
                                border: '1.5px solid #555',
                                borderRadius: '50%',
                                cursor: 'grab',
                                pointerEvents: 'auto',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                            }}
                            onPointerDown={(e) => startHandleDrag(e, 'rotate', null)}
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            <RotateIcon />
                        </div>

                        {/* Línea al handle de movimiento */}
                        <div style={{
                            position: 'absolute', bottom: '-20px', left: '50%',
                            transform: 'translateX(-50%)',
                            width: '1px', height: '20px',
                            background: 'rgba(100,100,100,0.6)',
                            pointerEvents: 'none',
                        }} />

                        {/* Handle de movimiento (abajo) */}
                        <div
                            title="Mover (arrastra)"
                            style={{
                                position: 'absolute',
                                bottom: '-44px',
                                left: '50%', transform: 'translateX(-50%)',
                                width: '26px', height: '26px',
                                background: 'rgba(255,255,255,0.92)',
                                border: '1.5px solid #555',
                                borderRadius: '50%',
                                cursor: 'move',
                                pointerEvents: 'auto',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                            }}
                            onPointerDown={(e) => startHandleDrag(e, 'move', null)}
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="5 9 2 12 5 15"></polyline>
                                <polyline points="9 5 12 2 15 5"></polyline>
                                <polyline points="19 9 22 12 19 15"></polyline>
                                <polyline points="9 19 12 22 15 19"></polyline>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <line x1="12" y1="2" x2="12" y2="22"></line>
                            </svg>
                        </div>

                        {/* Botón eliminar */}
                        <button
                            title="Eliminar"
                            style={{
                                position: 'absolute', top: '-26px', right: '-4px',
                                background: 'rgba(210,40,40,0.92)', border: 'none',
                                borderRadius: '5px', color: 'white',
                                width: '20px', height: '20px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', pointerEvents: 'auto', padding: 0,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                            }}
                            onPointerDown={(e) => { e.stopPropagation(); onDelete(); }}
                        >
                            <Trash2 size={11} />
                        </button>

                        {/* 8 Handles de escala */}
                        {scaleHandles.map((h) => (
                            <div
                                key={h.id}
                                title="Escalar (arrastra)"
                                style={{
                                    ...hBase,
                                    cursor: h.cursor,
                                    left: `calc(${(h.x + 0.5) * 100}% - ${HANDLE_SIZE / 2}px)`,
                                    top: `calc(${(h.y + 0.5) * 100}% - ${HANDLE_SIZE / 2}px)`,
                                    borderRadius: (h.dx !== 0 && h.dy !== 0) ? '2px' : '50%',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                                }}
                                onPointerDown={(e) => startHandleDrag(e, 'scale', h)}
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        ))}
                    </div>
                </Html>
            )}
        </>
    );
};

export default MovableDecal;