import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SolidDefinition, SolidId } from '../types/geometry';
import { sounds } from '../utils/audio';
import {
  Play,
  Pause,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Sparkles,
  Tag,
  CheckCircle2,
} from 'lucide-react';

interface Solid3DViewerProps {
  solid: SolidDefinition;
  dimensions: Record<string, number>;
}

export const Solid3DViewer: React.FC<Solid3DViewerProps> = ({ solid, dimensions }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [foldProgress, setFoldProgress] = useState<number>(0.0); // 0 = flat net, 1 = fully folded solid
  const [isAutoFolding, setIsAutoFolding] = useState<boolean>(false);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [showWireframe, setShowWireframe] = useState<boolean>(false);
  const [showMeasurementsOnNet, setShowMeasurementsOnNet] = useState<boolean>(true);
  const [showVertices, setShowVertices] = useState<boolean>(true);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const foldAnimationRef = useRef<number | null>(null);
  const animDirectionRef = useRef<number>(1);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 600;
    const height = mountRef.current.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // dark slate background for maximum contrast
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    // Adjusted initial camera angle to look clearly onto the flat net
    camera.position.set(0, 16, 20);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(12, 24, 18);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.6);
    dirLight2.position.set(-15, 8, -15);
    scene.add(dirLight2);

    const dirLightBottom = new THREE.DirectionalLight(0x818cf8, 0.4);
    dirLightBottom.position.set(0, -10, 0);
    scene.add(dirLightBottom);

    // Floor Grid Helper (at Y = -3.8)
    const gridHelper = new THREE.GridHelper(28, 28, 0x334155, 0x1e293b);
    gridHelper.position.y = -3.5;
    scene.add(gridHelper);

    // Root Group for Foldable Solid
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    rootGroupRef.current = rootGroup;

    // Orbit Drag Controls
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    const dom = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !rootGroupRef.current) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      rootGroupRef.current.rotation.y += deltaX * 0.007;
      rootGroupRef.current.rotation.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, rootGroupRef.current.rotation.x + deltaY * 0.007)
      );

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch controls
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || !rootGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;

      rootGroupRef.current.rotation.y += deltaX * 0.009;
      rootGroupRef.current.rotation.x = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, rootGroupRef.current.rotation.x + deltaY * 0.009)
      );

      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    // Wheel zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const zoomFactor = e.deltaY * 0.015;
      cameraRef.current.position.z = Math.min(Math.max(cameraRef.current.position.z + zoomFactor, 7), 40);
      cameraRef.current.position.y = Math.min(Math.max(cameraRef.current.position.y + zoomFactor * 0.6, 3), 28);
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Handle Window Resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      if (rootGroupRef.current && isAutoRotating && !isDragging) {
        rootGroupRef.current.rotation.y += 0.005;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [solid.id, isAutoRotating]);

  // Re-build 3D Foldable Mesh hierarchy
  useEffect(() => {
    if (!rootGroupRef.current) return;
    const root = rootGroupRef.current;

    while (root.children.length > 0) {
      const obj = root.children[0];
      root.remove(obj);
    }

    buildPreciseFoldableSolid(
      solid.id,
      root,
      dimensions,
      foldProgress,
      showWireframe,
      showVertices,
      showMeasurementsOnNet,
      solid.color
    );
  }, [solid.id, dimensions, showWireframe, showVertices, showMeasurementsOnNet]);

  // Apply smooth folding whenever foldProgress changes
  useEffect(() => {
    if (!rootGroupRef.current) return;
    updatePreciseFolding(solid.id, rootGroupRef.current, dimensions, foldProgress);
  }, [foldProgress, solid.id, dimensions]);

  // Auto folding loop
  useEffect(() => {
    if (!isAutoFolding) {
      if (foldAnimationRef.current) {
        cancelAnimationFrame(foldAnimationRef.current);
      }
      return;
    }

    let lastTime = performance.now();
    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setFoldProgress((prev) => {
        let next = prev + animDirectionRef.current * dt * 0.45;
        if (next >= 1) {
          next = 1;
          animDirectionRef.current = -1;
          sounds.playFoldStep();
        } else if (next <= 0.0) {
          next = 0.0;
          animDirectionRef.current = 1;
          sounds.playFoldStep();
        }
        return next;
      });

      foldAnimationRef.current = requestAnimationFrame(loop);
    };

    foldAnimationRef.current = requestAnimationFrame(loop);
    return () => {
      if (foldAnimationRef.current) cancelAnimationFrame(foldAnimationRef.current);
    };
  }, [isAutoFolding]);

  // View Helpers
  const handleZoom = (inOut: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const dir = inOut === 'in' ? -3 : 3;
    cameraRef.current.position.z = Math.min(Math.max(cameraRef.current.position.z + dir, 7), 40);
    cameraRef.current.position.y = Math.min(Math.max(cameraRef.current.position.y + dir * 0.6, 3), 28);
    sounds.playPop();
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !rootGroupRef.current) return;
    cameraRef.current.position.set(0, 16, 20);
    cameraRef.current.lookAt(0, 0, 0);
    rootGroupRef.current.rotation.set(0, 0, 0);
    sounds.playPop();
  };

  return (
    <div className="relative w-full h-[540px] rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-1.5 shadow-2xl border border-slate-700/60 overflow-hidden flex flex-col">
      {/* 3D Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden relative"
      />

      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        {/* Solid Badge & Precise Folding Mode */}
        <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/80 text-white shadow-xl">
          <span className="w-3 h-3 rounded-full animate-pulse shadow-md" style={{ backgroundColor: solid.color }} />
          <div className="flex flex-col">
            <span className="font-black text-sm tracking-wide">{solid.nameArabic}</span>
            <span className="text-[11px] text-amber-400 font-bold">
              {foldProgress === 0
                ? 'شبكة منبسطة 100% (أوجه في نفس الاتجاه)'
                : foldProgress >= 0.99
                ? 'مجسم ثلاثي الأبعاد مغلق بإحكام تام'
                : `طي دقيق: ${Math.round(foldProgress * 100)}%`}
            </span>
          </div>
        </div>

        {/* View Options Tools */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 text-slate-300 shadow-xl">
          {/* Toggle Measurements on 3D Net */}
          <button
            onClick={() => {
              setShowMeasurementsOnNet(!showMeasurementsOnNet);
              sounds.playPop();
            }}
            title={showMeasurementsOnNet ? 'إخفاء المقاسات في شبكة الطي' : 'إظهار المقاسات في شبكة الطي'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              showMeasurementsOnNet
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">مقاسات الشبكة</span>
          </button>

          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            title={isAutoRotating ? 'إيقاف الدوران' : 'دوران تلقائي'}
            className={`p-2 rounded-xl transition-all ${
              isAutoRotating ? 'bg-indigo-600 text-white shadow' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <RotateCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>

          <button
            onClick={() => setShowWireframe(!showWireframe)}
            title="الهيكل الشبكي"
            className={`p-2 rounded-xl transition-all ${
              showWireframe ? 'bg-indigo-600 text-white shadow' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowVertices(!showVertices)}
            title="إظهار الرؤوس"
            className={`p-2 rounded-xl transition-all ${
              showVertices ? 'bg-indigo-600 text-white shadow' : 'hover:bg-slate-800 text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-slate-700 mx-0.5" />

          <button
            onClick={() => handleZoom('in')}
            title="تكبير"
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            title="تصغير"
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetCamera}
            title="إعادة ضبط الرؤية"
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Fold / Unfold Controller at Bottom */}
      <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
        {/* Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => {
              setIsAutoFolding(!isAutoFolding);
              sounds.playPop();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all ${
              isAutoFolding
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isAutoFolding ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>إيقاف الحركة</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>طي وبسط تدريجي</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setFoldProgress(0);
              setIsAutoFolding(false);
              sounds.playFoldStep();
            }}
            className={`px-3 py-2 text-xs font-bold rounded-xl border border-slate-700 transition-all ${
              foldProgress === 0
                ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            بسط الشبكة (0%)
          </button>

          <button
            onClick={() => {
              setFoldProgress(1);
              setIsAutoFolding(false);
              sounds.playFoldStep();
            }}
            className={`px-3 py-2 text-xs font-bold rounded-xl border border-slate-700 transition-all ${
              foldProgress === 1
                ? 'bg-indigo-600 text-white font-black border-indigo-500 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            إغلاق المجسم (100%)
          </button>
        </div>

        {/* High Precision Fold Range Slider */}
        <div className="flex items-center gap-3 w-full sm:max-w-md">
          <span className="text-[11px] text-amber-400 whitespace-nowrap font-bold">شبكة مفرودة</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.005"
            value={foldProgress}
            onChange={(e) => {
              setIsAutoFolding(false);
              setFoldProgress(parseFloat(e.target.value));
            }}
            className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <span className="text-[11px] text-indigo-400 whitespace-nowrap font-bold">مجسم مغلق</span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// PRECISE HINGE HIERARCHY, ALIGNED FACE NORMALS, AND 3D MEASUREMENT BADGES
// =========================================================================

/**
 * Creates high-contrast 3D Sprite with exact edge dimension labels
 * attached directly to the folding faces so they move and fold with the solid!
 */
function createMeasurementBadgeSprite(text: string, subText?: string, bgColor = '#0f172a', borderColor = '#f59e0b'): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 76;
  const ctx = canvas.getContext('2d')!;

  // Background pill with border
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(6, 6, 244, 64, 16);
  ctx.fill();

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Arabic measurement text
  ctx.font = 'bold 26px Cairo, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, subText ? 28 : 38);

  if (subText) {
    ctx.font = 'bold 17px Cairo, sans-serif';
    ctx.fillStyle = borderColor;
    ctx.fillText(subText, 128, 52);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({
    map: texture,
    depthTest: false,
    transparent: true,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(2.4, 0.75, 1);
  return sprite;
}

function createFaceMesh(
  geometry: THREE.BufferGeometry,
  colorHex: string,
  wireframe: boolean,
  border = true
): THREE.Group {
  const group = new THREE.Group();

  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorHex),
    roughness: 0.25,
    metalness: 0.1,
    wireframe: wireframe,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.92,
  });

  const mesh = new THREE.Mesh(geometry, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  if (border && !wireframe) {
    const edgesGeom = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    const line = new THREE.LineSegments(edgesGeom, lineMat);
    group.add(line);
  }

  return group;
}

function createVertexMarker(x: number, y: number, z: number, color = 0xf59e0b): THREE.Mesh {
  const geom = new THREE.SphereGeometry(0.12, 16, 16);
  const mat = new THREE.MeshBasicMaterial({ color: color });
  const sphere = new THREE.Mesh(geom, mat);
  sphere.position.set(x, y, z);
  return sphere;
}

/**
 * Builds the exact mathematical folding structure with:
 * 1. Consistent orientation: all faces in flat net (fold=0) lie exactly on Y = 0 pointing upwards.
 * 2. Exact mathematical closure: at fold=1, all edges join seamlessly without any overlap or gap.
 * 3. 3D measurement badges parented to the folding faces so they move dynamically!
 */
function buildPreciseFoldableSolid(
  id: SolidId,
  root: THREE.Group,
  dims: Record<string, number>,
  fold: number,
  wireframe: boolean,
  showVertices: boolean,
  showMeas: boolean,
  themeColor: string
) {
  const scale = 0.9;
  const baseColor = '#eab308'; // Amber for bases
  const faceColor = themeColor; // Solid primary color for lateral faces

  switch (id) {
    case 'cube': {
      const s = (dims.side || 5) * scale;
      const rawS = dims.side || 5;
      const halfS = s / 2;

      // 1. Central Base Face (Square s x s, lies on Y=0, X from -halfS to halfS, Z from -halfS to halfS)
      const baseGeom = new THREE.PlaneGeometry(s, s);
      baseGeom.rotateX(-Math.PI / 2);
      const baseGroup = createFaceMesh(baseGeom, baseColor, wireframe);
      root.add(baseGroup);

      if (showMeas) {
        const badge = createMeasurementBadgeSprite(`ضلع = ${rawS} سم`, 'القاعدة السفلية');
        badge.position.set(0, 0.1, 0);
        baseGroup.add(badge);
      }

      // 2. Front Face Hinge (hinged at Z = +halfS)
      // When flat (fold=0), lies from Z = halfS to Z = 3*halfS.
      const hingeFront = new THREE.Group();
      hingeFront.position.set(0, 0, halfS);
      hingeFront.name = 'hinge_front';

      const frontGeom = new THREE.PlaneGeometry(s, s);
      frontGeom.rotateX(-Math.PI / 2);
      frontGeom.translate(0, 0, halfS);
      const frontGroup = createFaceMesh(frontGeom, faceColor, wireframe);
      hingeFront.add(frontGroup);

      if (showMeas) {
        const bFront = createMeasurementBadgeSprite(`${rawS} سم`, 'وجه أمامي');
        bFront.position.set(0, 0.1, halfS);
        frontGroup.add(bFront);
      }
      root.add(hingeFront);

      // 3. Back Face Hinge (hinged at Z = -halfS)
      // When flat (fold=0), lies from Z = -halfS to Z = -3*halfS.
      const hingeBack = new THREE.Group();
      hingeBack.position.set(0, 0, -halfS);
      hingeBack.name = 'hinge_back';

      const backGeom = new THREE.PlaneGeometry(s, s);
      backGeom.rotateX(-Math.PI / 2);
      backGeom.translate(0, 0, -halfS);
      const backGroup = createFaceMesh(backGeom, faceColor, wireframe);
      hingeBack.add(backGroup);

      if (showMeas) {
        const bBack = createMeasurementBadgeSprite(`${rawS} سم`, 'وجه خلفي');
        bBack.position.set(0, 0.1, -halfS);
        backGroup.add(bBack);
      }

      // 4. Top Face Hinge (attached to the distal edge of Back Face at Z = -s relative to back hinge)
      // When flat (fold=0), lies from Z = -3*halfS to Z = -5*halfS in the exact same orientation.
      // When folded (fold=1), back face folds 90° up, and top face folds another 90° to cap the cube top at Y = s!
      const hingeTop = new THREE.Group();
      hingeTop.position.set(0, 0, -s);
      hingeTop.name = 'hinge_top';

      const topGeom = new THREE.PlaneGeometry(s, s);
      topGeom.rotateX(-Math.PI / 2);
      topGeom.translate(0, 0, -halfS);
      const topGroup = createFaceMesh(topGeom, baseColor, wireframe);
      hingeTop.add(topGroup);

      if (showMeas) {
        const bTop = createMeasurementBadgeSprite(`ضلع = ${rawS} سم`, 'القاعدة العلوية');
        bTop.position.set(0, 0.1, -halfS);
        topGroup.add(bTop);
      }
      hingeBack.add(hingeTop);
      root.add(hingeBack);

      // 5. Right Face Hinge (hinged at X = +halfS)
      // When flat, extends from X = halfS to X = 3*halfS.
      const hingeRight = new THREE.Group();
      hingeRight.position.set(halfS, 0, 0);
      hingeRight.name = 'hinge_right';

      const rightGeom = new THREE.PlaneGeometry(s, s);
      rightGeom.rotateX(-Math.PI / 2);
      rightGeom.translate(halfS, 0, 0);
      const rightGroup = createFaceMesh(rightGeom, faceColor, wireframe);
      hingeRight.add(rightGroup);

      if (showMeas) {
        const bRight = createMeasurementBadgeSprite(`${rawS} سم`, 'وجه أيمن');
        bRight.position.set(halfS, 0.1, 0);
        rightGroup.add(bRight);
      }
      root.add(hingeRight);

      // 6. Left Face Hinge (hinged at X = -halfS)
      // When flat, extends from X = -halfS to X = -3*halfS.
      const hingeLeft = new THREE.Group();
      hingeLeft.position.set(-halfS, 0, 0);
      hingeLeft.name = 'hinge_left';

      const leftGeom = new THREE.PlaneGeometry(s, s);
      leftGeom.rotateX(-Math.PI / 2);
      leftGeom.translate(-halfS, 0, 0);
      const leftGroup = createFaceMesh(leftGeom, faceColor, wireframe);
      hingeLeft.add(leftGroup);

      if (showMeas) {
        const bLeft = createMeasurementBadgeSprite(`${rawS} سم`, 'وجه أيسر');
        bLeft.position.set(-halfS, 0.1, 0);
        leftGroup.add(bLeft);
      }
      root.add(hingeLeft);

      if (showVertices) {
        root.add(createVertexMarker(halfS, 0, halfS));
        root.add(createVertexMarker(-halfS, 0, halfS));
        root.add(createVertexMarker(halfS, 0, -halfS));
        root.add(createVertexMarker(-halfS, 0, -halfS));
      }
      break;
    }

    case 'cuboid': {
      const L = (dims.length || 6) * scale;
      const W = (dims.width || 4) * scale;
      const H = (dims.height || 3) * scale;
      const rawL = dims.length || 6;
      const rawW = dims.width || 4;
      const rawH = dims.height || 3;
      const halfL = L / 2;
      const halfW = W / 2;

      // Bottom Base Face (L x W) in XZ plane
      const baseGeom = new THREE.PlaneGeometry(L, W);
      baseGeom.rotateX(-Math.PI / 2);
      const baseGroup = createFaceMesh(baseGeom, baseColor, wireframe);
      root.add(baseGroup);

      if (showMeas) {
        const b = createMeasurementBadgeSprite(`${rawL} × ${rawW} سم`, 'القاعدة السفلية');
        b.position.set(0, 0.1, 0);
        baseGroup.add(b);
      }

      // Front Face (L x H) hinged at Z = +halfW
      const hingeFront = new THREE.Group();
      hingeFront.position.set(0, 0, halfW);
      hingeFront.name = 'hinge_front';

      const frontGeom = new THREE.PlaneGeometry(L, H);
      frontGeom.rotateX(-Math.PI / 2);
      frontGeom.translate(0, 0, H / 2);
      const frontGroup = createFaceMesh(frontGeom, faceColor, wireframe);
      hingeFront.add(frontGroup);

      if (showMeas) {
        const b = createMeasurementBadgeSprite(`${rawL} × ${rawH} سم`, 'الوجه الأمامي');
        b.position.set(0, 0.1, H / 2);
        frontGroup.add(b);
      }
      root.add(hingeFront);

      // Back Face (L x H) hinged at Z = -halfW
      const hingeBack = new THREE.Group();
      hingeBack.position.set(0, 0, -halfW);
      hingeBack.name = 'hinge_back';

      const backGeom = new THREE.PlaneGeometry(L, H);
      backGeom.rotateX(-Math.PI / 2);
      backGeom.translate(0, 0, -H / 2);
      const backGroup = createFaceMesh(backGeom, faceColor, wireframe);
      hingeBack.add(backGroup);

      if (showMeas) {
        const b = createMeasurementBadgeSprite(`${rawL} × ${rawH} سم`, 'الوجه الخلفي');
        b.position.set(0, 0.1, -H / 2);
        backGroup.add(b);
      }

      // Top Base Face (L x W) attached to the distal edge of Back Face at Z = -H
      const hingeTop = new THREE.Group();
      hingeTop.position.set(0, 0, -H);
      hingeTop.name = 'hinge_top';

      const topGeom = new THREE.PlaneGeometry(L, W);
      topGeom.rotateX(-Math.PI / 2);
      topGeom.translate(0, 0, -halfW);
      const topGroup = createFaceMesh(topGeom, baseColor, wireframe);
      hingeTop.add(topGroup);

      if (showMeas) {
        const b = createMeasurementBadgeSprite(`${rawL} × ${rawW} سم`, 'القاعدة العلوية');
        b.position.set(0, 0.1, -halfW);
        topGroup.add(b);
      }
      hingeBack.add(hingeTop);
      root.add(hingeBack);

      // Right Face (H x W) hinged at X = +halfL
      const hingeRight = new THREE.Group();
      hingeRight.position.set(halfL, 0, 0);
      hingeRight.name = 'hinge_right';

      const rightGeom = new THREE.PlaneGeometry(H, W);
      rightGeom.rotateX(-Math.PI / 2);
      rightGeom.translate(H / 2, 0, 0);
      const rightGroup = createFaceMesh(rightGeom, faceColor, wireframe);
      hingeRight.add(rightGroup);

      if (showMeas) {
        const b = createMeasurementBadgeSprite(`${rawW} × ${rawH} سم`, 'وجه أيمن');
        b.position.set(H / 2, 0.1, 0);
        rightGroup.add(b);
      }
      root.add(hingeRight);

      // Left Face (H x W) hinged at X = -halfL
      const hingeLeft = new THREE.Group();
      hingeLeft.position.set(-halfL, 0, 0);
      hingeLeft.name = 'hinge_left';

      const leftGeom = new THREE.PlaneGeometry(H, W);
      leftGeom.rotateX(-Math.PI / 2);
      leftGeom.translate(-H / 2, 0, 0);
      const leftGroup = createFaceMesh(leftGeom, faceColor, wireframe);
      hingeLeft.add(leftGroup);

      if (showMeas) {
        const b = createMeasurementBadgeSprite(`${rawW} × ${rawH} سم`, 'وجه أيسر');
        b.position.set(-H / 2, 0.1, 0);
        leftGroup.add(b);
      }
      root.add(hingeLeft);
      break;
    }

    case 'square_pyramid': {
      const b = (dims.base || 5) * scale;
      const s = (dims.slantHeight || 6) * scale;
      const rawB = dims.base || 5;
      const rawS = dims.slantHeight || 6;
      const halfB = b / 2;

      // Base square in XZ plane
      const baseGeom = new THREE.PlaneGeometry(b, b);
      baseGeom.rotateX(-Math.PI / 2);
      const baseGroup = createFaceMesh(baseGeom, baseColor, wireframe);
      root.add(baseGroup);

      if (showMeas) {
        const badge = createMeasurementBadgeSprite(`قاعدة = ${rawB}×${rawB} سم`);
        badge.position.set(0, 0.1, 0);
        baseGroup.add(badge);
      }

      // Triangular Face Geometry: base along X from -halfB to halfB, apex at (0, 0, s)
      const createTriGeom = () => {
        const geom = new THREE.BufferGeometry();
        const verts = new Float32Array([
          -halfB, 0, 0,
          halfB, 0, 0,
          0, 0, s,
        ]);
        geom.setAttribute('position', new THREE.BufferAttribute(verts, 3));
        geom.computeVertexNormals();
        return geom;
      };

      // 4 Hinge groups with identical outward orientation
      // 1. Front (Z = +halfB)
      const hingeFront = new THREE.Group();
      hingeFront.position.set(0, 0, halfB);
      hingeFront.name = 'hinge_front';
      const triFront = createFaceMesh(createTriGeom(), faceColor, wireframe);
      hingeFront.add(triFront);
      if (showMeas) {
        const badge = createMeasurementBadgeSprite(`مائل = ${rawS} سم`, `قاعدة = ${rawB} سم`);
        badge.position.set(0, 0.1, s / 2);
        triFront.add(badge);
      }
      root.add(hingeFront);

      // 2. Back (Z = -halfB)
      const hingeBack = new THREE.Group();
      hingeBack.position.set(0, 0, -halfB);
      hingeBack.rotation.y = Math.PI;
      hingeBack.name = 'hinge_back';
      const triBack = createFaceMesh(createTriGeom(), faceColor, wireframe);
      hingeBack.add(triBack);
      if (showMeas) {
        const badge = createMeasurementBadgeSprite(`مائل = ${rawS} سم`, `قاعدة = ${rawB} سم`);
        badge.position.set(0, 0.1, s / 2);
        triBack.add(badge);
      }
      root.add(hingeBack);

      // 3. Right (X = +halfB)
      const hingeRight = new THREE.Group();
      hingeRight.position.set(halfB, 0, 0);
      hingeRight.rotation.y = -Math.PI / 2;
      hingeRight.name = 'hinge_right';
      const triRight = createFaceMesh(createTriGeom(), faceColor, wireframe);
      hingeRight.add(triRight);
      if (showMeas) {
        const badge = createMeasurementBadgeSprite(`مائل = ${rawS} سم`, `قاعدة = ${rawB} سم`);
        badge.position.set(0, 0.1, s / 2);
        triRight.add(badge);
      }
      root.add(hingeRight);

      // 4. Left (X = -halfB)
      const hingeLeft = new THREE.Group();
      hingeLeft.position.set(-halfB, 0, 0);
      hingeLeft.rotation.y = Math.PI / 2;
      hingeLeft.name = 'hinge_left';
      const triLeft = createFaceMesh(createTriGeom(), faceColor, wireframe);
      hingeLeft.add(triLeft);
      if (showMeas) {
        const badge = createMeasurementBadgeSprite(`مائل = ${rawS} سم`, `قاعدة = ${rawB} سم`);
        badge.position.set(0, 0.1, s / 2);
        triLeft.add(badge);
      }
      root.add(hingeLeft);
      break;
    }

    case 'triangular_prism': {
      const a = (dims.sideA || 4) * scale;
      const H = (dims.prismHeight || 7) * scale;
      const ht = (dims.heightTri || 3.5) * scale;
      const rawA = dims.sideA || 4;
      const rawH = dims.prismHeight || 7;
      const halfA = a / 2;
      const halfH = H / 2;

      // Base rectangle in XZ plane
      const baseGeom = new THREE.PlaneGeometry(a, H);
      baseGeom.rotateX(-Math.PI / 2);
      const baseGroup = createFaceMesh(baseGeom, baseColor, wireframe);
      root.add(baseGroup);

      if (showMeas) {
        const b = createMeasurementBadgeSprite(`${rawA} × ${rawH} سم`, 'قاعدة المنشور');
        b.position.set(0, 0.1, 0);
        baseGroup.add(b);
      }

      // Front triangular base attached at Z = +halfH
      const hingeTriFront = new THREE.Group();
      hingeTriFront.position.set(0, 0, halfH);
      hingeTriFront.name = 'hinge_tri_front';

      const triGeom1 = new THREE.BufferGeometry();
      const triVerts1 = new Float32Array([
        -halfA, 0, 0,
        halfA, 0, 0,
        0, 0, ht,
      ]);
      triGeom1.setAttribute('position', new THREE.BufferAttribute(triVerts1, 3));
      triGeom1.computeVertexNormals();
      const triMesh1 = createFaceMesh(triGeom1, baseColor, wireframe);
      hingeTriFront.add(triMesh1);

      if (showMeas) {
        const b = createMeasurementBadgeSprite(`ضلع = ${rawA} سم`, 'مثلث أمامي');
        b.position.set(0, 0.1, ht / 2);
        triMesh1.add(b);
      }
      root.add(hingeTriFront);

      // Back triangular base attached at Z = -halfH
      const hingeTriBack = new THREE.Group();
      hingeTriBack.position.set(0, 0, -halfH);
      hingeTriBack.rotation.y = Math.PI;
      hingeTriBack.name = 'hinge_tri_back';

      const triGeom2 = new THREE.BufferGeometry();
      const triVerts2 = new Float32Array([
        -halfA, 0, 0,
        halfA, 0, 0,
        0, 0, ht,
      ]);
      triGeom2.setAttribute('position', new THREE.BufferAttribute(triVerts2, 3));
      triGeom2.computeVertexNormals();
      const triMesh2 = createFaceMesh(triGeom2, baseColor, wireframe);
      hingeTriBack.add(triMesh2);

      if (showMeas) {
        const b = createMeasurementBadgeSprite(`ضلع = ${rawA} سم`, 'مثلث خلفي');
        b.position.set(0, 0.1, ht / 2);
        triMesh2.add(b);
      }
      root.add(hingeTriBack);

      // Right lateral rectangle attached at X = +halfA
      const hingeRight = new THREE.Group();
      hingeRight.position.set(halfA, 0, 0);
      hingeRight.name = 'hinge_right';
      const rightGeom = new THREE.PlaneGeometry(a, H);
      rightGeom.rotateX(-Math.PI / 2);
      rightGeom.translate(halfA, 0, 0);
      const rightGroup = createFaceMesh(rightGeom, faceColor, wireframe);
      hingeRight.add(rightGroup);

      if (showMeas) {
        const b = createMeasurementBadgeSprite(`${rawA} × ${rawH} سم`, 'وجه جانبي');
        b.position.set(halfA, 0.1, 0);
        rightGroup.add(b);
      }
      root.add(hingeRight);

      // Left lateral rectangle attached at X = -halfA
      const hingeLeft = new THREE.Group();
      hingeLeft.position.set(-halfA, 0, 0);
      hingeLeft.name = 'hinge_left';
      const leftGeom = new THREE.PlaneGeometry(a, H);
      leftGeom.rotateX(-Math.PI / 2);
      leftGeom.translate(-halfA, 0, 0);
      const leftGroup = createFaceMesh(leftGeom, faceColor, wireframe);
      hingeLeft.add(leftGroup);

      if (showMeas) {
        const b = createMeasurementBadgeSprite(`${rawA} × ${rawH} سم`, 'وجه جانبي');
        b.position.set(-halfA, 0.1, 0);
        leftGroup.add(b);
      }
      root.add(hingeLeft);
      break;
    }

    case 'tetrahedron': {
      const a = (dims.side || 5) * scale;
      const rawA = dims.side || 5;
      const hTri = (Math.sqrt(3) / 2) * a;

      // Central base equilateral triangle in XZ plane
      const baseGeom = new THREE.BufferGeometry();
      const baseVerts = new Float32Array([
        -a / 2, 0, -hTri / 3,
        a / 2, 0, -hTri / 3,
        0, 0, (2 * hTri) / 3,
      ]);
      baseGeom.setAttribute('position', new THREE.BufferAttribute(baseVerts, 3));
      baseGeom.computeVertexNormals();
      const baseGroup = createFaceMesh(baseGeom, baseColor, wireframe);
      root.add(baseGroup);

      if (showMeas) {
        const b = createMeasurementBadgeSprite(`ضلع = ${rawA} سم`, 'قاعدة ثلاثية');
        b.position.set(0, 0.1, 0);
        baseGroup.add(b);
      }

      const createEquilateralFace = () => {
        const geom = new THREE.BufferGeometry();
        const verts = new Float32Array([
          -a / 2, 0, 0,
          a / 2, 0, 0,
          0, 0, hTri,
        ]);
        geom.setAttribute('position', new THREE.BufferAttribute(verts, 3));
        geom.computeVertexNormals();
        return geom;
      };

      // 3 adjacent folding triangles around the 3 edges
      const hinge1 = new THREE.Group();
      hinge1.position.set(0, 0, -hTri / 3);
      hinge1.rotation.y = Math.PI;
      hinge1.name = 'tetra_hinge_1';
      hinge1.add(createFaceMesh(createEquilateralFace(), faceColor, wireframe));
      root.add(hinge1);

      const hinge2 = new THREE.Group();
      hinge2.position.set(a / 4, 0, hTri / 6);
      hinge2.rotation.y = -Math.PI / 3;
      hinge2.name = 'tetra_hinge_2';
      hinge2.add(createFaceMesh(createEquilateralFace(), faceColor, wireframe));
      root.add(hinge2);

      const hinge3 = new THREE.Group();
      hinge3.position.set(-a / 4, 0, hTri / 6);
      hinge3.rotation.y = Math.PI / 3;
      hinge3.name = 'tetra_hinge_3';
      hinge3.add(createFaceMesh(createEquilateralFace(), faceColor, wireframe));
      root.add(hinge3);
      break;
    }

    case 'cylinder': {
      const r = (dims.radius || 3) * scale;
      const h = (dims.height || 6) * scale;
      const rawR = dims.radius || 3;
      const rawH = dims.height || 6;
      const circ = 2 * Math.PI * r;
      const rawCirc = (2 * Math.PI * rawR).toFixed(1);

      const cylinderGroup = new THREE.Group();
      cylinderGroup.name = 'cylinder_mesh_group';
      root.add(cylinderGroup);

      const segments = 48;
      const geom = new THREE.BufferGeometry();
      const pos = [];
      const indices = [];

      for (let i = 0; i <= segments; i++) {
        pos.push(0, 0, 0); // top row
        pos.push(0, 0, 0); // bottom row
      }

      for (let i = 0; i < segments; i++) {
        const top1 = i * 2;
        const bot1 = i * 2 + 1;
        const top2 = (i + 1) * 2;
        const bot2 = (i + 1) * 2 + 1;
        indices.push(top1, bot1, top2);
        indices.push(bot1, bot2, top2);
      }

      geom.setIndex(indices);
      geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(faceColor),
        roughness: 0.3,
        metalness: 0.1,
        wireframe: wireframe,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.name = 'curved_sheet';
      cylinderGroup.add(mesh);

      // Circular Lids
      const circleGeom = new THREE.CircleGeometry(r, 36);
      circleGeom.rotateX(-Math.PI / 2);

      const topLid = new THREE.Group();
      topLid.name = 'top_lid';
      const topMesh = createFaceMesh(circleGeom, baseColor, wireframe);
      topLid.add(topMesh);
      root.add(topLid);

      const botLid = new THREE.Group();
      botLid.name = 'bot_lid';
      const botMesh = createFaceMesh(circleGeom, baseColor, wireframe);
      botLid.add(botMesh);
      root.add(botLid);

      if (showMeas) {
        const bSheet = createMeasurementBadgeSprite(`المحيط = ${rawCirc} سم`, `الارتفاع = ${rawH} سم`);
        bSheet.position.set(0, 0.2, 0);
        cylinderGroup.add(bSheet);

        const bLid = createMeasurementBadgeSprite(`نق = ${rawR} سم`, 'دائرة القاعدة');
        bLid.position.set(0, 0.2, 0);
        topLid.add(bLid);
      }
      break;
    }

    case 'cone': {
      const r = (dims.radius || 3) * scale;
      const h = (dims.height || 5) * scale;
      const rawR = dims.radius || 3;
      const rawH = dims.height || 5;
      const rawL = Math.sqrt(rawR * rawR + rawH * rawH).toFixed(1);

      const coneGroup = new THREE.Group();
      coneGroup.name = 'cone_group';
      root.add(coneGroup);

      const segments = 40;
      const geom = new THREE.BufferGeometry();
      const pos = [];
      const indices = [];

      pos.push(0, 0, 0); // apex at index 0
      for (let i = 0; i <= segments; i++) {
        pos.push(0, 0, 0);
      }

      for (let i = 1; i <= segments; i++) {
        indices.push(0, i, i + 1);
      }

      geom.setIndex(indices);
      geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(faceColor),
        roughness: 0.3,
        metalness: 0.1,
        wireframe: wireframe,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.name = 'cone_sector_mesh';
      coneGroup.add(mesh);

      const circleGeom = new THREE.CircleGeometry(r, 36);
      circleGeom.rotateX(-Math.PI / 2);
      const baseLid = new THREE.Group();
      baseLid.name = 'cone_base_lid';
      const baseMesh = createFaceMesh(circleGeom, baseColor, wireframe);
      baseLid.add(baseMesh);
      root.add(baseLid);

      if (showMeas) {
        const b = createMeasurementBadgeSprite(`الراسم (ل) = ${rawL} سم`, `نق = ${rawR} سم`);
        b.position.set(0, 0.2, 0);
        coneGroup.add(b);
      }
      break;
    }

    case 'hexagonal_prism': {
      const s = (dims.sideHex || 3.5) * scale;
      const h = (dims.heightHex || 6) * scale;
      const rawS = dims.sideHex || 3.5;
      const rawH = dims.heightHex || 6;

      const baseGeom = new THREE.PlaneGeometry(s, h);
      baseGeom.rotateX(-Math.PI / 2);
      const baseGroup = createFaceMesh(baseGeom, faceColor, wireframe);
      root.add(baseGroup);

      if (showMeas) {
        const b = createMeasurementBadgeSprite(`${rawS} × ${rawH} سم`, 'وجه جانبي');
        b.position.set(0, 0.1, 0);
        baseGroup.add(b);
      }

      let currentParent = root;
      for (let i = 1; i <= 3; i++) {
        const hinge = new THREE.Group();
        hinge.position.set(s / 2, 0, 0);
        hinge.name = `hex_hinge_right_${i}`;
        const rectGeom = new THREE.PlaneGeometry(s, h);
        rectGeom.rotateX(-Math.PI / 2);
        rectGeom.translate(s / 2, 0, 0);
        hinge.add(createFaceMesh(rectGeom, faceColor, wireframe));
        currentParent.add(hinge);
        currentParent = hinge;
      }

      let currentLeft = root;
      for (let i = 1; i <= 2; i++) {
        const hinge = new THREE.Group();
        hinge.position.set(-s / 2, 0, 0);
        hinge.name = `hex_hinge_left_${i}`;
        const rectGeom = new THREE.PlaneGeometry(s, h);
        rectGeom.rotateX(-Math.PI / 2);
        rectGeom.translate(-s / 2, 0, 0);
        hinge.add(createFaceMesh(rectGeom, faceColor, wireframe));
        currentLeft.add(hinge);
        currentLeft = hinge;
      }

      const hexShape = new THREE.Shape();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = s * Math.cos(angle);
        const y = s * Math.sin(angle);
        if (i === 0) hexShape.moveTo(x, y);
        else hexShape.lineTo(x, y);
      }
      hexShape.closePath();

      const hexGeom = new THREE.ShapeGeometry(hexShape);
      hexGeom.rotateX(-Math.PI / 2);

      const topHex = new THREE.Group();
      topHex.position.set(0, 0, h / 2);
      topHex.name = 'hex_base_top';
      const topMesh = createFaceMesh(hexGeom, baseColor, wireframe);
      topHex.add(topMesh);
      root.add(topHex);

      const botHex = new THREE.Group();
      botHex.position.set(0, 0, -h / 2);
      botHex.name = 'hex_base_bot';
      const botMesh = createFaceMesh(hexGeom, baseColor, wireframe);
      botHex.add(botMesh);
      root.add(botHex);

      if (showMeas) {
        const b = createMeasurementBadgeSprite(`ضلع = ${rawS} سم`, 'قاعدة سداسية');
        b.position.set(0, 0.2, 0);
        topHex.add(b);
      }
      break;
    }
  }

  updatePreciseFolding(id, root, dims, fold);
}

/**
 * Updates folding rotations and positions with mathematical airtight precision.
 */
function updatePreciseFolding(id: SolidId, root: THREE.Group, dims: Record<string, number>, fold: number) {
  const scale = 0.9;
  const angle90 = (Math.PI / 2) * fold;

  switch (id) {
    case 'cube':
    case 'cuboid': {
      const hingeFront = root.getObjectByName('hinge_front');
      const hingeBack = root.getObjectByName('hinge_back');
      const hingeTop = root.getObjectByName('hinge_top');
      const hingeRight = root.getObjectByName('hinge_right');
      const hingeLeft = root.getObjectByName('hinge_left');

      if (hingeFront) hingeFront.rotation.x = -angle90;
      if (hingeBack) hingeBack.rotation.x = angle90;
      if (hingeTop) hingeTop.rotation.x = angle90;
      if (hingeRight) hingeRight.rotation.z = angle90;
      if (hingeLeft) hingeLeft.rotation.z = -angle90;
      break;
    }

    case 'square_pyramid': {
      const b = (dims.base || 5) * scale;
      const s = (dims.slantHeight || 6) * scale;
      const halfB = b / 2;
      // Exact dihedral angle so apexes meet with zero gap at (0, h, 0)
      const maxFoldAngle = Math.acos(Math.min(halfB / s, 0.999));
      const currentAngle = maxFoldAngle * fold;

      const hFront = root.getObjectByName('hinge_front');
      const hBack = root.getObjectByName('hinge_back');
      const hRight = root.getObjectByName('hinge_right');
      const hLeft = root.getObjectByName('hinge_left');

      if (hFront) hFront.rotation.x = -currentAngle;
      if (hBack) hBack.rotation.x = -currentAngle;
      if (hRight) hRight.rotation.x = -currentAngle;
      if (hLeft) hLeft.rotation.x = -currentAngle;
      break;
    }

    case 'triangular_prism': {
      const foldTriAngle = (Math.PI / 2) * fold;
      const foldWallAngle = (Math.PI / 3) * fold;

      const hTriFront = root.getObjectByName('hinge_tri_front');
      const hTriBack = root.getObjectByName('hinge_tri_back');
      const hRight = root.getObjectByName('hinge_right');
      const hLeft = root.getObjectByName('hinge_left');

      if (hTriFront) hTriFront.rotation.x = -foldTriAngle;
      if (hTriBack) hTriBack.rotation.x = -foldTriAngle;
      if (hRight) hRight.rotation.z = foldWallAngle;
      if (hLeft) hLeft.rotation.z = -foldWallAngle;
      break;
    }

    case 'tetrahedron': {
      const dihedral = Math.acos(1 / 3);
      const currentAngle = dihedral * fold;

      const h1 = root.getObjectByName('tetra_hinge_1');
      const h2 = root.getObjectByName('tetra_hinge_2');
      const h3 = root.getObjectByName('tetra_hinge_3');

      if (h1) h1.rotation.x = -currentAngle;
      if (h2) h2.rotation.x = -currentAngle;
      if (h3) h3.rotation.x = -currentAngle;
      break;
    }

    case 'cylinder': {
      const r = (dims.radius || 3) * scale;
      const h = (dims.height || 6) * scale;
      const circ = 2 * Math.PI * r;

      const group = root.getObjectByName('cylinder_mesh_group');
      const mesh = group?.getObjectByName('curved_sheet') as THREE.Mesh;
      const topLid = root.getObjectByName('top_lid');
      const botLid = root.getObjectByName('bot_lid');

      if (mesh && mesh.geometry) {
        const geom = mesh.geometry as THREE.BufferGeometry;
        const posAttr = geom.getAttribute('position');
        const segments = 48;

        const totalAngle = Math.max(fold * Math.PI * 2, 0.0001);
        const currentR = totalAngle > 0.05 ? circ / totalAngle : 1000;

        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          let x: number, z: number;

          if (fold < 0.05) {
            x = (t - 0.5) * circ;
            z = 0;
          } else {
            const angle = (t - 0.5) * totalAngle;
            x = Math.sin(angle) * currentR;
            z = Math.cos(angle) * currentR - currentR;
          }

          posAttr.setXYZ(i * 2, x, h / 2, z);
          posAttr.setXYZ(i * 2 + 1, x, -h / 2, z);
        }
        posAttr.needsUpdate = true;
        geom.computeVertexNormals();
      }

      if (topLid) {
        if (fold < 0.05) {
          topLid.position.set(0, 0, -r - 0.2);
          topLid.rotation.set(0, 0, 0);
        } else {
          topLid.position.set(0, h / 2, 0);
          topLid.rotation.set(0, 0, 0);
        }
      }

      if (botLid) {
        if (fold < 0.05) {
          botLid.position.set(0, 0, r + 0.2);
          botLid.rotation.set(0, 0, 0);
        } else {
          botLid.position.set(0, -h / 2, 0);
          botLid.rotation.set(0, 0, 0);
        }
      }
      break;
    }

    case 'cone': {
      const r = (dims.radius || 3) * scale;
      const h = (dims.height || 5) * scale;
      const L = Math.sqrt(r * r + h * h);
      const circ = 2 * Math.PI * r;

      const group = root.getObjectByName('cone_group');
      const mesh = group?.getObjectByName('cone_sector_mesh') as THREE.Mesh;
      const baseLid = root.getObjectByName('cone_base_lid');

      if (mesh && mesh.geometry) {
        const geom = mesh.geometry as THREE.BufferGeometry;
        const posAttr = geom.getAttribute('position');
        const segments = 40;

        posAttr.setXYZ(0, 0, h * fold, 0);

        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          if (fold < 0.05) {
            const angle = (t - 0.5) * (circ / L);
            const x = Math.sin(angle) * L;
            const z = Math.cos(angle) * L;
            posAttr.setXYZ(i + 1, x, 0, z);
          } else {
            const angle = t * Math.PI * 2 * fold;
            const x = Math.sin(angle) * r;
            const z = Math.cos(angle) * r;
            posAttr.setXYZ(i + 1, x, 0, z);
          }
        }
        posAttr.needsUpdate = true;
        geom.computeVertexNormals();
      }

      if (baseLid) {
        if (fold < 0.05) {
          baseLid.position.set(0, 0, L + r + 0.3);
        } else {
          baseLid.position.set(0, 0, 0);
        }
      }
      break;
    }

    case 'hexagonal_prism': {
      const angle60 = (Math.PI / 3) * fold;
      const angle90 = (Math.PI / 2) * fold;

      for (let i = 1; i <= 3; i++) {
        const h = root.getObjectByName(`hex_hinge_right_${i}`);
        if (h) h.rotation.z = angle60;
      }
      for (let i = 1; i <= 2; i++) {
        const h = root.getObjectByName(`hex_hinge_left_${i}`);
        if (h) h.rotation.z = -angle60;
      }

      const topHex = root.getObjectByName('hex_base_top');
      const botHex = root.getObjectByName('hex_base_bot');
      if (topHex) topHex.rotation.x = -angle90;
      if (botHex) botHex.rotation.x = angle90;
      break;
    }
  }
}
