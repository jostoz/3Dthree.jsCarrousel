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
    title: '日食の瞬間',
    description: '丘の上に立つ孤独な人物が、畏敬の念を抱かせる日食の光景を目撃しています。',
    content: '人々は、自分の意見を村度なく言える場所として重宝にし、また自身の発言に共感が集まることを体験し自己肯定感を高めていった。これまで承認欲求を満たされず、リアルな場では時に寡黙し、心を閉ざしがちだったこともあるような人が、その居心地の良い場を見つけ表現を重ねたくなったことについては、ソーシャルメディアの価値も評価されるべきだろう。しかし、何事も過ぎれば害となる。その居心地の良さに胡坐(あぐら)をかき、好き放題してしまうと特有のベネフィットはいずれ消失してしまう。要はバランスが大切だということ。リアルの懸念をデジタル上で発散しても、リアルの問題は解決しない。言い放って気分が幾分晴れたとしても、それが起因となってリアルに向かい合う機会を阻害することになる。いつしかリアルな接点を一切求めなくなるようなことさえ起きてしまいそうだ。'
  },
  {
    image: 'https://fin4vyigxmq2nrbp.public.blob.vercel-storage.com/00011-950881084-min-Fab5OfmUCuRpxVWSVFkVkqOG4T0aU6.png',
    title: '月の顔',
    description: '人間の顔と月のテクスチャーや色彩が融合したシュールな肖像画。',
    content: 'さて、突然のコロナ禍で日常生活に入り込んできたリモートワーク。在宅勤務や外出自粛のおかげでECサイトは軒並み好調だという。ボタン一つで何でも手に入る、店舗に行って商品の説明を聞かなくても、サイトのレビューを読めば何となくクオリティもわかるとなれば、実店舗を訪れる必要性も薄れてくるのは仕方がない。面白いのは洋服や靴など、「実際に試着してみないとちょっと買えないよね」と思いそうなものでさえ、普通にECでやりとりされていること。「その素材の質感や着心地、履き心地などはやはりリアルでなければ」とも思うのだがそうでもないらしい。そんな生活者の認識や行動を背景に、危機を迎えた中国の靴店がある。創業167年の老舗靴店「ニーアリンジャン」だ。過去には毛沢東も顧客であったという。しかしこのコロナ禍でご多分に漏れず、北京当局の検疫措置により店頭営業が禁止されてしまう。長い歴史でこれまで培った店舗営業や接客ノウハウがある日、突然封印されてしまったのだ。通常であれば途方に暮れるが、彼らは強かった。まるで経験のない、オンラインで顧客と繋がる「ライブコマース」に打って出たのだ。'
  },
  {
    image: 'https://fin4vyigxmq2nrbp.public.blob.vercel-storage.com/00014-3792969356-min-JVYldqamJ5BUsz8qjsSOlbGTXJ9Wqr.png',
    title: '幻想的な和装',
    description: '夢のような色彩豊かな雰囲気に包まれた、伝統的な和装を着た若い女性。',
    content: '人々は、自分の意見を村度なく言える場所として重宝にし、また自身の発言に共感が集まることを体験し自己肯定感を高めていった。これまで承認欲求を満たされず、リアルな場では時に寡黙し、心を閉ざしがちだったこともあるような人が、その居心地の良い場を見つけ表現を重ねたくなったことについては、ソーシャルメディアの価値も評価されるべきだろう。しかし、何事も過ぎれば害となる。その居心地の良さに胡坐(あぐら)をかき、好き放題してしまうと特有のベネフィットはいずれ消失してしまう。要はバランスが大切だということ。リアルの懸念をデジタル上で発散しても、リアルの問題は解決しない。言い放って気分が幾分晴れたとしても、それが起因となってリアルに向かい合う機会を阻害することになる。いつしかリアルな接点を一切求めなくなるようなことさえ起きてしまいそうだ。'
  },
  {
    image: 'https://fin4vyigxmq2nrbp.public.blob.vercel-storage.com/00019-2612175235-min-lQADKHJ9EbUEP9OTVVLayqoraYqMKs.png',
    title: '時の舞',
    description: '複雑な時計仕掛けと金色の色調に囲まれた、芸者の抽象的な表現。',
    content: 'さて、突然のコロナ禍で日常生活に入り込んできたリモートワーク。在宅勤務や外出自粛のおかげでECサイトは軒並み好調だという。ボタン一つで何でも手に入る、店舗に行って商品の説明を聞かなくても、サイトのレビューを読めば何となくクオリティもわかるとなれば、実店舗を訪れる必要性も薄れてくるのは仕方がない。面白いのは洋服や靴など、「実際に試着してみないとちょっと買えないよね」と思いそうなものでさえ、普通にECでやりとりされていること。「その素材の質感や着心地、履き心地などはやはりリアルでなければ」とも思うのだがそうでもないらしい。そんな生活者の認識や行動を背景に、危機を迎えた中国の靴店がある。創業167年の老舗靴店「ニーアリンジャン」だ。過去には毛沢東も顧客であったという。しかしこのコロナ禍でご多分に漏れず、北京当局の検疫措置により店頭営業が禁止されてしまう。長い歴史でこれまで培った店舗営業や接客ノウハウがある日、突然封印されてしまったのだ。通常であれば途方に暮れるが、彼らは強かった。まるで経験のない、オンラインで顧客と繋がる「ライブコマース」に打って出たのだ。'
  },
  {
    image: 'https://fin4vyigxmq2nrbp.public.blob.vercel-storage.com/00030-1894949390-min-vfv8Q8XkOZ4ffv2wK5ViSS4HjzNRHF.png',
    title: '和の宇宙',
    description: '宇宙的なパターンと日本の伝統的なモチーフを背景に、華やかな着物を着た芸者。',
    content: '人々は、自分の意見を村度なく言える場所として重宝にし、また自身の発言に共感が集まることを体験し自己肯定感を高めていった。これまで承認欲求を満たされず、リアルな場では時に寡黙し、心を閉ざしがちだったこともあるような人が、その居心地の良い場を見つけ表現を重ねたくなったことについては、ソーシャルメディアの価値も評価されるべきだろう。しかし、何事も過ぎれば害となる。その居心地の良さに胡坐(あぐら)をかき、好き放題してしまうと特有のベネフィットはいずれ消失してしまう。要はバランスが大切だということ。リアルの懸念をデジタル上で発散しても、リアルの問題は解決しない。言い放って気分が幾分晴れたとしても、それが起因となってリアルに向かい合う機会を阻害することになる。いつしかリアルな接点を一切求めなくなるようなことさえ起きてしまいそうだ。'
  },
  {
    image: 'https://fin4vyigxmq2nrbp.public.blob.vercel-storage.com/00032-1894949392-min-zKuTSJBUwDoxBb1ysCYYrdbgwowciF.png',
    title: '紅の舞',
    description: '鮮やかな赤い着物を着た芸者が、抽象的なパターンと伝統的なモチーフの渦の中で舞っています。',
    content: 'さて、突然のコロナ禍で日常生活に入り込んできたリモートワーク。在宅勤務や外出自粛のおかげでECサイトは軒並み好調だという。ボタン一つで何でも手に入る、店舗に行って商品の説明を聞かなくても、サイトのレビューを読めば何となくクオリティもわかるとなれば、実店舗を訪れる必要性も薄れてくるのは仕方がない。面白いのは洋服や靴など、「実際に試着してみないとちょっと買えないよね」と思いそうなものでさえ、普通にECでやりとりされていること。「その素材の質感や着心地、履き心地などはやはりリアルでなければ」とも思うのだがそうでもないらしい。そんな生活者の認識や行動を背景に、危機を迎えた中国の靴店がある。創業167年の老舗靴店「ニーアリンジャン」だ。過去には毛沢東も顧客であったという。しかしこのコロナ禍でご多分に漏れず、北京当局の検疫措置により店頭営業が禁止されてしまう。長い歴史でこれまで培った店舗営業や接客ノウハウがある日、突然封印されてしまったのだ。通常であれば途方に暮れるが、彼らは強かった。まるで経験のない、オンラインで顧客と繋がる「ライブコマース」に打って出たのだ。'
  },
  {
    image: 'https://fin4vyigxmq2nrbp.public.blob.vercel-storage.com/00033-1894949393-min-6EF5ToCeceuHDlfcUwxm3F9N4h9fpX.png',
    title: '花火の影',
    description: '鮮やかで抽象的な花火を背景に、日傘を持つ芸者のシルエットが浮かび上がっています。',
    content: '人々は、自分の意見を村度なく言える場所として重宝にし、また自身の発言に共感が集まることを体験し自己肯定感を高めていった。これまで承認欲求を満たされず、リアルな場では時に寡黙し、心を閉ざしがちだったこともあるような人が、その居心地の良い場を見つけ表現を重ねたくなったことについては、ソーシャルメディアの価値も評価されるべきだろう。しかし、何事も過ぎれば害となる。その居心地の良さに胡坐(あぐら)をかき、好き放題してしまうと特有のベネフィットはいずれ消失してしまう。要はバランスが大切だということ。リアルの懸念をデジタル上で発散しても、リアルの問題は解決しない。言い放って気分が幾分晴れたとしても、それが起因となってリアルに向かい合う機会を阻害することになる。いつしかリアルな接点を一切求めなくなるようなことさえ起きてしまいそうだ。'
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

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('click', onMouseClick)
    }
  }, [])

  const handleCloseFullPage = () => {
    setSelectedImage(null)
  }

  return (
    <div className="h-[300vh] bg-gray-100">
      <div className="fixed inset-0">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      <div className="fixed top-0 left-0 right-0 p-4 bg-white bg-opacity-80">
        <h1 className="text-3xl font-bold text-center">LIONS GOOD NEWS 2023</h1>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black bg-opacity-80 text-white">
        <h2 className="text-2xl font-bold">{galleryData[currentIndex].title}</h2>
        <p>{galleryData[currentIndex].description}</p>
      </div>
      <div className="fixed bottom-4 right-4 bg-white bg-opacity-80 p-2 rounded">
        <p className="text-sm">スクロールしてナビゲート</p>
      </div>
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-[#FF6B6B] z-50 overflow-auto">
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