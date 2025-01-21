"use client"

import { useState, useRef, useEffect } from "react"
import { Eye, Fingerprint, Hand, Camera, Upload, X } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Alert, AlertDescription } from "~/components/ui/alert"
import CropModal from "./CropModal"

interface ImageCaptureProps {
  onCapture: (imageData: string) => void
  onRecapture: () => void
  label: string
  imageSrc: string
  icon: "eye" | "fingerprint" | "hand"
}

const icons = {
  eye: Eye,
  fingerprint: Fingerprint,
  hand: Hand,
}

const sampleImages = {
  eye: "//sample-eye.png",
  nail: "/sample-nail.png",
  palm: "/sample-palm.png",
}

export default function ImageCapture({ onCapture, onRecapture, label, imageSrc, icon }: ImageCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const IconComponent = icons[icon]
  const sampleImageSrc = sampleImages[icon as keyof typeof sampleImages]

  useEffect(() => {
    if (isCapturing) {
      startCamera()
    } else {
      stopCamera()
    }
    return () => {
      stopCamera()
    }
  }, [isCapturing])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
      setError(null)
    } catch (err) {
      console.error("Error accessing the camera", err)
      setError("Unable to access the camera. Please make sure you've granted camera permissions.")
      setIsCapturing(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    streamRef.current = null
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageData = canvasRef.current.toDataURL("image/jpeg")
        setTempImageSrc(imageData)
        setShowCropModal(true)
        setIsCapturing(false)
      }
    }
  }

  const handleRecapture = () => {
    onRecapture()
    setIsCapturing(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setTempImageSrc(imageData)
        setShowCropModal(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleCropComplete = (croppedImageData: string) => {
    onCapture(croppedImageData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <IconComponent className="h-6 w-6 text-teal-600" />
          <span>{label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!imageSrc ? (
            <>
              {isCapturing ? (
                <>
                  <div className="relative">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-48 bg-gray-200 rounded-lg" />
                    <Button onClick={captureImage} className="absolute bottom-2 right-2">
                      <Camera className="h-4 w-4 mr-2" />
                      Capture
                    </Button>
                  </div>
                  <Button onClick={() => setIsCapturing(false)} variant="outline" className="w-full">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <Button onClick={() => setIsCapturing(true)} variant="outline" className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                  <Button onClick={triggerFileUpload} variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Sample {label} image:</p>
                <img
                  src={sampleImageSrc || "/placeholder.svg"}
                  alt={`Sample ${label}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            </>
          ) : (
            <div className="relative w-full h-48">
              <img
                src={imageSrc || "/placeholder.svg"}
                alt={`Captured ${label}`}
                className="w-full h-full object-contain rounded-lg"
              />
              <Button onClick={handleRecapture} variant="outline" className="absolute bottom-2 right-2">
                <Camera className="h-4 w-4 mr-2" />
                Recapture
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <CropModal
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        imageSrc={tempImageSrc || ""}
        onCropComplete={handleCropComplete}
      />
    </Card>
  )
}

