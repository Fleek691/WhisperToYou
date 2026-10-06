import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeBookCanvasProps {
  coverUrl: string;
  title: string;
  author: string;
}

export const ThreeBookCanvas: React.FC<ThreeBookCanvasProps> = ({ coverUrl, title, author }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 520;

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup (Preserved exact position & FOV)
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lights (Preserved exact lighting & shadows)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(4, 5, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const crimsonRimLight = new THREE.PointLight(0xcc1f1f, 3.0, 10);
    crimsonRimLight.position.set(-3, -1, 2);
    scene.add(crimsonRimLight);

    // 5. Dynamic Texture Generators for Spine & Back
    const createSpineTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, 128, 1024);

      ctx.strokeStyle = '#800A0A';
      ctx.lineWidth = 4;
      ctx.strokeRect(6, 6, 116, 1012);

      ctx.save();
      ctx.translate(64, 512);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#CC1F1F';
      ctx.font = 'bold 36px "Cormorant Garamond", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(title.toUpperCase(), 0, -10);

      ctx.fillStyle = '#888888';
      ctx.font = '18px "Inter", sans-serif';
      ctx.fillText(`BY ${author.toUpperCase()}`, 0, 30);
      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const createBackCoverTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 768;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, 768, 1024);

      ctx.strokeStyle = 'rgba(128, 10, 10, 0.4)';
      ctx.lineWidth = 8;
      ctx.strokeRect(30, 30, 708, 964);

      ctx.fillStyle = '#990000';
      ctx.font = 'italic 34px "Cormorant Garamond", serif';
      ctx.textAlign = 'center';
      ctx.fillText('"In every shadow, I whisper your name..."', 384, 480);

      ctx.fillStyle = '#555555';
      ctx.font = '16px "Inter", sans-serif';
      ctx.fillText(`© ${new Date().getFullYear()} ${author}. All rights reserved.`, 384, 930);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    };

    const createPitchBlackEdgeTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, 128, 128);

      ctx.fillStyle = '#111111';
      for (let i = 0; i < 128; i += 4) {
        ctx.fillRect(0, i, 128, 1);
      }

      return new THREE.CanvasTexture(canvas);
    };

    const spineTexture = createSpineTexture();
    const backCoverTexture = createBackCoverTexture();
    const blackEdgeTexture = createPitchBlackEdgeTexture();

    // 6. TARGETED THREE.JS UV CROP: Trims source image white borders & maps cover artwork 100% full bleed
    const textureLoader = new THREE.TextureLoader();
    const frontCoverTexture = textureLoader.load(coverUrl);
    frontCoverTexture.colorSpace = THREE.SRGBColorSpace;
    frontCoverTexture.minFilter = THREE.LinearFilter;
    frontCoverTexture.magFilter = THREE.LinearFilter;
    frontCoverTexture.wrapS = THREE.ClampToEdgeWrapping;
    frontCoverTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Exact UV Crop matching the dark cover artwork inside book-cover.png (592x863 px inside 1024x1024 px image)
    // Safety inset ensures zero light-colored border bleeding from original PNG margins
    frontCoverTexture.offset.set(0.2109, 0.0869);
    frontCoverTexture.repeat.set(0.5732, 0.8379);

    const frontCoverMaterial = new THREE.MeshStandardMaterial({
      map: frontCoverTexture,
      roughness: 0.35,
      metalness: 0.0,
    });

    // 7. PRESERVED 3D BOOK GEOMETRY & THICKNESS
    // Aspect ratio of original cover artwork (592x863) is 0.68598
    const bookHeight = 3.65;
    const bookWidth = 2.50; // Resized width to match cover artwork aspect ratio (3.65 * 592 / 863)
    const bookDepth = 0.35; // Preserved physical thickness

    const bookGeometry = new THREE.BoxGeometry(bookWidth, bookHeight, bookDepth);

    const pitchBlackMat = new THREE.MeshStandardMaterial({ map: blackEdgeTexture, roughness: 0.8 });
    const spineMaterial = new THREE.MeshStandardMaterial({ map: spineTexture, roughness: 0.5 });
    const backCoverMaterial = new THREE.MeshStandardMaterial({ map: backCoverTexture, roughness: 0.5 });

    const materials = [
      pitchBlackMat,       // Right (Dark Edge)
      spineMaterial,       // Left (Spine Text)
      pitchBlackMat,       // Top (Dark Edge)
      pitchBlackMat,       // Bottom (Dark Edge)
      frontCoverMaterial,  // Front Cover (Full Bleed Edge-To-Edge Cover)
      backCoverMaterial,   // Back Cover
    ];

    const bookMesh = new THREE.Mesh(bookGeometry, materials);
    bookMesh.castShadow = true;
    bookMesh.receiveShadow = true;

    const bookGroup = new THREE.Group();
    bookGroup.add(bookMesh);
    scene.add(bookGroup);

    // Preserved Rotation & Positioning Angle
    bookGroup.rotation.y = -0.32;
    bookGroup.rotation.x = 0.1;

    // Preserved Floor Shadow
    const shadowGeo = new THREE.PlaneGeometry(4.5, 4.5);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.6 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.y = -2.15;
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // 8. CREATIVE INTERACTIVE RED SPIDER LILY PETALS PARTICLE SYSTEM
    const particleCount = 55;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;

      velocities[i * 3] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 1] = Math.random() * 0.008 + 0.003;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const createPetalTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;

      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(204, 31, 31, 0.95)');
      grad.addColorStop(0.5, 'rgba(153, 0, 0, 0.6)');
      grad.addColorStop(1, 'rgba(139, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(32, 32, 28, 12, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      return new THREE.CanvasTexture(canvas);
    };

    const petalTexture = createPetalTexture();

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.22,
      map: petalTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    // 9. Interactive Mouse Movement & Click Physics
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0.1;
    let targetRotationY = -0.32;
    let clock = new THREE.Clock();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      mouseX = x;
      mouseY = y;

      targetRotationY = -0.32 + mouseX * 0.75;
      targetRotationX = 0.1 - mouseY * 0.5;
    };

    const handleClick = () => {
      const posAttr = particlesGeometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] = (Math.random() - 0.5) * 1.8;
        posArr[i * 3 + 1] = (Math.random() - 0.5) * 1.8;
        posArr[i * 3 + 2] = (Math.random() - 0.5) * 1.8;
      }
      posAttr.needsUpdate = true;
    };

    container.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Floating Levitation Effect
      bookGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.08;

      // Smooth Lerp Rotation
      bookGroup.rotation.y += (targetRotationY - bookGroup.rotation.y) * 0.05;
      bookGroup.rotation.x += (targetRotationX - bookGroup.rotation.x) * 0.05;

      // Petal Movement
      const posAttr = particlesGeometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 1] += velocities[i * 3 + 1];
        posArr[i * 3] += Math.sin(elapsedTime + i) * 0.002;

        if (posArr[i * 3 + 1] > 3) {
          posArr[i * 3 + 1] = -3;
          posArr[i * 3] = (Math.random() - 0.5) * 6;
        }
      }
      posAttr.needsUpdate = true;
      particleSystem.rotation.y = elapsedTime * 0.08;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 380;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [coverUrl, title, author]);

  return (
    <div className="relative group w-full max-w-[380px] sm:max-w-[420px] h-[480px] sm:h-[540px] flex items-center justify-center">
      <div
        ref={containerRef}
        className="w-full h-full cursor-pointer"
        title="Whisper to You by Ladup Sherpa"
      />
    </div>
  );
};
