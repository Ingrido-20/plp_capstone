"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useScada, PumpComponentKey } from "@/context/ScadaContext";

interface ComponentInfo {
  name: string;
  statusTitle: string;
  statusDesc: string;
  statusColor: string;
  shap1: { name: string; pct: number; val: string };
  shap2: { name: string; pct: number; val: string };
  shap3: { name: string; pct: number; val: string };
}

export const componentDiagnostics: Record<PumpComponentKey, ComponentInfo> = {
  bearing: {
    name: "Inboard Roller Bearing #1",
    statusTitle: "Diagnostic Status: Impending Outer-Race Roller Fault",
    statusDesc: "High thermal rise (86.4 °C) combined with 4.82 mm/s vibration velocity signature at 120 Hz BPFO frequency.",
    statusColor: "text-red-500",
    shap1: { name: "Bearing Temp Drift", pct: 48, val: "+0.48" },
    shap2: { name: "Vibration RMS (120Hz)", pct: 32, val: "+0.32" },
    shap3: { name: "Flowgard Pressure Res.", pct: 14, val: "+0.14" },
  },
  motor: {
    name: "Electric Drive Motor Stator",
    statusTitle: "Diagnostic Status: Nominal Electrical Operation",
    statusDesc: "Phase current balanced at 312.5A. Stator temperature nominal at 42.1 °C.",
    statusColor: "text-emerald-400",
    shap1: { name: "Phase Current Imbalance", pct: 12, val: "+0.08" },
    shap2: { name: "Thermal Load", pct: 8, val: "+0.05" },
    shap3: { name: "Vibration Harmonic", pct: 4, val: "+0.02" },
  },
  seal: {
    name: "Mechanical Face Seal",
    statusTitle: "Diagnostic Status: Precursor Wear Alert",
    statusDesc: "Slight pressure differential drop across secondary seal faces (54.0 °C).",
    statusColor: "text-amber-400",
    shap1: { name: "Seal Temp Gradient", pct: 28, val: "+0.22" },
    shap2: { name: "Pressure Delta", pct: 18, val: "+0.15" },
    shap3: { name: "Flow Velocity", pct: 8, val: "+0.06" },
  },
  impeller: {
    name: "Enclosed Centrifugal Impeller",
    statusTitle: "Diagnostic Status: Nominal Hydraulic Balance",
    statusDesc: "Impeller vanes balanced with zero cavitation erosion detected.",
    statusColor: "text-emerald-400",
    shap1: { name: "Suction Head Delta", pct: 10, val: "+0.05" },
    shap2: { name: "Cavitation Spectrum", pct: 6, val: "+0.03" },
    shap3: { name: "Flow Turbulence", pct: 4, val: "+0.01" },
  },
};

export default function ThreePumpVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectedComponent, setSelectedComponent } = useScada();
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const shaftMeshRef = useRef<THREE.Mesh | null>(null);
  const impellerMeshRef = useRef<THREE.Mesh | null>(null);
  const bearingMeshRef = useRef<THREE.Mesh | null>(null);
  const interactiveObjectsRef = useRef<THREE.Object3D[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId: number;

    try {
      // 1. Scene setup
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0b1120);
      sceneRef.current = scene;

      const width = container.clientWidth || 600;
      const height = 340;

      // 2. Camera setup
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(12, 8, 16);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // 3. Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      container.innerHTML = "";
      container.appendChild(renderer.domElement);

      // 4. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
      dirLight.position.set(15, 20, 15);
      scene.add(dirLight);

      const redLight = new THREE.PointLight(0xd9232d, 2, 12);
      redLight.position.set(0, 1, 0);
      scene.add(redLight);

      // 5. Build 3D Centrifugal Pump
      const interactiveObjs: THREE.Object3D[] = [];

      // Baseplate
      const baseGeo = new THREE.BoxGeometry(16, 0.6, 6);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.set(0, -1.8, 0);
      scene.add(baseMesh);

      // 1) Motor Stator
      const motorGroup = new THREE.Group();
      motorGroup.userData = { partKey: "motor" };
      const motorGeo = new THREE.CylinderGeometry(2.0, 2.0, 5.0, 32);
      const motorMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.6 });
      const motorMesh = new THREE.Mesh(motorGeo, motorMat);
      motorMesh.rotation.z = Math.PI / 2;
      motorGroup.add(motorMesh);

      for (let i = -2; i <= 2; i += 0.5) {
        const finGeo = new THREE.CylinderGeometry(2.15, 2.15, 0.1, 32);
        const finMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
        const finMesh = new THREE.Mesh(finGeo, finMat);
        finMesh.rotation.z = Math.PI / 2;
        finMesh.position.x = i;
        motorGroup.add(finMesh);
      }
      motorGroup.position.set(-4.5, 0.4, 0);
      scene.add(motorGroup);
      interactiveObjs.push(motorGroup, motorMesh);

      // 2) Stainless Shaft
      const shaftGeo = new THREE.CylinderGeometry(0.4, 0.4, 11, 32);
      const shaftMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 });
      const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
      shaftMesh.rotation.z = Math.PI / 2;
      shaftMesh.position.set(0.5, 0.4, 0);
      scene.add(shaftMesh);
      shaftMeshRef.current = shaftMesh;

      // 3) Bearing Group (CRITICAL - Glowing Red)
      const bearingGroup = new THREE.Group();
      bearingGroup.userData = { partKey: "bearing" };
      const bearingGeo = new THREE.TorusGeometry(1.2, 0.35, 16, 32);
      const bearingMat = new THREE.MeshStandardMaterial({
        color: 0xd9232d,
        emissive: 0xd9232d,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2,
      });
      const bearingMesh = new THREE.Mesh(bearingGeo, bearingMat);
      bearingMesh.rotation.y = Math.PI / 2;
      bearingGroup.add(bearingMesh);
      bearingMeshRef.current = bearingMesh;

      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        const ballGeo = new THREE.SphereGeometry(0.22, 16, 16);
        const ballMat = new THREE.MeshStandardMaterial({ color: 0xffbbbb, metalness: 0.9 });
        const ball = new THREE.Mesh(ballGeo, ballMat);
        ball.position.set(0, Math.sin(a) * 1.2, Math.cos(a) * 1.2);
        bearingGroup.add(ball);
      }
      bearingGroup.position.set(0, 0.4, 0);
      scene.add(bearingGroup);
      interactiveObjs.push(bearingGroup, bearingMesh);

      // 4) Seal Group
      const sealGroup = new THREE.Group();
      sealGroup.userData = { partKey: "seal" };
      const sealGeo = new THREE.TorusGeometry(0.9, 0.2, 16, 32);
      const sealMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0x92400e, metalness: 0.8 });
      const sealMesh = new THREE.Mesh(sealGeo, sealMat);
      sealMesh.rotation.y = Math.PI / 2;
      sealGroup.add(sealMesh);
      sealGroup.position.set(2.2, 0.4, 0);
      scene.add(sealGroup);
      interactiveObjs.push(sealGroup, sealMesh);

      // 5) Impeller Group
      const impellerGroup = new THREE.Group();
      impellerGroup.userData = { partKey: "impeller" };
      const voluteGeo = new THREE.TorusGeometry(2.4, 1.1, 24, 36, Math.PI * 1.7);
      const voluteMat = new THREE.MeshStandardMaterial({ color: 0x008751, metalness: 0.7, roughness: 0.3 });
      const voluteMesh = new THREE.Mesh(voluteGeo, voluteMat);
      voluteMesh.rotation.y = Math.PI / 2;
      impellerGroup.add(voluteMesh);

      const vaneGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.6, 6);
      const vaneMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.9 });
      const impellerMesh = new THREE.Mesh(vaneGeo, vaneMat);
      impellerMesh.rotation.z = Math.PI / 2;
      impellerGroup.add(impellerMesh);
      impellerMeshRef.current = impellerMesh;

      impellerGroup.position.set(4.5, 0.4, 0);
      scene.add(impellerGroup);
      interactiveObjs.push(impellerGroup, voluteMesh, impellerMesh);

      interactiveObjectsRef.current = interactiveObjs;

      // Raycasting interaction
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const handlePointerDown = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveObjectsRef.current, true);

        if (intersects.length > 0) {
          let hit: THREE.Object3D | null = intersects[0].object;
          while (hit && !hit.userData?.partKey && hit.parent && hit.parent !== scene) {
            hit = hit.parent;
          }
          if (hit?.userData?.partKey) {
            setSelectedComponent(hit.userData.partKey as PumpComponentKey);
          }
        }
      };

      container.addEventListener("pointerdown", handlePointerDown);

      // Render Loop
      const clock = new THREE.Clock();
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        if (shaftMeshRef.current) shaftMeshRef.current.rotation.x += 0.03;
        if (impellerMeshRef.current) impellerMeshRef.current.rotation.x += 0.03;

        if (bearingMeshRef.current && (bearingMeshRef.current.material as THREE.MeshStandardMaterial)) {
          (bearingMeshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
            0.5 + Math.sin(elapsed * 4) * 0.4;
        }

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth || 600;
        camera.aspect = w / 340;
        camera.updateProjectionMatrix();
        renderer.setSize(w, 340);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        container.removeEventListener("pointerdown", handlePointerDown);
        cancelAnimationFrame(animId);
        renderer.dispose();
      };
    } catch {
      setWebglSupported(false);
    }
  }, [setSelectedComponent]);

  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(12, 8, 16);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const currentInfo = componentDiagnostics[selectedComponent];

  return (
    <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-4 text-slate-100 flex flex-col gap-4">
      {/* Visualizer Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Interactive 3D Centrifugal Pump Visualizer (Three.js WebGL)
          </h3>
          <p className="text-xs text-slate-400">
            Click any pump component to inspect failure glow state & SHAP attribution
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetCamera}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
          >
            Reset Camera View
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container or Fallback */}
      {webglSupported ? (
        <div
          ref={containerRef}
          className="relative w-full h-[340px] rounded-lg overflow-hidden border border-slate-800 bg-[#070b14] cursor-pointer"
        >
          {/* Overlay Part Labels */}
          <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur border border-slate-800 rounded px-3 py-1 text-xs text-slate-300">
            Selected Part: <span className="font-semibold text-emerald-400">{currentInfo.name}</span>
          </div>
        </div>
      ) : (
        <div className="w-full h-[340px] rounded-lg bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-amber-400 font-semibold text-sm mb-2">WebGL Renderer Fallback</div>
          <p className="text-xs text-slate-400 max-w-md">
            Interactive SVG Pump Diagram is active. Click below to inspect components:
          </p>
        </div>
      )}

      {/* Interactive Component Quick Select Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {(Object.keys(componentDiagnostics) as PumpComponentKey[]).map((key) => {
          const info = componentDiagnostics[key];
          const isSelected = selectedComponent === key;
          const isBearingFault = key === "bearing";

          return (
            <button
              key={key}
              onClick={() => setSelectedComponent(key)}
              className={`p-2.5 rounded-lg border text-left text-xs transition flex flex-col justify-between ${
                isSelected
                  ? isBearingFault
                    ? "bg-red-950/40 border-red-500/80 text-red-200"
                    : "bg-emerald-950/40 border-emerald-500/80 text-emerald-200"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <div className="font-medium">{info.name}</div>
              <div className="text-[10px] mt-1 flex items-center justify-between">
                <span>{key === "bearing" ? "🔴 Fault (BPFO)" : key === "seal" ? "🟡 Precursor" : "🟢 Nominal"}</span>
                {isSelected && <span className="font-bold text-emerald-400">Selected</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Component Diagnostic & SHAP Weight Attribution Breakdown */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              Diagnostic Details: {currentInfo.name}
            </h4>
            <div className={`text-xs font-semibold mt-0.5 ${currentInfo.statusColor}`}>
              {currentInfo.statusTitle}
            </div>
          </div>
          <span className="text-[11px] bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded">
            Asset: PS7 Nakuru Pump 4 (KPC-P4-NK)
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-2.5 rounded border border-slate-800/80">
          {currentInfo.statusDesc}
        </p>

        {/* SHAP Weight Attribution Bars */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            SHAP Feature Driver Attribution
          </div>

          {[currentInfo.shap1, currentInfo.shap2, currentInfo.shap3].map((shap, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs">
              <div className="w-36 text-slate-400 truncate">{shap.name}</div>
              <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full ${
                    selectedComponent === "bearing" ? "bg-red-500" : "bg-emerald-400"
                  }`}
                  style={{ width: `${shap.pct}%` }}
                ></div>
              </div>
              <div className="w-12 text-right font-mono font-semibold text-slate-200">{shap.val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
