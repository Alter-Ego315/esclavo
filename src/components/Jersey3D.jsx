import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import JerseyPreview from './JerseyPreview';

// Helper to apply professional anatomical silhouette (V-Taper + Chest definition)
const anatomyGeometry = (geometry) => {
    const pos = geometry.attributes.position;
    const uv = geometry.attributes.uv;

    for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // 1. Taper Logic (V-Shape)
        // Normalize Y to 0-1 range (approx height -2.25 to 2.25)
        const normalizedY = (y + 2.25) / 4.5;
        const taperFactor = 0.85 + (normalizedY * 0.35); // Narrow at bottom, wide at shoulders
        x *= taperFactor;

        // 2. Chest Pec Definition
        // If front (z > 0) and in chest area (upper half)
        if (z > -0.01 && normalizedY > 0.6 && normalizedY < 0.9) {
            const chestXFade = Math.cos((x / 1.7) * Math.PI / 2); // Fade towards sides
            const chestYFade = Math.sin((normalizedY - 0.6) / 0.3 * Math.PI); // Fade towards neck/stomach
            z += 0.25 * chestXFade * chestYFade;
        }

        // 3. Volumetric Curving (The "Body" wrap)
        const radius = 2.8;
        const angle = x / radius;
        const bentX = Math.sin(angle) * radius;
        const bentZ = (Math.cos(angle) * radius) - radius + z;

        pos.setX(i, bentX);
        pos.setZ(i, bentZ);
        pos.setY(i, y);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
};

const JerseyMesh = ({ textures, colors, vibrancy, view }) => {
    const groupRef = useRef();
    const { bodyFront, bodyBack, sleeveLeft, sleeveRight } = textures;

    // Standard high-quality displacement & normal map
    const [displacementMap, normalMap] = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Fabric pattern for normal map
        ctx.fillStyle = '#8080ff'; // Flat normal
        ctx.fillRect(0, 0, 512, 512);

        ctx.strokeStyle = '#8585ff';
        ctx.lineWidth = 1;
        for (let i = 0; i < 512; i += 4) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 512);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(512, i);
            ctx.stroke();
        }

        const nMap = new THREE.CanvasTexture(canvas);
        nMap.wrapS = nMap.wrapT = THREE.RepeatWrapping;
        nMap.repeat.set(8, 8);

        // Displacement for micro-wrinkles
        const dCanvas = document.createElement('canvas');
        dCanvas.width = 512;
        dCanvas.height = 512;
        const dCtx = dCanvas.getContext('2d');
        dCtx.fillStyle = '#808080';
        dCtx.fillRect(0, 0, 512, 512);
        dCtx.filter = 'blur(10px)';
        for (let i = 0; i < 20; i++) {
            dCtx.fillStyle = '#909090';
            dCtx.fillRect(Math.random() * 512, Math.random() * 512, 100, 2);
        }
        const dMap = new THREE.CanvasTexture(dCanvas);

        return [dMap, nMap];
    }, []);

    const fabricMaterial = useMemo(() => {
        return new THREE.MeshPhysicalMaterial({
            displacementMap: displacementMap,
            displacementScale: 0.05,
            normalMap: normalMap,
            normalScale: new THREE.Vector2(0.3, 0.3),
            roughness: 0.7,
            metalness: 0.05,
            sheen: 0.2,
            sheenColor: new THREE.Color("#ffffff"),
            clearcoat: 0.02,
            transparent: true,
            side: THREE.DoubleSide,
        });
    }, [displacementMap, normalMap]);

    // Animate rotation based on view prop
    useFrame((state, delta) => {
        if (!groupRef.current) return;
        const targetRotation = view === 'back' ? Math.PI : 0;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            targetRotation,
            delta * 4
        );
    });

    const frontGeom = useMemo(() => {
        const geom = new THREE.PlaneGeometry(3.5, 4.5, 128, 128);
        anatomyGeometry(geom);
        return geom;
    }, []);

    const backGeom = useMemo(() => {
        const geom = new THREE.PlaneGeometry(3.5, 4.5, 128, 128);
        anatomyGeometry(geom);
        return geom;
    }, []);

    return (
        <group ref={groupRef}>
            {/* Front Body */}
            <mesh geometry={frontGeom} position={[0, -0.2, 0.2]}>
                <primitive object={fabricMaterial} attach="material" map={bodyFront} />
            </mesh>

            {/* Back Body */}
            <mesh geometry={backGeom} position={[0, -0.2, -0.2]} rotation={[0, Math.PI, 0]}>
                <primitive object={fabricMaterial.clone()} attach="material" map={bodyBack} />
            </mesh>

            {/* Side Closures */}
            <mesh position={[1.4, -0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[0.4, 4.5]} />
                <primitive object={fabricMaterial} attach="material" color={colors.accent || colors.primary} />
            </mesh>
            <mesh position={[-1.4, -0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[0.4, 4.5]} />
                <primitive object={fabricMaterial} attach="material" color={colors.accent || colors.primary} />
            </mesh>

            {/* Sleeves (Positioned for V-Taper) */}
            <mesh position={[-1.75, 1.35, 0.1]} rotation={[0, -0.2, 0.45]}>
                <cylinderGeometry args={[0.55, 0.45, 2.0, 32, 1, true]} />
                <primitive object={fabricMaterial.clone()} attach="material" map={sleeveLeft} />
            </mesh>
            <mesh position={[1.75, 1.35, 0.1]} rotation={[0, 0.2, -0.45]}>
                <cylinderGeometry args={[0.55, 0.45, 2.0, 32, 1, true]} />
                <primitive object={fabricMaterial.clone()} attach="material" map={sleeveRight} />
            </mesh>

            {/* 3D Collar */}
            <mesh position={[0, 2.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.7, 0.1, 16, 64]} />
                <meshPhysicalMaterial color={colors.accent || "#050505"} roughness={0.8} />
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

    useEffect(() => {
        const updateTextures = async () => {
            const generateTexture = async (view) => {
                const svg = document.querySelector(`.hidden-previews .${view}-view svg`);
                if (!svg) return null;

                const images = svg.querySelectorAll('image');
                for (let img of images) {
                    const href = img.getAttribute('href');
                    if (href && href.startsWith('http')) {
                        try {
                            const response = await fetch(href);
                            const blob = await response.blob();
                            const base64 = await new Promise((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result);
                                reader.readAsDataURL(blob);
                            });
                            img.setAttribute('href', base64);
                        } catch (e) {
                            console.warn("Retrying image load...", href);
                        }
                    }
                }

                const svgData = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement('canvas');
                canvas.width = 2048; // High resolution
                canvas.height = 2048;
                const ctx = canvas.getContext('2d');

                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, 2048, 2048);
                        const texture = new THREE.CanvasTexture(canvas);
                        texture.anisotropy = 16;
                        texture.colorSpace = THREE.SRGBColorSpace;
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

        const timer = setTimeout(updateTextures, 300);
        return () => clearTimeout(timer);
    }, [props.colors, props.pattern, props.name, props.number, props.font, props.teamLogo, props.sponsorLogo, props.brandLogo, props.vibrancy]);

    return (
        <div className="jersey-3d-wrapper studio-mode" style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={35} />
                <ambientLight intensity={1.2} />
                <directionalLight position={[5, 10, 5]} intensity={3} castShadow />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={12} />
                <pointLight position={[0, -5, 5]} intensity={2} color={props.colors.primary} />
                <Environment preset="studio" />

                {textures.bodyFront && (
                    <JerseyMesh
                        textures={textures}
                        colors={props.colors}
                        vibrancy={props.vibrancy}
                        view={props.view}
                    />
                )}

                <OrbitControls enablePan={false} minDistance={4.5} maxDistance={10} makeDefault />
                <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={15} blur={3} far={4.5} />
            </Canvas>
            <div className="hidden-previews" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: 0, left: 0 }}>
                <div className="body-front-view"><JerseyPreview {...props} view="body-front" /></div>
                <div className="body-back-view"><JerseyPreview {...props} view="body-back" /></div>
                <div className="sleeve-left-view"><JerseyPreview {...props} view="sleeve-left" /></div>
                <div className="sleeve-right-view"><JerseyPreview {...props} view="sleeve-right" /></div>
            </div>
        </div>
    );
};

export default Jersey3D;
