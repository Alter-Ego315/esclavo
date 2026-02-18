import React, { useEffect, useState, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
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



// ... generateTextureFromSvg ...

// Generate Alpha Map for V-Neck
const generateVNeckAlphaMap = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Fill white (opaque)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 1024, 1024);

    // Draw Black V-Neck shape (Transparent) based on UV mapping
    // Center top area is neck.
    // Approximate UV location for neck is top center.
    ctx.fillStyle = 'black';
    ctx.beginPath();
    // Inverted V shape at top center
    ctx.moveTo(462, 0); // Top Left
    ctx.lineTo(512, 100); // Bottom point of V
    ctx.lineTo(562, 0); // Top Right
    ctx.closePath();
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace; // Non-color data usually, but this matches map
    return tex;
};

const PoloCollar = ({ color }) => {
    // A simplified Polo collar using 3D primitives
    // Positioned relative to the shirt neck
    return (
        <group position={[0, 0.46, 0.05]} rotation={[0.2, 0, 0]} scale={[1, 1, 1]}>
            {/* Left Flap */}
            <mesh position={[-0.08, 0, 0]} rotation={[0, 0, 0.3]}>
                <boxGeometry args={[0.18, 0.08, 0.01]} />
                <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
            {/* Right Flap */}
            <mesh position={[0.08, 0, 0]} rotation={[0, 0, -0.3]}>
                <boxGeometry args={[0.18, 0.08, 0.01]} />
                <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
            {/* Back part */}
            <mesh position={[0, 0.03, -0.06]} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
                <cylinderGeometry args={[0.13, 0.13, 0.08, 32, 1, true, Math.PI, Math.PI]} />
                <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.8} />
            </mesh>
        </group>
    );
};

const ShirtModel = ({ texture, decalTexture, color, collar, accentColor }) => {
    const { nodes } = useGLTF('/shirt_baked.glb');
    const [material, setMaterial] = useState(null);

    // V-Neck Alpha Map
    const vNeckAlphaMap = useMemo(() => {
        if (collar === 'v-neck') return generateVNeckAlphaMap();
        return null; // Round view has no cut
    }, [collar]);

    useEffect(() => {
        if (nodes.T_Shirt_male) {
            const newMat = new THREE.MeshStandardMaterial({
                map: texture || null,
                color: texture ? 0xffffff : new THREE.Color(color),
                roughness: 0.7,
                metalness: 0.0,
                side: THREE.DoubleSide,
                alphaMap: vNeckAlphaMap,
                transparent: !!vNeckAlphaMap,
                alphaTest: 0.5 // Cutoff
            });

            if (texture) {
                texture.flipY = false;
                texture.colorSpace = THREE.SRGBColorSpace;
                newMat.map = texture;
            }

            setMaterial(newMat);
        }
    }, [texture, color, nodes, vNeckAlphaMap]);

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
                        position={[0, 0.05, -0.2]}
                        rotation={[0, 0, 0]}
                        scale={[0.6, 0.6, 0.3]}
                        map={decalTexture}
                        depthTest={true} // Changed to true to respect alpha?
                        renderOrder={1}
                    />
                )}
            </mesh>
            {collar === 'polo' && <PoloCollar color={accentColor || color} />}
        </group>
    );
};

// ... usage in Jersey3D ...
// <ShirtModel ... collar={props.collar} accentColor={props.colors.accent} />

// Preload to avoid loading delay
useGLTF.preload('/shirt_baked.glb');



const Jersey3D = forwardRef((props, ref) => {
    const [texture, setTexture] = useState(null);
    const [decalTexture, setDecalTexture] = useState(null);
    const containerRef = useRef();
    const controlsRef = useRef();
    const canvasRef = useRef();

    // Expose capture method to parent
    useImperativeHandle(ref, () => ({
        captureViews: async () => {
            const canvas = canvasRef.current;
            const controls = controlsRef.current;
            if (!canvas || !controls) return null;

            // Helper to capture current frame
            const capture = () => {
                return new Promise(resolve => {
                    requestAnimationFrame(() => {
                        // Force a render if needed, but r3f usually handles it
                        // We might need to wait a frame for the camera to settle
                        setTimeout(() => {
                            const dataUrl = canvas.toDataURL('image/png');
                            resolve(dataUrl);
                        }, 200); // Small delay to ensure render
                    });
                });
            };

            // 1. FRONT VIEW
            controls.object.position.set(0, 0, 0.9); // Front camera pos
            controls.target.set(0, 0.12, 0); // Target
            controls.update();

            const frontImage = await capture();

            // 2. BACK VIEW
            controls.object.position.set(0, 0, -0.9); // Back camera pos
            controls.update();

            const backImage = await capture();

            // Reset view (optional)
            controls.object.position.set(0, 0, 0.9);
            controls.update();

            return { front: frontImage, back: backImage };
        }
    }));

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
            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: [0, 0, 0.9], fov: 45 }}
                gl={{ preserveDrawingBuffer: true }}
                ref={canvasRef}
                onCreated={({ gl }) => { canvasRef.current = gl.domElement; }}
            >
                <ambientLight intensity={0.7} />
                <Environment preset="city" />

                {/* Spotlights for dramatic effect */}
                <spotLight position={[0.5, 0.5, 1]} intensity={2} angle={0.5} penumbra={1} castShadow />

                {/* Raised model to center it - Positioned to sit nicely above the bottom button */}
                <group position={[0, 0.12, 0]}>
                    <ShirtModel
                        texture={texture}
                        decalTexture={decalTexture}
                        color={props.colors.primary}
                        collar={props.collar}
                        accentColor={props.colors.accent}
                    />
                </group>

                {/* Controls */}
                <OrbitControls
                    ref={controlsRef}
                    target={[0, 0.12, 0]}
                    enablePan={false}
                    minDistance={0.5}
                    maxDistance={3}
                    makeDefault
                />
            </Canvas>

            {/* Hidden DOM element for centralized texture generation */}
            {/* We only need ONE view that wraps the whole shirt for this model usually */}
            <div className="hidden-previews" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: 0, left: 0, zIndex: -1 }}>
                <div className="full-view"><JerseyPreview {...props} view="full" /></div>
                <div className="text-decal-view"><JerseyPreview {...props} view="text-decal" /></div>
            </div>
        </div>
    );
});

export default Jersey3D;
