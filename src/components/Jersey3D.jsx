import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, useTexture, Decal } from '@react-three/drei';
import * as THREE from 'three';
import JerseyPreview from './JerseyPreview';

// Helper to generate texture from SVG DOM
const generateTextureFromSvg = async (selector, mirror = false) => {
    return new Promise((resolve) => {
        const svgElement = document.querySelector(selector);
        if (!svgElement) {
            resolve(null);
            return;
        }

        // Serialize SVG and create Blob
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        // Draw to Canvas
        const canvas = document.createElement('canvas');
        const size = 1024; // High res
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, size, size);

            if (mirror) {
                ctx.translate(size, 0);
                ctx.scale(-1, 1);
            }

            ctx.drawImage(img, 0, 0, size, size);
            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;

            // Texture settings
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;

            URL.revokeObjectURL(url);
            resolve(tex);
        };
        img.src = url;
    });
};

const ShirtModel = ({ texture, decalTexture, color, vibrancy }) => {
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
                roughness: 0.7,
                metalness: 0.0,
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
            >
                {decalTexture && (
                    <Decal
                        debug={false}
                        position={[0, 0.25, -0.2]}
                        rotation={[0, 0, 0]}
                        scale={[0.6, 0.6, 2]}
                        map={decalTexture}
                        depthTest={false}
                        renderOrder={1}
                    />
                )}
            </mesh>
        </group>
    );
};

// Preload to avoid loading delay
useGLTF.preload('/shirt_baked.glb');

const Jersey3D = (props) => {
    const [texture, setTexture] = useState(null);
    const [decalTexture, setDecalTexture] = useState(null);
    const containerRef = useRef();

    // Texture generation logic
    useEffect(() => {
        const updateTextures = async () => {
            // Generate Main Texture
            const mainTex = await generateTextureFromSvg(`.hidden-previews .full-view svg`, false);
            if (mainTex) setTexture(mainTex);

            // Generate Decal Texture (MIRRORED)
            const decalTex = await generateTextureFromSvg(`.hidden-previews .text-decal-view svg`, true);
            if (decalTex) setDecalTexture(decalTex);
        };

        // Increase timeout slightly to allow React to paint the hidden SVG
        const timer = setTimeout(updateTextures, 300);
        return () => clearTimeout(timer);
    }, [props.colors, props.pattern, props.name, props.number, props.font, props.teamLogo, props.sponsorLogo, props.brandLogo, props.vibrancy, props.collar, props.sleeve]);

    return (
        <div className="jersey-3d-wrapper studio-mode" ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Camera adjusted: Centered and closer */}
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 1.1], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
                <ambientLight intensity={0.7} />
                <Environment preset="city" />

                {/* Spotlights for dramatic effect */}
                <spotLight position={[0.5, 0.5, 1]} intensity={2} angle={0.5} penumbra={1} castShadow />

                {/* Raised model to center it */}
                <group position={[0, 0.5, 0]}>
                    <ShirtModel texture={texture} decalTexture={decalTexture} color={props.colors.primary} />
                </group>

                {/* Controls */}
                <OrbitControls
                    target={[0, 0.5, 0]}
                    enablePan={false}
                    minDistance={0.8}
                    maxDistance={3}
                    makeDefault
                />

                <ContactShadows position={[0, -0.5, 0]} opacity={0.6} scale={10} blur={2} far={1.5} />
            </Canvas>

            {/* Hidden DOM element for centralized texture generation */}
            {/* We only need ONE view that wraps the whole shirt for this model usually */}
            <div className="hidden-previews" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: 0, left: 0, zIndex: -1 }}>
                <div className="full-view"><JerseyPreview {...props} view="full" /></div>
                <div className="text-decal-view"><JerseyPreview {...props} view="text-decal" /></div>
            </div>
        </div>
    );
};

export default Jersey3D;
