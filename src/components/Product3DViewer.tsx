import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PresentationControls } from '@react-three/drei';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Maximize2, Camera } from 'lucide-react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
const DUMMY_MODEL_URL = "https://res.cloudinary.com/df4kum9dh/image/upload/v1750175561/Ramsebo_Wing_Chair_Glb_rcthto.glb"; // Use a public .glb for AR
useGLTF.preload(DUMMY_MODEL_URL);

// Import model-viewer web component for AR
// @ts-ignore
import '@google/model-viewer';

// Add TypeScript support for <model-viewer>
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        'ar'?: boolean;
        'ar-modes'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'ios-src'?: string;
        alt?: string;
        'shadow-intensity'?: string | number;
        exposure?: string | number;
        style?: React.CSSProperties;
      };
    }
  }
}

function CenteredGLTF({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  // Defensive: if not loaded, render nothing
  if (!scene) return null;

  // Compute bounding box to center and scale the model
  const bbox = new THREE.Box3().setFromObject(scene);
  const size = bbox.getSize(new THREE.Vector3());
  const center = bbox.getCenter(new THREE.Vector3());

  // Desired size in your scene
  const desiredSize = 2.5;
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = desiredSize / maxDim;

  return (
    <group
      scale={[scale, scale, scale]}
      position={[-center.x * scale, -center.y * scale, -center.z * scale]}
    >
      <primitive object={scene} />
    </group>
  );
}

function DummyCube() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.5;
      ref.current.rotation.x += delta * 0.2;
    }
  });
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4f46e5" metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

interface Product3DViewerProps {
  productName: string;
  url?: string; // Add url prop
  className?: string;
}

const Product3DViewer: React.FC<Product3DViewerProps> = ({ productName, url, className }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const controlsRef = useRef<any>();
  const isMobile = useIsMobile();

  // Use the provided url or fallback to dummy
  const modelUrl = url || DUMMY_MODEL_URL;

  // For AR, show <model-viewer> dialog
  const ARContent = () => (
    <div className="w-full flex flex-col items-center">
      <model-viewer
        src={modelUrl}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        style={{ width: '100%', height: '60vh', background: '#f3f4f6', borderRadius: 12 }}
        ios-src={modelUrl}
        alt="3D model"
        shadow-intensity="1"
        exposure="1"
      >
        {/* Fallback for unsupported browsers */}
        <div className="text-center p-4">
          <p>Your browser does not support AR view.</p>
        </div>
      </model-viewer>
      <div className="mt-4 text-center text-muted-foreground text-sm">
        {isMobile
          ? 'Tap the AR icon in the corner to view in your space!'
          : 'Scan the QR code on your mobile device to view in AR.'}
      </div>
    </div>
  );

  const ViewerContent = ({ fullscreen = false }: { fullscreen?: boolean }) => (
    <div className={`relative ${fullscreen ? 'h-[80vh]' : 'h-64 md:h-80'} w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg overflow-hidden`}>
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <CenteredGLTF url={modelUrl} />
          <Environment preset="apartment" />
          <OrbitControls enablePan enableZoom enableRotate />
        </Suspense>
      </Canvas>
      {/* Controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {!fullscreen && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsFullscreen(true)}
            className="bg-white/80 hover:bg-white/90 text-gray-700"
          >
            <Maximize2 size={16} />
          </Button>
        )}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShowAR(true)}
          className="bg-white/80 hover:bg-white/90 text-gray-700"
        >
          <Camera size={16} />
        </Button>
      </div>
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
          {isMobile ? 'Tap and drag to rotate • Pinch to zoom' : 'Click and drag to rotate • Scroll to zoom'}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={className}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
            <Eye className="mr-2" size={20} />
            3D Preview
          </h3>
          <p className="text-sm text-muted-foreground">
            Interact with the 3D model to see {productName} from all angles
          </p>
        </div>
        <ViewerContent />
      </div>
      {/* Fullscreen Dialog */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-5xl h-[90vh] p-6">
          <DialogHeader>
            <DialogTitle>3D View - {productName}</DialogTitle>
          </DialogHeader>
          <ViewerContent fullscreen />
        </DialogContent>
      </Dialog>
      {/* AR Dialog */}
      <Dialog open={showAR} onOpenChange={setShowAR}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AR View - {productName}</DialogTitle>
          </DialogHeader>
          <ARContent />
          <Button onClick={() => setShowAR(false)} className="w-full mt-4">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Product3DViewer;