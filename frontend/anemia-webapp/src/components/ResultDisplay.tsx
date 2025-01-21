import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

interface ResultDisplayProps {
  percentage: number
}

export default function ResultDisplay({ percentage }: ResultDisplayProps) {
  const getResultInfo = (percentage: number) => {
    if (percentage < 30) return { message: "Low risk of anemia", icon: CheckCircle, color: "text-green-500" }
    if (percentage < 70) return { message: "Moderate risk of anemia", icon: AlertTriangle, color: "text-yellow-500" }
    return { message: "High risk of anemia", icon: XCircle, color: "text-red-500" }
  }

  const { message, icon: Icon, color } = getResultInfo(percentage)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className={`text-6xl font-bold ${color}`}>{percentage}%</div>
          <div className="flex items-center space-x-2 text-lg">
            <Icon className={`h-6 w-6 ${color}`} />
            <span>{message}</span>
          </div>
          <p className="text-center text-gray-600 text-sm mt-4">
            This result is based on image analysis and should not be considered a definitive diagnosis. 
            Please consult with a healthcare professional for an accurate assessment and proper medical advice.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

