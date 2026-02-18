import React, { useEffect, useState, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, useTexture, Decal } from '@react-three/drei';
import * as THREE from 'three';
import JerseyPreview from './JerseyPreview';

const generateNameNumberTexture = (name, number, font, color) => {
    const canvas = document.createElement('canvas');
    const size = 1024; // High res
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Clear
    ctx.clearRect(0, 0, size, size);

    // MIRROR TEXTURE (Back of shirt needs flipped texture)
    ctx.translate(size, 0);
    ctx.scale(-1, 1);

    // Text Settings
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;

    // Draw Name (Top)
    // Scale font size based on length
    let fontSizeName = 120;
    if (name.length > 8) fontSizeName = 100;
    if (name.length > 12) fontSizeName = 80;

    ctx.font = `900 ${fontSizeName}px "${font}"`; // Quote font name to handle spaces
    ctx.fillText(name, size / 2, size * 0.4);

    // Draw Number (Bottom)
    ctx.font = `900 350px "${font}"`;
    ctx.fillText(number, size / 2, size * 0.7);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
};


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
        const size = 4096; // 4K Resolution !
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

// Generate Alpha Map for V-Neck
const generateVNeckAlphaMap = () => {
    const canvas = document.createElement('canvas');
    const size = 4096;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Fill white (opaque)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);

    // Draw Black V-Neck shape (Transparent) based on UV mapping
    // Scale coordinates from 1024 to 4096 (x4)
    ctx.fillStyle = 'black';
    ctx.beginPath();
    // Inverted V shape at top center
    // Original: 462, 0 -> 512, 100 -> 562, 0
    // Times 4: 1848, 0 -> 2048, 400 -> 2248, 0
    ctx.moveTo(1848, 0); // Top Left
    ctx.lineTo(2048, 400); // Bottom point of V
    ctx.lineTo(2248, 0); // Top Right
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
            const gl = canvasRef.current.getContext('webgl2') || canvasRef.current.getContext('webgl'); // Get GL context

            if (!canvas || !controls) return null;

            // 1. Save original size
            const originalWidth = canvas.width;
            const originalHeight = canvas.height;
            const originalPixelRatio = window.devicePixelRatio;

            // 2. Force High-Res (e.g., 2048x2048)
            const exportSize = 2048;

            // We need to resize the renderer, not just the canvas style
            // This is tricky with R3F as it manages sizing.
            // A safer hack: Resize the canvas, force a render, then restore.
            // leveraging the 'gl' instance from useThree would be better, but we don't have it here directly without a hook.
            // However, we can access it via canvasRef if we are careful, or just rely on window size if we want screen capture.
            // BUT user wants HIGH RES.

            // Let's try attempting to resize the canvas DOM and notify three.js (if possible)
            // Or simpler: Just maximize the pixel ratio for the capture momentarily.

            // Better approach for stability:
            // Just use the current size but boost PixelRatio if on mobile?
            // No, user specifically said "images are too small". 
            // So we MUST resize.

            const setSize = (w, h) => {
                canvas.width = w;
                canvas.height = h;
                canvas.style.width = `${w}px`;
                canvas.style.height = `${h}px`;
                // We also need to tell the GL context to resize viewport
                if (gl) gl.viewport(0, 0, w, h);
            };

            // Capture helper
            const capture = () => {
                return new Promise(resolve => {
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            // Force render if not inside loop? OrbitControls change triggers it.
                            const dataUrl = canvas.toDataURL('image/png', 1.0); // Max quality
                            resolve(dataUrl);
                        }, 250);
                    });
                });
            };

            // --- START CAPTURE SEQUENCE ---

            // Store current style to restore later
            const savedStyleWidth = canvas.style.width;
            const savedStyleHeight = canvas.style.height;

            // Force canvas to high res
            setSize(exportSize, exportSize);

            // 1. FRONT VIEW
            controls.object.position.set(0, 0, 0.9);
            controls.target.set(0, 0.12, 0);
            controls.update();

            // Wait for resize and render
            const frontImage = await capture();

            // 2. BACK VIEW
            controls.object.position.set(0, 0, -0.9);
            controls.update();

            const backImage = await capture();

            // --- RESTORE ---
            // Restore original size (this might glitch for a frame, but it's fine)
            // Ideally R3F Resizer observer will pick this up if we just reset style to 100%
            canvas.style.width = savedStyleWidth || '100%';
            canvas.style.height = savedStyleHeight || '100%';
            // Let the browser/R3F handle the exact pixel/canvas size restoration on next frame

            // Reset Camera
            controls.object.position.set(0, 0, 0.9);
            controls.update();

            return { front: frontImage, back: backImage };
        }
    }));

    // Texture generation logic
    useEffect(() => {
        const updateTextures = async () => {
            // Generate Main Texture (Patterns/Colors - still uses SVG as it works fine)
            const mainTex = await generateTextureFromSvg(`.hidden-previews .full-view svg`, false);
            if (mainTex) setTexture(mainTex);

            // Generate Decal Texture (Name/Number - use Canvas for fonts)
            // Wait for fonts to be ready (optional but recommended)
            try {
                await document.fonts.load(`100px "${props.font}"`);
            } catch (e) {
                console.warn('Font load warning:', e);
            }

            const decalTex = generateNameNumberTexture(props.name, props.number, props.font, props.colors.secondary);
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
