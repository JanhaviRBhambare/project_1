"use client"

import { useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"
import ImageCapture from "./ImageCapture"
import ResultDisplay from "./ResultDisplay"

type BodyPart = "eye" | "nail" | "palm"

export default function AnemiaTester() {
  const [images, setImages] = useState<Record<BodyPart, string>>({
    eye: "",
    nail: "",
    palm: "",
  })
  const [result, setResult] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleImageCapture = (part: BodyPart, imageData: string) => {
    setImages((prev) => ({ ...prev, [part]: imageData }))
  }

  const handleRecapture = (part: BodyPart) => {
    setImages((prev) => ({ ...prev, [part]: "" }))
  }

  const analyzeImages = async () => {
    setIsAnalyzing(true)
    // In a real application, you would send the images to a backend service
    // Here, we're just simulating a response
    await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing time
    const mockResult = Math.floor(Math.random() * 101) // Random percentage between 0 and 100
    setResult(mockResult)
    setIsAnalyzing(false)
  }

  const allImagesCaptured = Object.values(images).every(Boolean)

  return (
    <div className="space-y-8">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          This test is for screening purposes only and does not replace professional medical diagnosis.
        </AlertDescription>
      </Alert>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Instructions</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Capture or upload clear images of your eye, fingernail, and palm.</li>
          <li>Ensure good lighting and a steady hand for best results.</li>
          <li>Use the sample images as a guide for proper positioning.</li>
          <li>Crop each image to focus on the relevant area.</li>
          <li>Once all images are captured, click "Analyze Images" for results.</li>
        </ol>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ImageCapture
          onCapture={(img) => handleImageCapture("eye", img)}
          onRecapture={() => handleRecapture("eye")}
          label="Eye"
          imageSrc={images.eye}
          icon="eye"
        />
        <ImageCapture
          onCapture={(img) => handleImageCapture("nail", img)}
          onRecapture={() => handleRecapture("nail")}
          label="Nail"
          imageSrc={images.nail}
          icon="fingerprint"
        />
        <ImageCapture
          onCapture={(img) => handleImageCapture("palm", img)}
          onRecapture={() => handleRecapture("palm")}
          label="Palm"
          imageSrc={images.palm}
          icon="hand"
        />
      </div>
      <div className="flex justify-center">
        <Button onClick={analyzeImages} disabled={!allImagesCaptured || isAnalyzing} className="px-6 py-2 text-lg">
          {isAnalyzing ? "Analyzing..." : "Analyze Images"}
        </Button>
      </div>
      {result !== null && <ResultDisplay percentage={result} />}
    </div>
  )
}

