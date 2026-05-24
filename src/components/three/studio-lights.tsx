"use client";

export default function StudioLights() {
  return (
    <>
      {/* Soft warm ambient — base tone */}
      <ambientLight intensity={0.38} color="#FFFBEA" />

      {/* Key light — upper right warm, cinematic angle */}
      <directionalLight
        position={[5, 6, 4]}
        intensity={1.6}
        color="#FFDF79"
        castShadow={false}
      />

      {/* Front fill — brings out clearcoat highlights on glass */}
      <pointLight position={[0, 0.5, 5]} intensity={0.55} color="#FFF8EE" />

      {/* Warm floor bounce — illuminates honey from below */}
      <pointLight position={[0, -4, 2]} intensity={0.50} color="#E5A020" />

      {/* Rim — left edge backlight, separates jar from bg */}
      <pointLight position={[-5, 2, -3]} intensity={0.45} color="#FFDF79" />

      {/* Cool back accent — gives glass depth / translucency feel */}
      <pointLight position={[1, 0, -6]} intensity={0.22} color="#C8D8FF" />
    </>
  );
}
