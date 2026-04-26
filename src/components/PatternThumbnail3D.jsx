import { useFrame } from '@react-three/fiber';

const ThumbnailShirtModel = ({ color1, color2, pattern, texture }) => {
    const { nodes } = useGLTF('/shirt_baked.glb');
    const groupRef = React.useRef();
    
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = 0.4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    const material = useMemo(() => {
        return new THREE.MeshStandardMaterial({
            map: texture || null,
            color: texture ? 0xffffff : new THREE.Color(color1),
            roughness: 0.6,
            metalness: 0.1,
            side: THREE.FrontSide
        });
    }, [texture, color1]);

    if (!nodes.T_Shirt_male) return null;

    return (
        <group ref={groupRef} scale={1.8} position={[0, -1.2, 0]} rotation={[0.1, 0.4, 0]}>
            <mesh
                geometry={nodes.T_Shirt_male.geometry}
                material={material}
                castShadow
            />
        </group>
    );
};

const PatternThumbnail3D = ({ pattern, color1, color2, trackRef }) => {
    const [texture, setTexture] = useState(null);

    // Capture the 2D SVG pattern as a texture
    useEffect(() => {
        const svgElement = document.querySelector(`#svg-pattern-${pattern}`);
        if (!svgElement) return;

        const generateTexture = async () => {
            const svgString = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 512;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 512, 512);
                const tex = new THREE.CanvasTexture(canvas);
                tex.colorSpace = THREE.SRGBColorSpace;
                setTexture(tex);
                URL.revokeObjectURL(url);
            };
            img.src = url;
        };

        generateTexture();
    }, [pattern, color1, color2]);

    return (
        <View track={trackRef} style={{ width: '100%', height: '100%' }}>
            <ThumbnailShirtModel 
                color1={color1} 
                texture={texture} 
            />
            <Environment preset="city" />
            <ambientLight intensity={1.2} />
            <pointLight position={[5, 10, 10]} intensity={2.5} />
            <pointLight position={[-5, 5, 5]} intensity={1.5} />
            <pointLight position={[0, -5, 5]} intensity={0.5} />
        </View>
    );
};

export default PatternThumbnail3D;
