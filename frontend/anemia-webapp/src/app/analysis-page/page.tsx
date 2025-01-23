import AnemiaTester from "~/components/AnemiaTester"

type Props = {}

export default function page({ }: Props) {
    return (
        <div>
            <main className="container mx-auto px-4 py-8">
                <center><h2 className="text-2xl font-semibold mb-4 text-gray-800">Anemia Detection Test</h2>
                    <p className="mb-8 text-gray-600">
                        Capture images of your eye, nail, and palm to assess your risk of anemia.
                        Our AI-powered technology provides quick and non-invasive screening.
                    </p></center>
                <AnemiaTester />
            </main>
            <footer className="bg-gray-200 py-4 mt-12">
                <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
                    © 2025 AnemoTech. For informational purposes only. Consult a healthcare professional for medical advice.
                </div>
            </footer>
        </div>
    )
};