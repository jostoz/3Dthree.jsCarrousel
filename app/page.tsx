'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { Info, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'


interface GalleryItem {
  image: string;
  title: string;
  description: string;
  content: string;
}

const galleryData = [
  { 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    title: '🎙️ Real-time Voice AI Platform',
    description: 'Hybrid voice system with 50ms latency combining instant responses and deep analysis using LiveKit and OpenAI Realtime API',
    content: 'Architected a cutting-edge hybrid voice system achieving unprecedented 50ms response latency with dual pipeline architecture for instant responses and deep analysis. The system reduces operational costs by 40% while maintaining 95% accuracy in responses. Built using LiveKit and OpenAI Realtime API, this platform represents the future of conversational AI with real-time voice processing capabilities that handle thousands of concurrent users seamlessly.'
  },
  {
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
    title: '🤖 Pre-ChatGPT Commerce Chatbot',
    description: 'Pioneer conversational commerce system processing 1000+ daily orders with NLU before GPT era',
    content: 'Developed a groundbreaking conversational commerce chatbot before the ChatGPT era, processing over 1000 daily orders with advanced Natural Language Understanding. The system integrated payment processing and real-time kitchen notifications, achieving a 70% reduction in order processing time. Built using Dialogflow and Firebase, this innovative solution demonstrated the power of AI-driven commerce automation when such technology was still in its infancy.'
  },
  {
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    title: '📱 National Telecom Database (Qronecta)',
    description: 'Verification system for 100M+ phone numbers with geographic segmentation for government contracts',
    content: 'Engineered a comprehensive national telecommunications verification system handling over 100 million phone numbers with sophisticated geographic segmentation by postal code. Developed proprietary algorithms for massive verification processes that secured government contracts for national SMS alert services. The system provides real-time verification capabilities and geographic targeting essential for political campaigns and national emergency alerts.'
  },
  {
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=600&fit=crop',
    title: '💰 Financial Data Processing (FXState)',
    description: 'Robust financial system with strict validation achieving 90% error reduction and 40% speed improvement',
    content: 'Developed a comprehensive financial data processing system with rigorous validation protocols, achieving a remarkable 90% reduction in data errors. Implemented over 100 test cases ensuring complete data integrity while improving processing speed by 40%. Built using Pydantic v2 and advanced Type Hints, the system handles complex financial transactions with enterprise-grade reliability and performance optimization.'
  },
  {
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
    title: '🧠 Mental Health AI Platform',
    description: 'Emotion-aware therapy application processing 10K+ sessions with crisis intervention capabilities',
    content: 'Created an innovative emotion-aware therapy application that has processed over 10,000 therapy sessions with advanced psychological pattern detection and crisis intervention capabilities. The platform achieves 92% user satisfaction while maintaining HIPAA compliance. Using Hume AI for emotion detection, the system provides real-time psychological support with intelligent escalation protocols for crisis situations.'
  },
  {
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
    title: '🎓 AI Educational Platforms Suite',
    description: 'Complete educational suite using GPT-4 and custom LLMs with LangGraph workflows processing 10K+ daily queries',
    content: 'Architected a comprehensive suite of AI educational platforms (IGE MODEL, TUTOR AI, NIMBUS AI) utilizing GPT-4 and custom Large Language Models. Implemented sophisticated LangGraph workflows for intelligent agent orchestration, processing over 10,000 daily educational queries. The platform features personalized learning algorithms that improve student retention by 40% through adaptive AI-driven content delivery and assessment.'
  },
  {
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
    title: '🏢 High-Performance Team Formation (Stratos)',
    description: 'Big Five personality classification system for agile team optimization used by 50+ organizations',
    content: 'Engineered an advanced Big Five personality classification system for optimizing agile team formation and performance. The web platform is actively used by over 50 organizations, implementing sophisticated algorithms for agile coach evaluation and optimized team composition. The system analyzes personality traits, work styles, and collaboration patterns to create high-performing teams with measurable improvements in productivity and team satisfaction.'
  },
  {
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
    title: '🆘 Post-Trauma Voice Support App',
    description: 'Educational post-trauma application with Vapi voice integration and real-time crisis detection',
    content: 'Developed a sensitive post-trauma educational application featuring advanced Vapi voice integration with crisis-aware conversational flows. The system provides real-time crisis detection and response, reducing emergency response time by 70% for the Yo Digo No Más Foundation. The application combines therapeutic conversation patterns with immediate escalation protocols, providing crucial support during vulnerable moments while maintaining user privacy and dignity.'
  }
]
export default function Gallery() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const planesRef = useRef<THREE.Mesh[]>([])
  const particlesRef = useRef<THREE.Mesh[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    sceneRef.current = scene
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    cameraRef.current = camera
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5
    controls.enableZoom = false

    camera.position.set(0, 0, 15)
    controls.update()

    // Front layer (3D gallery)
    const radius = 10
    const planeWidth = 4
    const planeHeight = 5

    galleryData.forEach((item, i) => {
      const angle = (i / galleryData.length) * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius

      const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
      const material = new THREE.MeshBasicMaterial({ 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1
      })
      const plane = new THREE.Mesh(geometry, material)
      plane.position.set(x, 0, z)
      plane.lookAt(0, 0, 0)
      scene.add(plane)
      planesRef.current.push(plane)

      new THREE.TextureLoader().load(item.image, (texture) => {
        plane.material.map = texture
        plane.material.needsUpdate = true
      })
    })

    // Background layer (floating particles)
    const particleCount = 100
    const textureLoader = new THREE.TextureLoader()

    for (let i = 0; i < particleCount; i++) {
      const texture = textureLoader.load(galleryData[Math.floor(Math.random() * galleryData.length)].image)
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.2,
      })
      const geometry = new THREE.PlaneGeometry(2, 2)
      const particle = new THREE.Mesh(geometry, material)

      particle.position.set(
        Math.random() * 60 - 30,
        Math.random() * 60 - 30,
        Math.random() * 20 - 25
      )
      particle.rotation.z = Math.random() * Math.PI
      particlesRef.current.push(particle)
      scene.add(particle)
    }

    let mouseX = 0
    let mouseY = 0

    function onMouseMove(event: MouseEvent) {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', onMouseMove)

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    function onMouseClick(event: MouseEvent) {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planesRef.current);

      if (intersects.length > 0) {
        const clickedPlane = intersects[0].object as THREE.Mesh;
        const clickedIndex = planesRef.current.indexOf(clickedPlane);
        setSelectedImage(clickedIndex);
      }
    }

    window.addEventListener('click', onMouseClick)

    function animate() {
      requestAnimationFrame(animate)
      controls.update()

      // Animate background particles
      particlesRef.current.forEach((particle) => {
        particle.position.y += 0.03
        particle.position.x += mouseX * 0.02
        particle.rotation.z += 0.002

        if (particle.position.y > 30) particle.position.y = -30
        if (particle.position.x > 30) particle.position.x = -30
        if (particle.position.x < -30) particle.position.x = 30
      })

      renderer.render(scene, camera)
    }
    animate()

    function handleResize() {
      if (cameraRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
      }
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    function handleScroll() {
      const scrollPosition = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = scrollPosition / maxScroll
      const targetRotation = scrollProgress * Math.PI * 2

      planesRef.current.forEach((plane, index) => {
        const angle = targetRotation + (index / galleryData.length) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        plane.position.set(x, 0, z)
        plane.lookAt(0, 0, 0)
      })

      // Affect background particles based on scroll
      particlesRef.current.forEach((particle) => {
        particle.position.x += scrollProgress * 0.2
      })

      const newIndex = Math.round(scrollProgress * (galleryData.length - 1))
      setCurrentIndex(newIndex)
    }

    window.addEventListener('scroll', handleScroll)

    // Add this new event listener for the Escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onMouseClick)
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [])

  const handleCloseFullPage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  return (
    <div className="h-[300vh] bg-gray-100">
      <div className="fixed inset-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      <div className="fixed top-0 left-0 right-0 p-4 bg-white bg-opacity-90">
        <h1 className="text-3xl font-bold text-center text-gray-800">Hi, I'm Josué Tostado 👋</h1>
        <p className="text-center text-gray-600 mt-1">Senior AI Engineer & Machine Learning Specialist 🤖</p>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black bg-opacity-80 text-white">
        <h2 className="text-2xl font-bold">{galleryData[currentIndex].title}</h2>
        <p>{galleryData[currentIndex].description}</p>
      </div>
      <div className="fixed bottom-4 right-4 bg-white bg-opacity-90 p-3 rounded-lg shadow-lg">
        <p className="text-sm text-gray-700 font-medium">📜 Scroll to navigate</p>
        <p className="text-xs text-gray-500 mt-1">Click projects for details</p>
      </div>
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 z-50 overflow-auto">
          <div className="max-w-4xl mx-auto p-8">
            <button
              onClick={handleCloseFullPage}
              className="absolute top-4 right-4 text-white text-2xl"
            >
              ×
            </button>
            <div className="flex flex-col md:flex-row items-start">
              <div className="md:w-1/2 pr-8">
                <h2 className="text-4xl font-bold text-white mb-4">{galleryData[selectedImage].title}</h2>
                <img
                  src={galleryData[selectedImage].image}
                  alt={galleryData[selectedImage].title}
                  className="w-full h-auto mb-4 rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-1/2">
                <p className="text-white text-lg leading-relaxed">{galleryData[selectedImage].content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}