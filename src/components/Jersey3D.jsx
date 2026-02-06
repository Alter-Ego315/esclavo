import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, useTexture, Decal } from '@react-three/drei';
import * as THREE from 'three';
import JerseyPreview from './JerseyPreview';

const ShirtModel = ({ texture, color, vibrancy }) => {
    // Load the GLB model
    // Ensure the file is in public/shirt_baked.glb
    const { nodes } = useGLTF('/shirt_baked.glb');
    const [material, setMaterial] = useState(null);

    // Apply the dynamic texture to the model
    useEffect(() => {
        if (nodes.T_Shirt_male) {
            // Create a new material to avoid sharing issues
            const newMat = new THREE.MeshStandardMaterial({
                map: texture || null,
                color: texture ? 0xffffff : new THREE.Color(color),
                roughness: 0.3,
                metalness: 0.1,
                side: THREE.DoubleSide
            });

            // Fix texture encoding/flipping
            if (texture) {
                texture.flipY = false;
                texture.colorSpace = THREE.SRGBColorSpace;
                newMat.map = texture;
            }

            setMaterial(newMat);
        }
    }, [texture, color, nodes]);

    if (!nodes.T_Shirt_male) return null;

    return (
        <group dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.T_Shirt_male.geometry}
                material={material || nodes.T_Shirt_male.material}
            />
        </group>
    );
};

// Preload to avoid loading delay
useGLTF.preload('/shirt_baked.glb');

const Jersey3D = (props) => {
    const [texture, setTexture] = useState(null);
    const containerRef = useRef();

    // Texture generation logic
    useEffect(() => {
        const updateTexture = async () => {
            // Scope selector to this component's container if possible, 
            // but simpler to use ID or specific class.
            // We added 'full-view' class.
            const svg = document.querySelector(`.hidden-previews .full-view svg`);
            if (!svg) return;

            // Simple serialization
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');

            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, 1024, 1024);
                ctx.drawImage(img, 0, 0, 1024, 1024);
                const tex = new THREE.CanvasTexture(canvas);
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.flipY = false;
                setTexture(tex);
            };
            // Add current time triggers to avoid cache
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        };

        // Increase timeout slightly to allow React to paint the hidden SVG
        const timer = setTimeout(updateTexture, 300);
        return () => clearTimeout(timer);
    }, [props.colors, props.pattern, props.name, props.number, props.font, props.teamLogo, props.sponsorLogo, props.brandLogo, props.vibrancy]);

    return (
        <div className="jersey-3d-wrapper studio-mode" ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Camera adjusted: z from 0.6 to 2.5 for zoom out */}
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 2.5], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
                <ambientLight intensity={0.7} />
                <Environment preset="city" />

                {/* Spotlights for dramatic effect */}
                <spotLight position={[0.5, 0.5, 1]} intensity={2} angle={0.5} penumbra={1} castShadow />

                <group position={[0, -0.8, 0]}>
                    <ShirtModel texture={texture} color={props.colors.primary} />
                </group>

                {/* Controls */}
                <OrbitControls
                    target={[0, 0, 0]}
                    enablePan={false}
                    minDistance={1.5}
                    maxDistance={5}
                    makeDefault
                />

                <ContactShadows position={[0, -0.9, 0]} opacity={0.6} scale={10} blur={2} far={1.5} />
            </Canvas>

            {/* Hidden DOM element for centralized texture generation */}
            {/* We only need ONE view that wraps the whole shirt for this model usually */}
            <div className="hidden-previews" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: 0, left: 0, zIndex: -1 }}>
                <div className="full-view"><JerseyPreview {...props} view="full" /></div>
            </div>
        </div>
    );
};

export default Jersey3D;
