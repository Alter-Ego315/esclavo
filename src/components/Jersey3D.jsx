import React, { useEffect, useState, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Decal, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import JerseyPreview from './JerseyPreview';
import MovableDecal from './MovableDecal';

// Helper component to adjust camera zoom/position when locked
const CameraAdjuster = ({ viewLocked, controlsRef }) => {
    useEffect(() => {
        if (viewLocked && controlsRef.current) {
            const controls = controlsRef.current;
            const camera = controls.object;
            const target = controls.target;

            // Set specific target for locked view (higher Y = shirt lower)
            target.set(0, 0.25, 0);

            const direction = new THREE.Vector3().subVectors(camera.position, target).normalize();
            // Distance increased to 1.1 for less zoom
            const newPos = target.clone().add(direction.multiplyScalar(1.1));
            camera.position.copy(newPos);
            controls.update();
        }
    }, [viewLocked, controlsRef]);
    return null;
};

const getContrastingHex = (hex) => {
    if (!hex) return '#ffffff';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Relative luminance formula per W3C
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // If background is bright (like Ginga Green or White), use Black outline
    // If background is dark (Black), use White outline
    return luminance > 0.5 ? '#000000' : '#ffffff';
};

const generateNameNumberTexture = (name, number, font, color, bgColor) => {
    const canvas = document.createElement('canvas');
    const width = 1024;
    const height = 1536;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    const outlineColor = getContrastingHex(bgColor);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 4;
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = 4; // Slightly thicker for better visibility

    const displayName = String(name || '').toUpperCase();
    if (displayName) {
        let fontSizeName = 180;
        if (displayName.length > 6) fontSizeName = 160;
        if (displayName.length > 8) fontSizeName = 140;
        ctx.font = `900 ${fontSizeName}px "${font}"`;
        ctx.strokeText(displayName, width / 2, height * 0.30);
        ctx.fillText(displayName, width / 2, height * 0.30);
    }

    const displayNumber = String(number || '');
    if (displayNumber) {
        ctx.font = `900 440px "${font}"`;
        ctx.strokeText(displayNumber, width / 2, height * 0.58, 580);
        ctx.fillText(displayNumber, width / 2, height * 0.58, 580);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
};

const generateTextureFromSvg = async (selector, mirror = false) => {
    return new Promise((resolve) => {
        const svgElement = document.querySelector(selector);
        if (!svgElement) { resolve(null); return; }

        const svgString = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const canvas = document.createElement('canvas');
        const size = 4096;
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
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            URL.revokeObjectURL(url);
            resolve(tex);
        };
        img.src = url;
    });
};

const generateVNeckAlphaMap = () => {
    const canvas = document.createElement('canvas');
    const size = 4096;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(1848, 0);
    ctx.lineTo(2048, 400);
    ctx.lineTo(2248, 0);
    ctx.closePath();
    ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
};

const PoloCollar = ({ color }) => (
    <group position={[0, 0.46, 0.05]} rotation={[0.2, 0, 0]} scale={[1, 1, 1]}>
        <mesh position={[-0.08, 0, 0]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.18, 0.08, 0.01]} />
            <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        <mesh position={[0.08, 0, 0]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.18, 0.08, 0.01]} />
            <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.03, -0.06]} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.08, 32, 1, true, Math.PI, Math.PI]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.8} />
        </mesh>
    </group>
);

const GINGA_LOGOS = [
    { name: 'blanco', color: [255, 255, 255], path: '/Logos de Ginga/Logo Ginga trasparente sin texto (blanco).png' },
    { name: 'negro', color: [0, 0, 0], path: '/Logos de Ginga/Logo Ginga trasparente sin texto (negro).png' },
    { name: 'verde', color: [57, 255, 20], path: '/Logos de Ginga/Logo Ginga trasparente sin texto (verde).png' },
    { name: 'rojo', color: [255, 0, 0], path: '/Logos de Ginga/Logo Ginga trasparente sin texto (rojo).png' },
    { name: 'azul claro', color: [0, 204, 255], path: '/Logos de Ginga/Logo Ginga trasparente sin texto (azul claro).png' },
    { name: 'azul oscuro', color: [0, 0, 51], path: '/Logos de Ginga/Logo Ginga trasparente sin texto (azul oscuro).png' },
    { name: 'amarillo', color: [255, 255, 0], path: '/Logos de Ginga/Logo Ginga trasparente sin texto (amarillo).png' },
    { name: 'naranja', color: [255, 153, 0], path: '/Logos de Ginga/Logo Ginga trasparente sin texto (orange).png' },
    { name: 'rosa', color: [255, 51, 204], path: '/Logos de Ginga/Logo Ginga trasparente sin texto (rosa).png' },
    { name: 'morado', color: [102, 0, 204], path: '/Logos de Ginga/Logo Ginga trasparente sin texto (morado).png' }
];

const getContrastingLogo = (hex) => {
    if (!hex) return GINGA_LOGOS[0].path;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Goal: Maximum visibility. Inverted color is a good heuristic.
    const target = [255 - r, 255 - g, 255 - b];

    let bestLogo = GINGA_LOGOS[0];
    let minDist = Infinity;

    GINGA_LOGOS.forEach(logo => {
        const dist = Math.sqrt(
            Math.pow(target[0] - logo.color[0], 2) +
            Math.pow(target[1] - logo.color[1], 2) +
            Math.pow(target[2] - logo.color[2], 2)
        );
        if (dist < minDist) {
            minDist = dist;
            bestLogo = logo;
        }
    });
    return bestLogo.path;
};

const ShirtModel = ({
    texture, decalTexture, color, collar, accentColor,
    teamLogo, sponsorLogo, teamLogoState, sponsorLogoState,
    onTeamLogoUpdate, onSponsorLogoUpdate, selectedLogo, onSelectLogo,
    isDraggingAny, onDragChange
}) => {
    const { nodes, materials } = useGLTF('/shirt_baked.glb');
    const [material, setMaterial] = useState(null);
    const meshRef = useRef();

    const brandTexture = useTexture(getContrastingLogo(color));

    useEffect(() => {
        if (brandTexture) {
            brandTexture.colorSpace = THREE.SRGBColorSpace;
            brandTexture.anisotropy = 16;
            brandTexture.minFilter = THREE.LinearFilter;
            brandTexture.magFilter = THREE.LinearFilter;
            brandTexture.flipY = false;
        }
    }, [brandTexture]);

    const vNeckAlphaMap = useMemo(() => collar === 'v-neck' ? generateVNeckAlphaMap() : null, [collar]);

    useEffect(() => {
        if (nodes.T_Shirt_male) {
            const newMat = new THREE.MeshStandardMaterial({
                map: texture || null,
                color: texture ? 0xffffff : new THREE.Color(color),
                roughness: 0.5,
                metalness: 0.1,
                side: THREE.DoubleSide,
                alphaMap: vNeckAlphaMap,
                transparent: !!vNeckAlphaMap,
                alphaTest: 0.5
            });
            if (texture) {
                texture.flipY = false;
                texture.colorSpace = THREE.SRGBColorSpace;
                newMat.map = texture;
            }
            setMaterial(newMat);
        }
    }, [texture, color, nodes, vNeckAlphaMap]);

    const handleMeshPointerMove = (e) => {
        if (isDraggingAny && selectedLogo && meshRef.current) {
            e.stopPropagation();
            const intersects = e.intersections.filter(i => i.object === meshRef.current);
            if (intersects.length > 0) {
                const point = intersects[0].point;
                const updateFn = selectedLogo === 'team' ? onTeamLogoUpdate : onSponsorLogoUpdate;
                const prevState = selectedLogo === 'team' ? teamLogoState : sponsorLogoState;
                if (updateFn && prevState) {
                    updateFn({ ...prevState, pos: [point.x, point.y, point.z] });
                }
            }
        }
    };

    if (!nodes.T_Shirt_male) return null;

    return (
        <group dispose={null}>
            <mesh
                ref={meshRef}
                castShadow
                receiveShadow
                geometry={nodes.T_Shirt_male.geometry}
                material={material || materials.lambert1}
                onPointerMove={handleMeshPointerMove}
            >
                {teamLogo && teamLogoState && (
                    <MovableDecal
                        position={teamLogoState.pos}
                        rotation={teamLogoState.rot}
                        scale={teamLogoState.scale}
                        textureUrl={teamLogo}
                        isSelected={selectedLogo === 'team'}
                        onSelect={() => onSelectLogo && onSelectLogo('team')}
                        onUpdate={onTeamLogoUpdate}
                        onDelete={() => onTeamLogoUpdate && onTeamLogoUpdate(null)}
                        meshRef={meshRef}
                        onDragChange={onDragChange}
                    />
                )}
                {sponsorLogo && sponsorLogoState && (
                    <MovableDecal
                        position={sponsorLogoState.pos}
                        rotation={sponsorLogoState.rot}
                        scale={sponsorLogoState.scale}
                        textureUrl={sponsorLogo}
                        isSelected={selectedLogo === 'sponsor'}
                        onSelect={() => onSelectLogo && onSelectLogo('sponsor')}
                        onUpdate={onSponsorLogoUpdate}
                        onDelete={() => onSponsorLogoUpdate && onSponsorLogoUpdate(null)}
                        meshRef={meshRef}
                        onDragChange={onDragChange}
                    />
                )}
                {decalTexture && (
                    <Decal
                        position={[0, 0.0, -0.15]}
                        rotation={[0, Math.PI, 0]}
                        scale={[0.45, 0.7, 0.15]}
                        map={decalTexture}
                    >
                        <meshStandardMaterial transparent polygonOffset polygonOffsetFactor={-1} depthWrite={false} roughness={1} map={decalTexture} />
                    </Decal>
                )}
                <Decal
                    position={[0.08, 0.08, 0.15]}
                    rotation={[0, 0, 0]}
                    scale={[0.045, 0.045, 0.2]}
                    map={brandTexture}
                >
                    <meshStandardMaterial
                        transparent
                        polygonOffset
                        polygonOffsetFactor={-20}
                        depthWrite={false}
                        map={brandTexture}
                    />
                </Decal>
            </mesh>
            {collar === 'polo' && <PoloCollar color={accentColor || color} />}
        </group>
    );
};

useGLTF.preload('/shirt_baked.glb');

const Jersey3D = forwardRef((props, ref) => {
    const [texture, setTexture] = useState(null);
    const [decalTexture, setDecalTexture] = useState(null);
    const [isDraggingAny, setIsDraggingAny] = useState(false);
    const containerRef = useRef();
    const controlsRef = useRef();
    const canvasRef = useRef();

    useImperativeHandle(ref, () => ({
        captureViews: async () => {
            const canvas = canvasRef.current;
            const controls = controlsRef.current;
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            if (!canvas || !controls) return null;

            const originalWidth = canvas.width;
            const originalHeight = canvas.height;
            const exportSize = 2048;

            const setSize = (w, h) => {
                canvas.width = w; canvas.height = h;
                canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
                if (gl) gl.viewport(0, 0, w, h);
            };

            const capture = () => new Promise(resolve => {
                requestAnimationFrame(() => { setTimeout(() => resolve(canvas.toDataURL('image/png', 1.0)), 250); });
            });

            const savedWidth = canvas.style.width;
            const savedHeight = canvas.style.height;
            setSize(exportSize, exportSize);

            controls.object.position.set(0, 0, 0.9);
            controls.target.set(0, 0.12, 0);
            controls.update();
            const frontImage = await capture();

            controls.object.position.set(0, 0, -0.9);
            controls.update();
            const backImage = await capture();

            canvas.style.width = savedWidth || '100%';
            canvas.style.height = savedHeight || '100%';
            controls.object.position.set(0, 0, 0.9);
            controls.update();

            return { front: frontImage, back: backImage };
        }
    }));

    useEffect(() => {
        const updateTextures = async () => {
            const mainTex = await generateTextureFromSvg(`.hidden-previews .full-view svg`, false);
            if (mainTex) setTexture(mainTex);
            try { await document.fonts.load(`100px "${props.font}"`); } catch (e) { }
            const decalTex = generateNameNumberTexture(props.name, props.number, props.font, props.colors.textColor || props.colors.secondary, props.colors.primary);
            if (decalTex) setDecalTexture(decalTex);
        };
        const timer = setTimeout(updateTextures, 300);
        return () => clearTimeout(timer);
    }, [props.colors, props.pattern, props.name, props.number, props.font, props.collar]);

    return (
        <div className="jersey-3d-wrapper studio-mode" ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas
                shadows dpr={[1, 2]}
                camera={{ position: [0, 0, 0.9], fov: 45 }}
                gl={{ preserveDrawingBuffer: true }}
                onCreated={({ gl }) => { canvasRef.current = gl.domElement; }}
                onPointerMissed={() => props.onSelectLogo && props.onSelectLogo(null)}
            >
                <ambientLight intensity={0.7} />
                <Environment preset="city" />
                <spotLight position={[0.5, 0.5, 1]} intensity={2} angle={0.5} penumbra={1} castShadow />
                <group position={[0, 0.22, 0]}>
                    <ShirtModel
                        {...props}
                        texture={texture}
                        decalTexture={decalTexture}
                        color={props.colors.primary}
                        accentColor={props.colors.accent}
                        isDraggingAny={isDraggingAny}
                        onDragChange={setIsDraggingAny}
                    />
                </group>
                <OrbitControls
                    ref={controlsRef}
                    target={[0, props.viewLocked ? 0.25 : 0.12, 0]}
                    enablePan={false}
                    enabled={!isDraggingAny}
                    enableZoom={!props.viewLocked}
                    minDistance={props.viewLocked ? 1.1 : 0.5}
                    maxDistance={props.viewLocked ? 1.1 : 3}
                    minPolarAngle={props.viewLocked ? Math.PI / 2 : 0}
                    maxPolarAngle={props.viewLocked ? Math.PI / 2 : Math.PI}
                    makeDefault
                />
                <CameraAdjuster viewLocked={props.viewLocked} controlsRef={controlsRef} />
            </Canvas>
            <div className="hidden-previews" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: 0, left: 0, zIndex: -1 }}>
                <div className="full-view"><JerseyPreview {...props} view="full" /></div>
            </div>
        </div>
    );
});

export default Jersey3D;
