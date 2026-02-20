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
            const direction = new THREE.Vector3().subVectors(camera.position, target).normalize();
            const newPos = target.clone().add(direction.multiplyScalar(0.25));
            camera.position.copy(newPos);
            controls.update();
        }
    }, [viewLocked, controlsRef]);
    return null;
};

const generateNameNumberTexture = (name, number, font, color) => {
    const canvas = document.createElement('canvas');
    const width = 1024;
    const height = 1536;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
    ctx.shadowBlur = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

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

const ShirtModel = ({
    texture, decalTexture, color, collar, accentColor,
    teamLogo, sponsorLogo, teamLogoState, sponsorLogoState,
    onTeamLogoUpdate, onSponsorLogoUpdate, selectedLogo, onSelectLogo,
    isDraggingAny, onDragChange
}) => {
    const { nodes, materials } = useGLTF('/shirt_baked.glb');
    const [material, setMaterial] = useState(null);
    const meshRef = useRef();
    const gingaTexture = useTexture('/ginga-green.png');

    // Setup ginga texture once loaded
    useEffect(() => {
        if (gingaTexture) {
            gingaTexture.colorSpace = THREE.SRGBColorSpace;
            gingaTexture.anisotropy = 16;
            gingaTexture.minFilter = THREE.LinearFilter;
            gingaTexture.magFilter = THREE.LinearFilter;
            gingaTexture.flipY = false;
        }
    }, [gingaTexture]);

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
                    position={[0.06, 0.08, 0.15]}
                    rotation={[0, 0, 0]}
                    scale={[0.06, 0.06, 0.2]}
                    map={gingaTexture}
                >
                    <meshStandardMaterial
                        transparent
                        polygonOffset
                        polygonOffsetFactor={-20}
                        depthWrite={false}
                        map={gingaTexture}
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
            const decalTex = generateNameNumberTexture(props.name, props.number, props.font, props.colors.secondary);
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
                    target={[0, 0.12, 0]}
                    enablePan={false}
                    enabled={!isDraggingAny}
                    enableZoom={!props.viewLocked}
                    minDistance={props.viewLocked ? 0.85 : 0.5}
                    maxDistance={props.viewLocked ? 0.85 : 3}
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
