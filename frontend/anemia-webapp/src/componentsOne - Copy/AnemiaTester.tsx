'use client'

import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"
import ImageCapture from './ImageCapture'
import ResultDisplay from './ResultDisplay'


type BodyPart = 'eye' | 'nail' | 'palm'

export default function AnemiaTester() {
  const [images, setImages] = useState<Record<BodyPart, string | null>>({
    eye: null,
    nail: null,
    palm: null,
  })
  const [result, setResult] = useState<number | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleImageCapture = (part: BodyPart, imageData: string) => {
    setImages(prev => ({ ...prev, [part]: imageData }))
  }

  const handleRecapture = (part: BodyPart) => {
    setImages(prev => ({ ...prev, [part]: null }))
  }

  const analyzeImages = async () => {
    if (!images.eye || !images.nail || !images.palm) return;
  
    setIsAnalyzing(true);
  
    // Convert base64 image data to a blob for API request
    const formData = new FormData();
    formData.append("file_palm", dataURLtoBlob(images.palm), "palm.jpg");
    formData.append("file_nail", dataURLtoBlob(images.nail), "nail.jpg");
    formData.append("file_eye", dataURLtoBlob(images.eye), "eye.jpg");
  
    try {
      const response = await fetch("http://localhost:8001/predict", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to analyze images.");
      }
  
      const data = await response.json();
      console.log(data); // Debug response
      setResult(data.combined_confidence * 100); // Convert to percentage
    } catch (error) {
      console.error("Error analyzing images:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Utility to convert base64 to Blob
  const dataURLtoBlob = (dataURL: string): Blob => {
    const [header, base64Data] = dataURL.split(",");
    const mimeMatch = header?.match(/:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const binary = atob(base64Data);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: mimeType });
  };
  

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ImageCapture 
          onCapture={(img) => handleImageCapture('eye', img)} 
          onRecapture={() => handleRecapture('eye')}
          label="Eye" 
          imageSrc={images.eye}
          icon="eye"
        />
        <ImageCapture 
          onCapture={(img) => handleImageCapture('nail', img)} 
          onRecapture={() => handleRecapture('nail')}
          label="Nail" 
          imageSrc={images.nail}
          icon="fingerprint"
        />
        <ImageCapture 
          onCapture={(img) => handleImageCapture('palm', img)} 
          onRecapture={() => handleRecapture('palm')}
          label="Palm" 
          imageSrc={images.palm}
          icon="hand"
        />
      </div>
      <div className="flex justify-center">
        <Button
          onClick={analyzeImages}
          disabled={!allImagesCaptured || isAnalyzing}
          className="px-6 py-2 text-lg"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Images"}
        </Button>
      </div>
      {result !== null && <ResultDisplay percentage={result} />}
    </div>
  )
}

