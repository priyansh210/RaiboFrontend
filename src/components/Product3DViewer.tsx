
import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PresentationControls } from '@react-three/drei';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Maximize2, RotateCcw, Camera } from 'lucide-react';
import * as THREE from 'three';

// Default 3D model component (using a simple chair model)
function Chair(props: any) {
  const chairRef = useRef<THREE.Group>(null);
  
  // Auto-rotate the chair
  useFrame((state, delta) => {
    if (chairRef.current && !props.controlsRef?.current?.getPointerLock()) {
      chairRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={chairRef} {...props}>
      {/* Simple chair geometry */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Chair back */}
      <mesh position={[0, 1, -0.4]}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Chair legs */}
      {[[-0.4, 0, -0.4], [0.4, 0, -0.4], [-0.4, 0, 0.4], [0.4, 0, 0.4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
      ))}
    </group>
  );
}

interface Product3DViewerProps {
  productName: string;
  className?: string;
}

const Product3DViewer: React.FC<Product3DViewerProps> = ({ productName, className }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showARMessage, setShowARMessage] = useState(false);
  const controlsRef = useRef<any>();
  const isMobile = useIsMobile();

  const handleARView = () => {
    if ('xr' in navigator) {
      // Check if WebXR is supported
      setShowARMessage(true);
    } else {
      setShowARMessage(true);
    }
  };

  const ViewerContent = ({ fullscreen = false }) => (
    <div className={`relative ${fullscreen ? 'h-[80vh]' : 'h-64 md:h-80'} w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg overflow-hidden`}>
      <Canvas
        camera={{ position: [2, 2, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />
          
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <Chair scale={fullscreen ? 1.2 : 1} controlsRef={controlsRef} />
          </PresentationControls>
          
          <Environment preset="apartment" />
          
          <OrbitControls
            ref={controlsRef}
            enablePan={fullscreen}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 1.5}
            minDistance={2}
            maxDistance={8}
          />
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
          onClick={handleARView}
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

      {/* AR Message Dialog */}
      <Dialog open={showARMessage} onOpenChange={setShowARMessage}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>AR View</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              AR viewing is coming soon! For now, you can use the 3D preview to explore the product from all angles.
            </p>
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Tip:</strong> For the best AR experience, we recommend using a device with ARCore (Android) or ARKit (iOS) support.
              </p>
            </div>
            <Button onClick={() => setShowARMessage(false)} className="w-full">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Product3DViewer;
