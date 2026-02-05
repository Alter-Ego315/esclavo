import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import JerseyPreview from './JerseyPreview';

// --- GEOMETRY HELPERS ---

// Create a semi-cylinder for front/back torso to ensure they meet perfectly at the sides
const createTorsoPart = (side = 'front') => {
    // Top radius, Bottom radius, Height, RadialSegments, HeightSegments, OpenEnded, ThetaStart, ThetaLength
    // Front: Start at 0, Length PI. Back: Start PI, Length PI.
    const radius = 2.2;
    const height = 5.5;
    const thetaStart = side === 'front' ? 0 : Math.PI;
    const geometry = new THREE.CylinderGeometry(radius, radius * 0.95, height, 64, 20, true, thetaStart, Math.PI);

    // UV Mapping correction:
    // By default, a partial cylinder maps UVs to the subset of the texture. 
    // We want the whole [0,1]x[0,1] texture to cover this semi-cylinder face.
    const uvs = geometry.attributes.uv;
    for (let i = 0; i < uvs.count; i++) {
        let u = uvs.getX(i);
        // If front (0 to 0.5 originally), map 0->0, 0.5->1
        // If back (0.5 to 1.0 originally), map 0.5->1, 1->0 (flip X for back)
        if (side === 'front') {
            u = u * 2;
        } else {
            u = (u - 0.5) * 2;
            u = 1 - u; // Flip horizontally so text isn't mirrored
        }
        uvs.setX(i, u);
    }

    // Add physiological curves (Pecs, Chest, Back arch)
    const pos = geometry.attributes.position;
    const vector = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
        vector.set(pos.getX(i), pos.getY(i), pos.getZ(i));

        const yNorm = (vector.y + height / 2) / height; // 0 (bottom) to 1 (top)

        // V-Taper: Broad shoulders, narrower waist
        const taper = 1.1 + (yNorm * 0.2);
        vector.x *= taper;
        vector.z *= taper;

        // Chest/Pecs displacement (Front only)
        if (side === 'front' && yNorm > 0.6 && yNorm < 0.9) {
            const zDisp = Math.sin((yNorm - 0.6) / 0.3 * Math.PI) * 0.3;
            // Fade displacement to sides
            const xFade = 1 - Math.abs(Math.atan2(vector.x, vector.z) / (Math.PI / 2));
            if (xFade > 0) vector.z += zDisp * xFade * 1.5;
        }

        // Slight back curve (Back only)
        if (side === 'back' && yNorm > 0.6 && yNorm < 0.9) {
            const zDisp = Math.sin((yNorm - 0.6) / 0.3 * Math.PI) * 0.15;
            vector.z -= zDisp; // Push out backwards
        }

        pos.setXYZ(i, vector.x, vector.y, vector.z);
    }

    geometry.computeVertexNormals();
    return geometry;
};

// Sleeve Geometry
const createSleeve = (isLeft) => {
    const radiusTop = 1.1;
    const radiusBottom = 0.9;
    const height = 2.2;
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32, 1, true);

    // Rotate to arm angle
    geometry.rotateZ(isLeft ? Math.PI / 4 : -Math.PI / 4);
    geometry.translate(isLeft ? 2.8 : -2.8, 1.8, 0);

    return geometry;
};

const MaterialSetup = ({ texture, colors, vibrancy }) => {
    // Generate bump map for fabric detail
    const bumpMap = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, 512, 512);
        // Noise
        for (let i = 0; i < 50000; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? '#888888' : '#787878';
            ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    return (
        <meshPhysicalMaterial
            map={texture}
            color={0xffffff}
            roughness={0.6}
            metalness={0.1}
            normalScale={new THREE.Vector2(0.5, 0.5)}
            bumpMap={bumpMap}
            bumpScale={0.02}
            side={THREE.DoubleSide}
        />
    );
};

const ShirtModel = ({ textures, colors, vibrancy }) => {
    const frontGeo = useMemo(() => createTorsoPart('front'), []);
    const backGeo = useMemo(() => createTorsoPart('back'), []);
    const sleeveLGeo = useMemo(() => createSleeve(true), []);
    const sleeveRGeo = useMemo(() => createSleeve(false), []);

    // 3D Collar Ring
    const collarGeo = useMemo(() => new THREE.TorusGeometry(1.2, 0.15, 16, 64), []);

    return (
        <group scale={[0.8, 0.8, 0.8]} position={[0, -0.5, 0]}>
            {/* Front Torso */}
            <mesh geometry={frontGeo}>
                <MaterialSetup texture={textures.bodyFront} colors={colors} vibrancy={vibrancy} />
            </mesh>

            {/* Back Torso */}
            <mesh geometry={backGeo}>
                <MaterialSetup texture={textures.bodyBack} colors={colors} vibrancy={vibrancy} />
            </mesh>

            {/* Left Sleeve */}
            <mesh geometry={sleeveLGeo}>
                <MaterialSetup texture={textures.sleeveLeft} colors={colors} vibrancy={vibrancy} />
            </mesh>

            {/* Right Sleeve */}
            <mesh geometry={sleeveRGeo}>
                <MaterialSetup texture={textures.sleeveRight} colors={colors} vibrancy={vibrancy} />
            </mesh>

            {/* Collar */}
            <mesh geometry={collarGeo} position={[0, 2.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color={colors.accent || '#111'} roughness={0.5} />
            </mesh>

            {/* Interior (Dark void to hide backfaces look) */}
            <mesh position={[0, 0, 0]} scale={[0.98, 0.98, 0.98]}>
                <cylinderGeometry args={[2.15, 2.05, 5.4, 64, 1, false]} />
                <meshBasicMaterial color="#111" side={THREE.BackSide} />
            </mesh>
        </group>
    );
};

const Jersey3D = (props) => {
    const [textures, setTextures] = useState({
        bodyFront: null,
        bodyBack: null,
        sleeveLeft: null,
        sleeveRight: null
    });

    // Texture generation logic reusing the hidden SVGs
    useEffect(() => {
        const updateTextures = async () => {
            const generateTexture = async (view) => {
                const svg = document.querySelector(`.hidden-previews .${view}-view svg`);
                if (!svg) return null;

                // Fix image hrefs for canvas export
                const images = svg.querySelectorAll('image');
                for (let img of images) {
                    const href = img.getAttribute('href');
                    if (href && href.startsWith('/')) { // Local path
                        // Convert to absolute or base64 if needed, usually browser handles relative fine for drawImage 
                        // but explicit handling is safer.
                    }
                }

                const svgData = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement('canvas');
                canvas.width = 1024;
                canvas.height = 1024;
                const ctx = canvas.getContext('2d');

                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, 1024, 1024);
                        const texture = new THREE.CanvasTexture(canvas);
                        texture.colorSpace = THREE.SRGBColorSpace;
                        texture.anisotropy = 16;
                        texture.needsUpdate = true;
                        resolve(texture);
                    };
                    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                });
            };

            const bodyFront = await generateTexture('body-front');
            const bodyBack = await generateTexture('body-back');
            const sleeveLeft = await generateTexture('sleeve-left');
            const sleeveRight = await generateTexture('sleeve-right');

            setTextures({ bodyFront, bodyBack, sleeveLeft, sleeveRight });
        };

        const timer = setTimeout(updateTextures, 200);
        return () => clearTimeout(timer);
    }, [props.colors, props.pattern, props.name, props.number, props.font, props.teamLogo, props.sponsorLogo, props.brandLogo, props.vibrancy]);

    return (
        <div className="jersey-3d-wrapper studio-mode" style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 9], fov: 35 }}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
                <spotLight position={[-10, 10, -5]} intensity={5} color={props.colors.primary} distance={20} />
                <Environment preset="studio" />

                {textures.bodyFront && (
                    <ShirtModel
                        textures={textures}
                        colors={props.colors}
                        vibrancy={props.vibrancy}
                    />
                )}

                <OrbitControls
                    enablePan={false}
                    minDistance={5}
                    maxDistance={15}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 1.8}
                    makeDefault
                />

                <ContactShadows position={[0, -3.5, 0]} opacity={0.6} scale={10} blur={2} far={4} />
            </Canvas>

            {/* Hidden DOM elements for texture generation */}
            <div className="hidden-previews" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: 0, left: 0, zIndex: -1 }}>
                <div className="body-front-view"><JerseyPreview {...props} view="body-front" /></div>
                <div className="body-back-view"><JerseyPreview {...props} view="body-back" /></div>
                <div className="sleeve-left-view"><JerseyPreview {...props} view="sleeve-left" /></div>
                <div className="sleeve-right-view"><JerseyPreview {...props} view="sleeve-right" /></div>
            </div>
        </div>
    );
};

export default Jersey3D;
