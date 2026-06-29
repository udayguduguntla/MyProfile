'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Activity,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Github,
  ImagePlus,
  Leaf,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { portfolioData } from '@/data/portfolio'
import InteractiveStarBackground from '@/app/components/InteractiveStarBackground'
import ModernNavigation from '@/app/components/ModernNavigation'

type Project = (typeof portfolioData.projects)[number]

type PlantAnalysis = {
  status: 'success' | 'error'
  message?: string
  diagnosis?: string
  confidence?: number
  percentages?: {
    healthy: number
    chlorosis: number
    necrosis: number
    mildew: number
  }
  recommendation?: {
    title: string
    npk: string
    organic: string
    chemical: string
    schedule: string
    tips: string
  }
  treatment?: string
}

type PlateAnalysis = {
  status: 'success' | 'warning'
  confidence: number
  region: { x: number; y: number; width: number; height: number }
  plateText: string
  message: string
}

const demoCopy: Record<string, {
  eyebrow: string
  title: string
  summary: string
  primaryMetric: string
  secondaryMetric: string
  accent: string
}> = {
  'plant-doctor': {
    eyebrow: 'Plant health diagnostic preview',
    title: 'Leaf analysis and fertilizer recommendation workspace',
    summary:
      'Upload a leaf image, inspect tissue composition, and review organic or chemical treatment suggestions in one focused interface.',
    primaryMetric: '4 tissue classes',
    secondaryMetric: 'NPK guidance',
    accent: 'from-emerald-300/24 via-violet-400/16 to-fuchsia-400/10',
  },
  'license-plate-reader': {
    eyebrow: 'ANPR vision preview',
    title: 'License plate detection and OCR review console',
    summary:
      'Inspect the original image, detected plate crop, OCR confidence, and extracted text without leaving the portfolio experience.',
    primaryMetric: 'OCR pipeline',
    secondaryMetric: 'Image annotation',
    accent: 'from-cyan-300/24 via-violet-400/16 to-purple-500/10',
  },
  'license-plate-recognition': {
    eyebrow: 'License plate detection preview',
    title: 'Vehicle plate localization and OCR workspace',
    summary:
      'Upload a vehicle image, preview the likely plate region, and review the OpenCV/Tesseract pipeline result area in the same portfolio interface.',
    primaryMetric: 'Contour pipeline',
    secondaryMetric: 'OCR ready',
    accent: 'from-cyan-300/24 via-violet-400/16 to-purple-500/10',
  },
}

function getDemo(project: Project) {
  return (
    demoCopy[project.id] ?? {
      eyebrow: `${project.category} demo preview`,
      title: `${project.title} interactive overview`,
      summary:
        'A portfolio-native preview of the project workflow, technical shape, and expected user-facing experience.',
      primaryMetric: project.status === 'completed' ? 'Completed' : 'In progress',
      secondaryMetric: `${project.technologies.length} tools`,
      accent: 'from-fuchsia-300/20 via-violet-400/16 to-cyan-300/10',
    }
  )
}

export default function ProjectDemoPage() {
  const params = useParams()
  const projectId = params?.id as string
  const project = portfolioData.projects.find((item) => item.id === projectId)

  if (!project) {
    return (
      <div className="min-h-screen relative pt-24 pb-16">
        <InteractiveStarBackground variant="projects" />
        <ModernNavigation />
        <main className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-bold text-white">Demo Not Found</h1>
          <p className="mt-4 text-white/70">This project demo is not available.</p>
          <Link href="/projects" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-purple-950">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </main>
      </div>
    )
  }

  const demo = getDemo(project)

  return (
    <div className="min-h-screen relative pt-24 pb-16">
      <InteractiveStarBackground variant="projects" />
      <ModernNavigation />

      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8"
        >
          <Link href={`/projects/${project.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Project details
          </Link>
        </motion.div>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-2xl border border-white/12 bg-white/[0.07] p-6 shadow-2xl shadow-purple-950/20 backdrop-blur-2xl sm:p-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-sm font-medium text-purple-100">
              <Sparkles className="h-4 w-4" />
              {demo.eyebrow}
            </span>
            <h1 className="mt-6 text-3xl font-bold text-white sm:text-5xl">{demo.title}</h1>
            <p className="mt-5 text-base leading-8 text-white/72">{demo.summary}</p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <Metric label="Project state" value={demo.primaryMetric} />
              <Metric label="Interface focus" value={demo.secondaryMetric} />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/14 bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/18"
              >
                <Github className="h-4 w-4" />
                Source Code
              </a>
              <a
                href={`/projects/${project.id}`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-purple-950 shadow-lg shadow-purple-950/15 transition hover:translate-y-[-1px]"
              >
                <ExternalLink className="h-4 w-4" />
                Case Study
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className={`rounded-2xl border border-white/12 bg-gradient-to-br ${demo.accent} p-4 shadow-2xl shadow-purple-950/20 backdrop-blur-2xl sm:p-6`}
          >
            {project.id === 'plant-doctor' ? <PlantPreview project={project} /> : project.id === 'license-plate-reader' || project.id === 'license-plate-recognition' ? <PlatePreview project={project} /> : <GenericPreview project={project} />}
          </motion.div>
        </section>
      </main>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.08] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">{label}</p>
      <p className="mt-2 text-lg font-bold text-white">{value}</p>
    </div>
  )
}

function PlantPreview({ project }: { project: Project }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  const handleImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (imageUrl) URL.revokeObjectURL(imageUrl)
    const nextUrl = URL.createObjectURL(file)
    setImageUrl(nextUrl)
    setFileName(file.name)
    setIsAnalyzing(true)

    try {
      const result = await analyzePlantImage(nextUrl)
      setAnalysis(result)
    } catch {
      setAnalysis({
        status: 'error',
        message: 'Could not read this image. Please try a JPG, PNG, WebP, or another clear image file.',
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    setImageUrl(null)
    setFileName('')
    setAnalysis(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const percentages = analysis?.percentages ?? {
    healthy: 62,
    chlorosis: 21,
    necrosis: 11,
    mildew: 6,
  }

  return (
    <div className="rounded-2xl border border-white/12 bg-black/18 p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-100">Plant Doctor</p>
          <p className="text-xs text-white/52">HSV segmentation preview</p>
        </div>
        <Leaf className="h-6 w-6 text-emerald-200" />
      </div>

      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-72 overflow-hidden rounded-2xl border border-dashed border-white/18 bg-white/[0.07]">
          {imageUrl ? (
            <>
              <img src={imageUrl} alt={fileName || 'Uploaded leaf'} className="h-full min-h-72 w-full object-cover" />
              <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/14 bg-black/55 p-3 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{fileName}</p>
                    <p className="text-xs text-white/58">{isAnalyzing ? 'Analyzing leaf colors...' : 'Image uploaded'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={resetImage}
                    className="rounded-lg border border-white/14 bg-white/10 p-2 text-white transition hover:bg-white/18"
                    aria-label="Remove uploaded image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex min-h-72 w-full flex-col items-center justify-center p-6 text-center transition hover:bg-white/[0.05]"
            >
              <Upload className="h-10 w-10 text-white/78" />
              <p className="mt-4 font-semibold text-white">Upload a leaf image</p>
              <p className="mt-2 text-sm leading-6 text-white/58">Runs a browser version of the HSV segmentation used in the Python project.</p>
            </button>
          )}
          <input ref={inputRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
        </div>

        <div className="space-y-3">
          <HealthBar label="Healthy tissue" value={`${percentages.healthy}%`} tone="bg-emerald-300" />
          <HealthBar label="Chlorosis" value={`${percentages.chlorosis}%`} tone="bg-yellow-300" />
          <HealthBar label="Necrosis" value={`${percentages.necrosis}%`} tone="bg-amber-600" />
          <HealthBar label="Powdery mildew" value={`${percentages.mildew}%`} tone="bg-slate-200" />
          <div className="rounded-2xl border border-white/12 bg-white/[0.08] p-4">
            <p className="flex items-center gap-2 font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-emerald-200" />
              {analysis?.status === 'success' ? analysis.diagnosis : 'Recommendation'}
            </p>
            {analysis?.status === 'error' ? (
              <p className="mt-2 text-sm leading-6 text-amber-100">{analysis.message}</p>
            ) : (
              <>
                <p className="mt-2 text-sm leading-6 text-white/64">
                  {analysis?.recommendation?.tips ?? 'Balanced NPK support, neem oil treatment, and improved airflow based on detected stress patterns.'}
                </p>
                {analysis?.recommendation && (
                  <div className="mt-3 rounded-xl border border-white/10 bg-black/18 p-3 text-sm text-white/68">
                    <p className="font-semibold text-white">{analysis.recommendation.title}</p>
                    <p className="mt-1">NPK: {analysis.recommendation.npk}</p>
                    <p className="mt-1">{analysis.recommendation.schedule}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <FeatureStrip project={project} />
    </div>
  )
}

function PlatePreview({ project }: { project: Project }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')
  const [analysis, setAnalysis] = useState<PlateAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  const handleImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (imageUrl) URL.revokeObjectURL(imageUrl)
    const nextUrl = URL.createObjectURL(file)
    setImageUrl(nextUrl)
    setFileName(file.name)
    setIsAnalyzing(true)

    try {
      const result = await analyzePlateImage(nextUrl)
      setAnalysis(result)
    } catch {
      setAnalysis({
        status: 'warning',
        confidence: 42,
        region: { x: 24, y: 40, width: 52, height: 20 },
        plateText: 'OCR handled by Python',
        message: 'The browser preview could not inspect this image. The Python project uses OpenCV and Tesseract for the full OCR pipeline.',
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    setImageUrl(null)
    setFileName('')
    setAnalysis(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="rounded-2xl border border-white/12 bg-black/18 p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-cyan-100">License Plate Reader</p>
          <p className="text-xs text-white/52">Detection and OCR preview</p>
        </div>
        <ScanLine className="h-6 w-6 text-cyan-200" />
      </div>

      <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-72 overflow-hidden rounded-2xl border border-white/12 bg-slate-950/50">
          {imageUrl ? (
            <>
              <img src={imageUrl} alt={fileName || 'Uploaded vehicle'} className="h-full min-h-72 w-full object-cover opacity-90" />
              {analysis && (
                <div
                  className="absolute rounded-md border-2 border-cyan-200 bg-cyan-300/10 shadow-lg shadow-cyan-500/25"
                  style={{
                    left: `${analysis.region.x}%`,
                    top: `${analysis.region.y}%`,
                    width: `${analysis.region.width}%`,
                    height: `${analysis.region.height}%`,
                  }}
                />
              )}
              <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/14 bg-black/55 p-3 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{fileName}</p>
                    <p className="text-xs text-white/58">{isAnalyzing ? 'Locating plate region...' : analysis?.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={resetImage}
                    className="rounded-lg border border-white/14 bg-white/10 p-2 text-white transition hover:bg-white/18"
                    aria-label="Remove uploaded image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex min-h-72 w-full flex-col items-center justify-center p-6 text-center transition hover:bg-white/[0.05]"
            >
              <Upload className="h-10 w-10 text-white/78" />
              <p className="mt-4 font-semibold text-white">Upload a vehicle image</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/58">Detects a likely plate area in-browser. The source project uses OpenCV and Tesseract for production OCR.</p>
            </button>
          )}
          <input ref={inputRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
        </div>
        <div className="space-y-3">
          <StatusRow icon={CheckCircle2} label="Plate detected" value={analysis ? `${analysis.confidence}% confidence` : 'Waiting for upload'} />
          <StatusRow icon={BarChart3} label="OCR result" value={analysis?.plateText ?? 'Upload to preview'} />
          <StatusRow icon={ImagePlus} label="Formats" value="JPG, PNG, WebP" />
          <div className="rounded-2xl border border-white/12 bg-white/[0.08] p-4">
            <p className="text-sm leading-6 text-white/64">
              {analysis?.message ?? 'This demo page shows the product experience without making visitors download the Streamlit source.'}
            </p>
          </div>
        </div>
      </div>

      <FeatureStrip project={project} />
    </div>
  )
}

function GenericPreview({ project }: { project: Project }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-black/18 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {project.features.slice(0, 4).map((feature) => (
          <div key={feature} className="rounded-2xl border border-white/12 bg-white/[0.08] p-4">
            <CheckCircle2 className="mb-4 h-5 w-5 text-purple-200" />
            <p className="text-sm leading-6 text-white/72">{feature}</p>
          </div>
        ))}
      </div>
      <FeatureStrip project={project} />
    </div>
  )
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

function rgbToOpenCvHsv(red: number, green: number, blue: number) {
  const r = red / 255
  const g = green / 255
  const b = blue / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let hue = 0
  if (delta !== 0) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6)
    else if (max === g) hue = 60 * ((b - r) / delta + 2)
    else hue = 60 * ((r - g) / delta + 4)
  }

  if (hue < 0) hue += 360

  return {
    h: hue / 2,
    s: max === 0 ? 0 : (delta / max) * 255,
    v: max * 255,
  }
}

function isBetween(value: number, lower: number, upper: number) {
  return value >= lower && value <= upper
}

async function analyzePlantImage(src: string): Promise<PlantAnalysis> {
  const image = await loadImage(src)
  const canvas = document.createElement('canvas')
  const size = 420
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Canvas unavailable')

  context.drawImage(image, 0, 0, size, size)
  const pixels = context.getImageData(0, 0, size, size).data

  let greenArea = 0
  let yellowArea = 0
  let brownArea = 0
  let whiteArea = 0

  for (let index = 0; index < pixels.length; index += 4) {
    const { h, s, v } = rgbToOpenCvHsv(pixels[index], pixels[index + 1], pixels[index + 2])

    if (isBetween(h, 35, 85) && isBetween(s, 25, 255) && isBetween(v, 25, 255)) greenArea += 1
    if (isBetween(h, 18, 34) && isBetween(s, 30, 255) && isBetween(v, 40, 255)) yellowArea += 1
    if (
      (isBetween(h, 0, 17) || isBetween(h, 170, 180)) &&
      isBetween(s, 25, 255) &&
      isBetween(v, 20, 160)
    ) {
      brownArea += 1
    }
    if (isBetween(h, 0, 180) && isBetween(s, 0, 30) && isBetween(v, 160, 255)) whiteArea += 1
  }

  const leafArea = greenArea + yellowArea + brownArea + whiteArea
  const leafPercentage = (leafArea / (size * size)) * 100

  if (leafPercentage < 5) {
    return {
      status: 'error',
      message: 'No strong plant foliage colors were detected. Try a close-up leaf image against a simple background.',
    }
  }

  const healthy = roundPercent((greenArea / leafArea) * 100)
  const chlorosis = roundPercent((yellowArea / leafArea) * 100)
  const necrosis = roundPercent((brownArea / leafArea) * 100)
  const mildew = roundPercent((whiteArea / leafArea) * 100)

  if (necrosis >= 2 && necrosis >= Math.max(chlorosis * 0.8, mildew)) {
    return {
      status: 'success',
      diagnosis: 'Fungal Leaf Spot / Early Blight',
      confidence: Math.min(98, roundPercent(60 + necrosis * 3.5)),
      percentages: { healthy, chlorosis, necrosis, mildew },
      recommendation: {
        title: 'Root Recover & Stress Relief Feed',
        npk: '5-10-10',
        organic: 'Bone meal and greensand. Avoid fresh manure.',
        chemical: 'Low-nitrogen starter or recovery fertilizer.',
        schedule: 'Apply after pruning diseased tissue, then repeat in 4 weeks.',
        tips: 'Avoid excess nitrogen and keep foliage dry. High potassium helps strengthen cell walls.',
      },
      treatment: 'Use neem oil or copper fungicide and prune infected lower leaves.',
    }
  }

  if (chlorosis >= 6 && chlorosis >= Math.max(necrosis * 0.8, mildew)) {
    return {
      status: 'success',
      diagnosis: 'Foliar Chlorosis',
      confidence: Math.min(98, roundPercent(55 + chlorosis * 2.8)),
      percentages: { healthy, chlorosis, necrosis, mildew },
      recommendation: {
        title: 'Chlorophyll Restoration Plan',
        npk: '12-4-8 or 15-5-10',
        organic: 'Blood meal, alfalfa meal, or liquid fish emulsion.',
        chemical: 'High-nitrogen fertilizer with chelated trace elements.',
        schedule: 'Apply nitrogen support and use chelated iron if deficiency is likely.',
        tips: 'Check soil pH and drainage. High pH can lock up iron and make leaves yellow.',
      },
      treatment: 'Use Epsom salt spray or chelated iron depending on the deficiency pattern.',
    }
  }

  if (mildew >= 2 && mildew >= Math.max(necrosis, chlorosis)) {
    return {
      status: 'success',
      diagnosis: 'Powdery Mildew',
      confidence: Math.min(98, roundPercent(60 + mildew * 4.5)),
      percentages: { healthy, chlorosis, necrosis, mildew },
      recommendation: {
        title: 'Immunity Support Feed',
        npk: '10-10-10',
        organic: 'Compost tea plus kelp extract.',
        chemical: 'Balanced multi-nutrient slow release fertilizer.',
        schedule: 'Apply a standard dose while treating the fungus.',
        tips: 'Keep nitrogen moderate and improve airflow around the plant.',
      },
      treatment: 'Use potassium bicarbonate, diluted milk spray, sulfur, or myclobutanil depending on severity.',
    }
  }

  return {
    status: 'success',
    diagnosis: 'Healthy Leaf',
    confidence: healthy,
    percentages: { healthy, chlorosis, necrosis, mildew },
    recommendation: {
      title: 'Standard Nutrient Maintenance Plan',
      npk: '10-10-10',
      organic: 'Fish emulsion, kelp meal, or cured compost.',
      chemical: 'Balanced slow-release granular fertilizer.',
      schedule: 'Apply every 4 to 6 weeks during active growth.',
      tips: 'Maintain deep watering and good soil aeration.',
    },
    treatment: 'No urgent treatment needed.',
  }
}

async function analyzePlateImage(src: string): Promise<PlateAnalysis> {
  const image = await loadImage(src)
  const canvas = document.createElement('canvas')
  const width = 480
  const height = Math.max(260, Math.round((image.height / image.width) * width))
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Canvas unavailable')

  context.drawImage(image, 0, 0, width, height)
  const data = context.getImageData(0, 0, width, height).data

  let bestScore = -1
  let bestRegion = { x: width * 0.2, y: height * 0.52, width: width * 0.6, height: height * 0.16 }

  const windowWidth = Math.max(120, Math.round(width * 0.34))
  const windowHeight = Math.max(38, Math.round(height * 0.12))
  const stepX = Math.max(16, Math.round(width * 0.04))
  const stepY = Math.max(12, Math.round(height * 0.035))

  for (let y = Math.round(height * 0.25); y < height * 0.82 - windowHeight; y += stepY) {
    for (let x = Math.round(width * 0.05); x < width * 0.95 - windowWidth; x += stepX) {
      const score = scorePlateRegion(data, width, x, y, windowWidth, windowHeight)
      if (score > bestScore) {
        bestScore = score
        bestRegion = { x, y, width: windowWidth, height: windowHeight }
      }
    }
  }

  const confidence = Math.max(38, Math.min(92, Math.round(bestScore * 100)))
  const region = {
    x: roundPercent((bestRegion.x / width) * 100),
    y: roundPercent((bestRegion.y / height) * 100),
    width: roundPercent((bestRegion.width / width) * 100),
    height: roundPercent((bestRegion.height / height) * 100),
  }

  return {
    status: confidence > 52 ? 'success' : 'warning',
    confidence,
    region,
    plateText: confidence > 52 ? 'Plate region found' : 'Needs clearer plate',
    message:
      confidence > 52
        ? 'Likely plate region highlighted. Full character OCR is handled by the Python OpenCV/Tesseract implementation.'
        : 'A strong plate-like region was not found. Try a clearer, front-facing image of the vehicle.',
  }
}

function scorePlateRegion(data: Uint8ClampedArray, imageWidth: number, x: number, y: number, width: number, height: number) {
  let contrast = 0
  let brightPixels = 0
  let samples = 0

  for (let row = y + 1; row < y + height; row += 3) {
    for (let col = x + 1; col < x + width; col += 3) {
      const current = grayscaleAt(data, imageWidth, col, row)
      const left = grayscaleAt(data, imageWidth, col - 1, row)
      const up = grayscaleAt(data, imageWidth, col, row - 1)
      contrast += Math.abs(current - left) + Math.abs(current - up)
      if (current > 155) brightPixels += 1
      samples += 1
    }
  }

  const edgeScore = Math.min(1, contrast / Math.max(1, samples * 90))
  const brightScore = brightPixels / Math.max(1, samples)
  const aspect = width / height
  const aspectScore = Math.max(0, 1 - Math.abs(aspect - 3.1) / 3.1)

  return edgeScore * 0.5 + brightScore * 0.28 + aspectScore * 0.22
}

function grayscaleAt(data: Uint8ClampedArray, imageWidth: number, x: number, y: number) {
  const index = (y * imageWidth + x) * 4
  return data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114
}

function roundPercent(value: number) {
  return Math.round(value * 10) / 10
}

function HealthBar({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.08] p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-white/72">{label}</span>
        <span className="font-semibold text-white">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className={`h-full rounded-full ${tone}`} style={{ width: value }} />
      </div>
    </div>
  )
}

function StatusRow({ icon: Icon, label, value }: { icon: typeof CheckCircle2; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.08] p-4">
      <Icon className="h-5 w-5 text-cyan-200" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{label}</p>
        <p className="mt-1 font-semibold text-white">{value}</p>
      </div>
    </div>
  )
}

function FeatureStrip({ project }: { project: Project }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {project.technologies.slice(0, 5).map((tech) => (
        <span key={tech} className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-xs font-medium text-white/68">
          {tech}
        </span>
      ))}
    </div>
  )
}
