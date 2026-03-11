import React, { useEffect, useState, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Decal, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import JerseyPreview from './JerseyPreview';
import MovableDecal from './MovableDecal';
import { FONT_OPTIONS, GINGA_LOGOS } from './JerseyDesigner';

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

    // Name size capped at 85% of the original American Captain size (153px max).
    // Positions are fixed as absolute pixels so the gap is always the same regardless of font.
    const nameSize = 153;
    const numberSize = 484; // 440 * 1.1
    const nameY = Math.round(height * 0.26);   // fixed absolute Y for name center
    const numberY = nameY + Math.round(nameSize / 2) + 60 + Math.round(numberSize / 2); // 60px gap between name-bottom and number-top

    const displayName = String(name || '').toUpperCase();
    if (displayName) {
        ctx.font = `900 ${nameSize}px "${font}"`;
        ctx.strokeText(displayName, width / 2, nameY);
        ctx.fillText(displayName, width / 2, nameY);
    }

    const displayNumber = String(number || '');
    if (displayNumber) {
        ctx.font = `900 ${numberSize}px "${font}"`;
        ctx.strokeText(displayNumber, width / 2, numberY, 580);
        ctx.fillText(displayNumber, width / 2, numberY, 580);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
};

const generateCustomTextTexture = (text, fontName, color) => {
    if (!text) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let fontSize = 250;
    if (text.length > 8) fontSize = 200;
    if (text.length > 12) fontSize = 150;

    ctx.font = `900 ${fontSize}px "${fontName}"`;
    ctx.fillText(text, 512, 512);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

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

const getBrandLogoPath = (colorName) => {
    const found = GINGA_LOGOS.find(l => l.name === colorName);
    return found ? found.path : GINGA_LOGOS[0].path;
};

const ShirtModel = ({
    texture, decalTexture, color, collar, accentColor,
    teamLogo, sponsorLogo, teamLogoState, sponsorLogoState,
    onTeamLogoUpdate, onSponsorLogoUpdate, selectedLogo, onSelectLogo,
    isDraggingAny, onDragChange,
    customText, customTextState, onCustomTextUpdate, customTextColor, brandLogoColor,
    teamLogoTex, sponsorLogoTex, customTextTex,
    controlsRef // Pass controlsRef for MovableDecal
}) => {
    const { nodes, materials } = useGLTF('/shirt_baked.glb');
    const [material, setMaterial] = useState(null);
    const meshRef = useRef();

    const brandTexture = useTexture(getBrandLogoPath(brandLogoColor));

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
                let updateFn;
                let prevState;
                if (selectedLogo === 'team') {
                    updateFn = onTeamLogoUpdate;
                    prevState = teamLogoState;
                } else if (selectedLogo === 'sponsor') {
                    updateFn = onSponsorLogoUpdate;
                    prevState = sponsorLogoState;
                } else if (selectedLogo === 'text') {
                    updateFn = onCustomTextUpdate;
                    prevState = customTextState;
                }

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
                {teamLogo && teamLogoState && teamLogoTex && (
                    <MovableDecal
                        texture={teamLogoTex}
                        position={teamLogoState.pos}
                        rotation={teamLogoState.rot}
                        scaleX={teamLogoState.scaleX}
                        scaleY={teamLogoState.scaleY}
                        isSelected={selectedLogo === 'team'}
                        onSelect={() => onSelectLogo && onSelectLogo('team')}
                        onUpdate={onTeamLogoUpdate}
                        onDelete={() => onTeamLogoUpdate && onTeamLogoUpdate(null)}
                        meshRef={meshRef}
                        onDragChange={onDragChange}
                        orbitControlsRef={controlsRef}
                        aspectRatio={teamLogoTex.image.width / teamLogoTex.image.height}
                    />
                )}
                {sponsorLogo && sponsorLogoState && sponsorLogoTex && (
                    <MovableDecal
                        texture={sponsorLogoTex}
                        position={sponsorLogoState?.pos || [0, -0.10, 0.16]}
                        rotation={sponsorLogoState?.rot || Math.PI}
                        scaleX={sponsorLogoState?.scaleX || 0.25}
                        scaleY={sponsorLogoState?.scaleY || 0.25}
                        isSelected={selectedLogo === 'sponsor'}
                        onSelect={() => onSelectLogo && onSelectLogo('sponsor')}
                        onUpdate={onSponsorLogoUpdate}
                        onDelete={() => onSponsorLogoUpdate && onSponsorLogoUpdate(null)}
                        meshRef={meshRef}
                        onDragChange={onDragChange}
                        orbitControlsRef={controlsRef}
                        aspectRatio={sponsorLogoTex.image.width / sponsorLogoTex.image.height}
                    />
                )}
                {customText && customTextState && customTextTex && (
                    <MovableDecal
                        texture={customTextTex}
                        position={customTextState?.pos || [0, -0.05, 0.165]}
                        rotation={customTextState?.rot ?? Math.PI}
                        scaleX={customTextState?.scaleX || 0.12}
                        scaleY={customTextState?.scaleY || 0.12}
                        isSelected={selectedLogo === 'text'}
                        onSelect={() => onSelectLogo && onSelectLogo('text')}
                        onUpdate={onCustomTextUpdate}
                        onDelete={() => onCustomTextUpdate && onCustomTextUpdate(null)}
                        meshRef={meshRef}
                        onDragChange={onDragChange}
                        orbitControlsRef={controlsRef}
                        noFlip={false}
                        aspectRatio={1}
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
                    position={[-0.08, 0.08, 0.15]}
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
    const [teamLogoTex, setTeamLogoTex] = useState(null);
    const [sponsorLogoTex, setSponsorLogoTex] = useState(null);
    const [customTextTex, setCustomTextTex] = useState(null); // New state for custom text texture
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

            const capture = () => new Promise(resolve => {
                requestAnimationFrame(() => { setTimeout(() => resolve(canvas.toDataURL('image/png', 1.0)), 150); });
            });

            // Clean, non-destructive export. Save user's current camera state to restore later.
            const savedPos = controls.object.position.clone();
            const savedTarget = controls.target.clone();

            // Zoom in and center for export. 
            // 0.9 is an ideal distance for the standard web aspect ratio to fill the screen without clipping.
            controls.object.position.set(0, 0, 0.9);
            controls.target.set(0, 0.12, 0);
            controls.update();
            const frontImage = await capture();

            controls.object.position.set(0, 0, -0.9);
            controls.update();
            const backImage = await capture();

            // Restore normal view wrapper parameters
            controls.object.position.copy(savedPos);
            controls.target.copy(savedTarget);
            controls.update();

            return { front: frontImage, back: backImage };
        }
    }));

    // Update textures - use a single ref to track the last update time
    // Watch customText changes
    useEffect(() => {
        if (!props.customText) {
            setCustomTextTex(null);
            return;
        }

        const updateTextTex = async () => {
            try { await document.fonts.load(`100px "${props.font}"`); } catch (e) { }
            const tex = generateCustomTextTexture(props.customText, props.font, props.customTextColor || '#ffffff');
            if (tex) setCustomTextTex(tex);
        };
        updateTextTex();
    }, [props.customText, props.font, props.customTextColor]);

    // Load team logo into a Three.js texture when the base64 data URL changes
    useEffect(() => {
        if (!props.teamLogo) { setTeamLogoTex(null); return; }
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.flipY = false;
            setTeamLogoTex(tex);
        };
        img.src = props.teamLogo;
    }, [props.teamLogo]);

    // Load sponsor logo into a Three.js texture when the base64 data URL changes
    useEffect(() => {
        if (!props.sponsorLogo) { setSponsorLogoTex(null); return; }
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.flipY = false;
            setSponsorLogoTex(tex);
        };
        img.src = props.sponsorLogo;
    }, [props.sponsorLogo]);

    useEffect(() => {
        let isMounted = true;
        let timer;

        const updateTextures = async () => {
            const now = Date.now();
            // If this was triggered rapidly but isn't just a bg change, throttle

            const mainTex = await generateTextureFromSvg(`.hidden-previews .full-view svg`, false);
            if (isMounted && mainTex) setTexture(mainTex);

            try { await document.fonts.load(`100px "${props.font}"`); } catch (e) { }
            const decalTex = generateNameNumberTexture(props.name, props.number, props.font, props.colors.textColor || props.colors.secondary, props.colors.primary);
            if (isMounted && decalTex) setDecalTexture(decalTex);
        };

        // We use a small debounce for everything to prevent double-bakes on load, but short enough that panning feels okay
        timer = setTimeout(updateTextures, 50);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [props.colors, props.pattern, props.name, props.number, props.font, props.collar, props.backgroundImage, props.bgOffset]);

    return (
        <div className={`jersey-3d-wrapper ${props.isMini ? 'mini-mode' : 'studio-mode'}`} ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', pointerEvents: props.isMini ? 'none' : 'auto' }}>
            <Canvas
                shadows={!props.isMini} dpr={props.isMini ? [1, 1.5] : [1, 2]}
                camera={{ position: [0, 0.15, 1.3], fov: 45 }}
                gl={{ preserveDrawingBuffer: true, powerPreference: 'low-power' }}
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
                        teamLogoTex={teamLogoTex}
                        sponsorLogoTex={sponsorLogoTex}
                        customTextTex={customTextTex}
                        controlsRef={controlsRef}
                    />
                </group>
                <OrbitControls
                    ref={controlsRef}
                    target={[0, props.viewLocked ? 0.25 : 0.15, 0]}
                    enablePan={false}
                    enabled={!isDraggingAny && !props.isMini}
                    enableZoom={!props.viewLocked && !props.isMini}
                    minDistance={props.viewLocked ? 1.1 : 0.5}
                    maxDistance={props.viewLocked ? 1.1 : 3}
                    minPolarAngle={props.viewLocked ? Math.PI / 2 : 0}
                    maxPolarAngle={props.viewLocked ? Math.PI / 2 : Math.PI}
                    makeDefault
                />
                <CameraAdjuster viewLocked={props.viewLocked} controlsRef={controlsRef} />
            </Canvas>
            {!props.isMini && (
                <div className="hidden-previews" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', top: 0, left: 0, zIndex: -1 }}>
                    <div className="full-view"><JerseyPreview {...props} view="full" /></div>
                </div>
            )}
        </div>
    );
});

export default Jersey3D;
