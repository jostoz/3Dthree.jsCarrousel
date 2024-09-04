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
    image: 'https://fin4vyigxmq2nrbp.public.blob.vercel-storage.com/00008-950881081-min-VmJJLmOyrgkxKsodROIqDaLLEap0SD.png',
    title: 'NLP Predicts Personality',
    description: 'Natural Language Processing can predict personality traits through text analysis with an accuracy of 94%',
    content: 'A groundbreaking study published in May 2021 has revealed that Natural Language Processing (NLP) techniques can predict personality traits through text analysis with an impressive accuracy of 94%. This research opens up new possibilities for understanding human behavior and communication patterns through automated analysis of written text. The implications of this technology span across various fields, including psychology, marketing, and human resources, potentially revolutionizing how we assess and understand individual personalities in both personal and professional contexts.'
  },
  {
    image: 'https://fin4vyigxmq2nrbp.public.blob.vercel-storage.com/00011-950881084-min-Fab5OfmUCuRpxVWSVFkVkqOG4T0aU6.png',
    title: 'CV Analysis Predicts Personality',
    description: 'Natural Language Processing predicts the personalities of candidates based only in their CV analysis',
    content: 'In September 2021, researchers unveiled a novel application of Natural Language Processing (NLP) that can predict candidates\' personalities based solely on their CV analysis. This innovative approach to personality assessment could significantly impact recruitment processes, allowing for more efficient and objective evaluations of job applicants. By analyzing the language, structure, and content of CVs, the NLP algorithms can infer various personality traits, potentially providing valuable insights to employers and streamlining the hiring process.'
  },
  {
    image: 'https://fin4vyigxmq2nrbp.public.blob.vercel-storage.com/00014-3792969356-min-JVYldqamJ5BUsz8qjsSOlbGTXJ9Wqr.png',
    title: 'NLP Predicts Age and Gender',
    description: 'Natural Language Processing predicts personality using textual data from public posts with an average accuracy of 98% for age prediction and 94% for gender prediction.',
    content: 'A November 2019 study demonstrated that Natural Language Processing can predict personality traits, age, and gender using textual data from public posts with remarkable accuracy. The research showed an average accuracy of 98% for age prediction and 94% for gender prediction. This advancement in NLP technology raises important questions about privacy and the ethical use of public data, while also showcasing the potential for more personalized and targeted communication strategies in various industries.'
  },
  {
    image: 'https://fin4vyigxmq2nrbp.public.blob.vercel-storage.com/00019-2612175235-min-lQADKHJ9EbUEP9OTVVLayqoraYqMKs.png',
    title: 'NLP Calculates Cognitive Load',
    description: 'Natural Language Processing is used to calculate cognitive load from verbal behavioural data and examine specific thinking patterns.',
    content: 'In November 2022, researchers reported using Natural Language Processing to calculate cognitive load from verbal behavioral data and examine specific thinking patterns. This innovative application of NLP technology offers new insights into human cognition and mental processes. By analyzing speech patterns and verbal cues, researchers can now better understand how individuals process information and respond to various cognitive demands, potentially leading to advancements in fields such as education, psychology, and human-computer interaction.'
  },
  {
    image: 'https://fin4vyigxmq2nrbp.public.blob.vercel-storage.com/00030-1894949390-min-vfv8Q8XkOZ4ffv2wK5ViSS4HjzNRHF.png',
    title: 'Speech Data Predicts Cognitive Load',
    description: 'Assessment of cognitive load based only on speech data has an accuracy of 92%',
    content: 'A study published in September 2010 revealed that the assessment of cognitive load based solely on speech data can achieve an accuracy of 92%. This finding demonstrates the potential of using voice analysis as a non-invasive method to measure mental workload and cognitive stress. The high accuracy of this approach could lead to applications in various fields, such as monitoring cognitive fatigue in high-stress occupations, optimizing learning environments, and improving human-machine interfaces.'
  },
  {
    image: 'https://fin4vyigxmq2nrbp.public.blob.vercel-storage.com/00032-1894949392-min-zKuTSJBUwDoxBb1ysCYYrdbgwowciF.png',
    title: 'ML Analyzes Speech and Cognitive Load',
    description: 'Machine Learning analysis is an efficient way to measure the relationship between speech features and cognitive load.',
    content: 'In April 2019, researchers demonstrated that Machine Learning analysis is an efficient way to measure the relationship between speech features and cognitive load. This study highlights the potential of AI-driven speech analysis in understanding human cognitive processes. By identifying correlations between specific speech patterns and mental workload, this approach could lead to more accurate and less intrusive methods of assessing cognitive states in real-time, with applications in fields such as workplace safety, driver alertness monitoring, and adaptive learning systems.'
  },
  {
    image: 'https://fin4vyigxmq2nrbp.public.blob.vercel-storage.com/00033-1894949393-min-6EF5ToCeceuHDlfcUwxm3F9N4h9fpX.png',
    title: 'NLP Captures Noncognitive Traits',
    description: 'Natural Language Processing predictive models can capture noncognitive traits, like Intrinsic Motivation, with a precision of 90% (0.90 AUC Score).',
    content: 'A March 2019 study revealed that Natural Language Processing predictive models can capture noncognitive traits, such as Intrinsic Motivation, with a precision of 90% (0.90 AUC Score). This breakthrough in NLP technology demonstrates its potential to assess complex psychological constructs through language analysis. The ability to accurately measure noncognitive traits using automated systems could have far-reaching implications in fields like education, career counseling, and personal development, offering new ways to understand and nurture human potential.'
  }
]

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

  const initScene = useCallback(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    sceneRef.current = scene
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    cameraRef.current = camera
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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

    const textureLoader = new THREE.TextureLoader()
    textureLoader.setPath('/images/') // Make sure images are in the public folder

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

      textureLoader.load(
        item.image,
        (texture) => {
          plane.material.map = texture
          plane.material.needsUpdate = true
          if (i === galleryData.length - 1) setIsLoading(false)
        },
        undefined,
        (error) => console.error('An error occurred loading the texture', error)
      )
    })

    // Background layer (floating particles)
    const particleCount = 100

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

    const clock = new THREE.Clock()

    function animate() {
      requestAnimationFrame(animate)

      const delta = clock.getDelta()
      controls.update(delta)

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

    const animationFrameId = requestAnimationFrame(animate)

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

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && selectedImage !== null) {
        setSelectedImage(null);
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onMouseClick)
      window.removeEventListener('keydown', handleKeyDown)
      cancelAnimationFrame(animationFrameId)
    }
  }, [selectedImage])

  useEffect(() => {
    initScene()
  }, [initScene])

  const handleCloseFullPage = () => {
    setSelectedImage(null)
  }

  const handlePrevImage = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : galleryData.length - 1))
  }

  const handleNextImage = () => {
    setCurrentIndex((prev) => (prev < galleryData.length - 1 ? prev + 1 : 0))
  }

  return (
    <AnimatePresence>
      <div className="h-[300vh] bg-gray-100">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <p className="text-2xl font-bold">Loading...</p>
          </div>
        )}
        <div className="fixed inset-0">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
        <header className="fixed top-0 left-0 right-0 p-4 bg-white bg-opacity-80">
          <h1 className="text-3xl font-bold text-center">PEAK AI</h1>
        </header>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-black bg-opacity-80 text-white"
          >
            <h2 className="text-2xl font-bold">{galleryData[currentIndex].title}</h2>
            <p>{galleryData[currentIndex].description}</p>
          </motion.div>
        </AnimatePresence>
        <div className="fixed bottom-4 right-4 bg-white bg-opacity-80 p-2 rounded">
          <p className="text-sm">スクロールしてナビゲート</p>
        </div>
        <div className="fixed bottom-4 left-4 flex space-x-2">
          <button
            onClick={handlePrevImage}
            className="bg-white bg-opacity-80 p-2 rounded"
            aria-label="Previous image"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNextImage}
            className="bg-white bg-opacity-80 p-2 rounded"
            aria-label="Next image"
          >
            <ChevronRight />
          </button>
        </div>
        <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[#fd682c] z-50 overflow-auto"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  )
}