

// 'use client'

// import { useState, useRef, useEffect } from 'react'
// import { Eye, Fingerprint, Hand, Camera, Upload, X } from 'lucide-react'
// import { Button } from '~/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
// import { Alert, AlertDescription } from "~/components/ui/alert"

// interface ImageCaptureProps {
//   onCapture: (imageData: string) => void
//   onRecapture: () => void
//   label: string
//   imageSrc: string | null
//   icon: 'eye' | 'fingerprint' | 'hand'
// }

// const icons = {
//   eye: Eye,
//   fingerprint: Fingerprint,
//   hand: Hand,
// }

// export default function ImageCapture({ onCapture, onRecapture, label, imageSrc, icon }: ImageCaptureProps) {
//   const [isCapturing, setIsCapturing] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const videoRef = useRef<HTMLVideoElement>(null)
//   const canvasRef = useRef<HTMLCanvasElement>(null)
//   const fileInputRef = useRef<HTMLInputElement>(null)
//   const streamRef = useRef<MediaStream | null>(null)

  

//   const IconComponent = icons[icon]

//   useEffect(() => {
//     if (isCapturing) {
//       startCamera()
//     } else {
//       stopCamera()
//     }
//     return () => {
//       stopCamera()
//     }
//   }, [isCapturing])

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream
//         streamRef.current = stream
//       }
//       setError(null)
//     } catch (err) {
//       console.error("Error accessing the camera", err)
//       setError("Unable to access the camera. Please make sure you've granted camera permissions.")
//       setIsCapturing(false)
//     }
//   }

//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop())
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null
//     }
//     streamRef.current = null
//   }

//   const captureImage = () => {
//     if (videoRef.current && canvasRef.current) {
//       const context = canvasRef.current.getContext('2d')
//       if (context) {
//         canvasRef.current.width = videoRef.current.videoWidth
//         canvasRef.current.height = videoRef.current.videoHeight
//         context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
//         const imageData = canvasRef.current.toDataURL('image/jpeg')
//         onCapture(imageData)
//         setIsCapturing(false)
//       }
//     }
//   }

//   const handleRecapture = () => {
//     onRecapture()
//     setIsCapturing(false)
//   }

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         const imageData = e.target?.result as string
//         onCapture(imageData)
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const triggerFileUpload = () => {
//     fileInputRef.current?.click()
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center space-x-2">
//           <IconComponent className="h-6 w-6 text-teal-600" />
//           <span>{label}</span>
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}
//           {!imageSrc ? (
//             <>
//               {isCapturing ? (
//                 <>
//                   <div className="relative">
//                     <video 
//                       ref={videoRef} 
//                       autoPlay 
//                       playsInline
//                       className="w-full h-48 bg-gray-200 rounded-lg"
//                     />
//                     <Button 
//                       onClick={captureImage} 
//                       className="absolute bottom-2 right-2"
//                     >
//                       <Camera className="h-4 w-4 mr-2" />
//                       Capture
//                     </Button>
//                   </div>
//                   <Button 
//                     onClick={() => setIsCapturing(false)} 
//                     variant="outline" 
//                     className="w-full"
//                   >
//                     <X className="h-4 w-4 mr-2" />
//                     Cancel
//                   </Button>
//                 </>
//               ) : (
//                 <div className="space-y-2">
//                   <Button 
//                     onClick={() => setIsCapturing(true)} 
//                     variant="outline" 
//                     className="w-full"
//                   >
//                     <Camera className="h-4 w-4 mr-2" />
//                     Start Camera
//                   </Button>
//                   <Button 
//                     onClick={triggerFileUpload} 
//                     variant="outline" 
//                     className="w-full"
//                   >
//                     <Upload className="h-4 w-4 mr-2" />
//                     Upload Image
//                   </Button>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleFileUpload}
//                     accept="image/*"
//                     className="hidden"
//                   />
//                 </div>
//               )}
//             </>
//           ) : (
//             <>
//               <img 
//                 src={imageSrc || "/placeholder.svg"} 
//                 alt={`Captured ${label}`} 
//                 className="w-full h-48 object-cover rounded-lg" 
//               />
//               <Button 
//                 onClick={handleRecapture} 
//                 variant="outline" 
//                 className="w-full"
//               >
//                 <Camera className="h-4 w-4 mr-2" />
//                 Recapture
//               </Button>
//             </>
//           )}
//         </div>
//       </CardContent>
//       <canvas ref={canvasRef} style={{ display: 'none' }} />
//     </Card>
//   )
// }

'use client'

import { useState, useRef, useEffect } from 'react'
import { Eye, Fingerprint, Hand, Camera, Upload, X, Scissors } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Alert, AlertDescription } from "~/components/ui/alert"
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageCaptureProps {
  onCapture: (imageData: string) => void
  onRecapture: () => void
  label: string
  imageSrc: string | null
  icon: 'eye' | 'fingerprint' | 'hand'
}

const icons = {
  eye: Eye,
  fingerprint: Fingerprint,
  hand: Hand,
}

export default function ImageCapture({ onCapture, onRecapture, label, imageSrc, icon }: ImageCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>({ aspect: 1, unit: '%', width: 80 })
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const IconComponent = icons[icon]

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
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setError(null)
    } catch (err) {
      setError("Unable to access the camera. Please allow camera permissions.")
      setIsCapturing(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop())
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        const imageData = canvasRef.current.toDataURL('image/jpeg')
        onCapture(imageData)
        setIsCapturing(false)
      }
    }
  }

  const handleRecapture = () => {
    onRecapture()
    setCroppedImage(null)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        onCapture(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const getCroppedImage = () => {
    if (imageRef.current && crop.width && crop.height) {
      const canvas = document.createElement('canvas')
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height
      canvas.width = crop.width * scaleX
      canvas.height = crop.height * scaleY
      const ctx = canvas.getContext('2d')

      if (ctx) {
        ctx.drawImage(
          imageRef.current,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          canvas.width,
          canvas.height
        )
        const croppedImageData = canvas.toDataURL('image/jpeg')
        setCroppedImage(croppedImageData)
        onCapture(croppedImageData)
      }
    }
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
                </>
              ) : (
                <div className="space-y-2">
                  <Button onClick={() => setIsCapturing(true)} variant="outline" className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Camera
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                </div>
              )}
            </>
          ) : (
            <>
              {!croppedImage ? (
                <>
                  <ReactCrop crop={crop} onChange={setCrop} aspect={1}>
                    <img ref={imageRef} src={imageSrc} alt="Captured" className="w-full h-48 object-cover rounded-lg" />
                  </ReactCrop>
                  <Button onClick={getCroppedImage} className="w-full mt-2">
                    <Scissors className="h-4 w-4 mr-2" />
                    Crop Image
                  </Button>
                </>
              ) : (
                <img src={croppedImage} alt="Cropped result" className="w-full h-48 object-cover rounded-lg" />
              )}
              <Button onClick={handleRecapture} variant="outline" className="w-full mt-2">
                <Camera className="h-4 w-4 mr-2" />
                Recapture
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
