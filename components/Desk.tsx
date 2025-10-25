import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, useGLTF } from "@react-three/drei"

function Workspace() {
  const { scene } = useGLTF("/models/Desk.glb")
  return <primitive object={scene} scale={1.1} />
}

export default function Careers() {
  return (
    <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
      <ambientLight intensity={1} />
      <Environment preset="sunset" />
      <OrbitControls enableZoom={false} autoRotate />
      <Workspace />
    </Canvas>
  )
}
