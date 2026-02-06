import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, useTexture, Decal } from '@react-three/drei';
import * as THREE from 'three';
import JerseyPreview from './JerseyPreview';

const ShirtModel = ({ texture, color, vibrancy }) => {
    // Load the GLB model
    // Ensure the file is in public/shirt_baked.glb
    const { nodes, materials } = useGLTF('/shirt_baked.glb');

    const materialRef = useRef();

    // Apply the dynamic texture to the model
    useEffect(() => {
        if (materials && materials.lambert1) {
            // Clone to avoid side-effects if re-used
            const mat = materials.lambert1.clone();

            // The texture from JerseyPreview (canvas)
            if (texture) {
                texture.flipY = false; // GLTF standard often expects flipped Y for textures driven by code
                mat.map = texture;
                mat.needsUpdate = true;
            } else {
                mat.color = new THREE.Color(color);
            }

            mat.roughness = 0.4;
            mat.metalness = 0.1;

            // Assign back
            materials.lambert1 = mat;
        }
    }, [texture, materials, color]);

    return (
        <group dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.T_Shirt_male.geometry}
                material={materials.lambert1}
            >
                {/* 
                   If we wanted to use Decals instead of full texture wrap:
                   <Decal position={[0, 0.04, 0.15]} rotation={[0, 0, 0]} scale={0.15} map={logoTexture} />
                   But here we are doing a full UV wrap via the texture generated in JerseyPreview.
                */}
            </mesh>
        </group>
    );
};

// Preload to avoid loading delay
useGLTF.preload('/shirt_baked.glb');

const Jersey3D = (props) => {
    const [texture, setTexture] = useState(null);

    // Texture generation logic
    useEffect(() => {
        const updateTexture = async () => {
            const svg = document.querySelector(`.hidden-previews .full-view svg`);
            if (!svg) return;

            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');

            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, 1024, 1024);
                const tex = new THREE.CanvasTexture(canvas);
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.anisotropy = 16;
                tex.flipY = false; // Key for GLTF mapping usually
                setTexture(tex);
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        };

        const timer = setTimeout(updateTexture, 200);
        return () => clearTimeout(timer);
    }, [props.colors, props.pattern, props.name, props.number, props.font, props.teamLogo, props.sponsorLogo, props.brandLogo, props.vibrancy]);

    return (
        <div className="jersey-3d-wrapper studio-mode" style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 0.6], fov: 25 }} gl={{ preserveDrawingBuffer: true }}>
                <ambientLight intensity={0.7} />
                <Environment preset="city" />

                {/* Spotlights for dramatic effect */}
                <spotLight position={[0.5, 0.5, 1]} intensity={2} angle={0.5} penumbra={1} castShadow />

                <group position={[0, -0.4, 0]}>
                    <ShirtModel texture={texture} color={props.colors.primary} />
                </group>

                {/* Controls */}
                <OrbitControls
                    enablePan={false}
                    minDistance={0.4}
                    maxDistance={1.2}
                    makeDefault
                />

                <ContactShadows position={[0, -0.45, 0]} opacity={0.6} scale={10} blur={2} far={1.5} />
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
