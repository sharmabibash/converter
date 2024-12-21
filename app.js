'use client'

import { useState } from 'react'
import { FileIcon, FileImageIcon as PdfIcon, ArrowRightLeft, Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type ConversionType = 'word-to-pdf' | 'pdf-to-word'

export default function FileConverter() {
    const [file, setFile] = useState < File | null > (null)
    const [conversionType, setConversionType] = useState < ConversionType > ('word-to-pdf')
    const [isConverting, setIsConverting] = useState(false)
    const [error, setError] = useState < string | null > (null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile) {
            const fileType = selectedFile.name.split('.').pop()?.toLowerCase()
            if ((conversionType === 'word-to-pdf' && fileType === 'docx') ||
                (conversionType === 'pdf-to-word' && fileType === 'pdf')) {
                setFile(selectedFile)
                setError(null)
            } else {
                setFile(null)
                setError(`Please select a ${conversionType === 'word-to-pdf' ? 'Word (.docx)' : 'PDF'} file.`)
            }
        }
    }

    const handleConvert = async () => {
        if (!file) return

        setIsConverting(true)
        setError(null)

        try {
            // Simulating API call for file conversion
            await new Promise(resolve => setTimeout(resolve, 2000))

            // In a real application, you would send the file to a server for conversion
            // and receive the converted file in response

            // Simulating download of converted file
            const blob = new Blob([file], { type: file.type })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `converted-${file.name.split('.')[0]}.${conversionType === 'word-to-pdf' ? 'pdf' : 'docx'}`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            setIsConverting(false)
            setFile(null)
        } catch (error) {
            console.error('Conversion failed:', error)
            setIsConverting(false)
            setError('Conversion failed. Please try again.')
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>File Converter</CardTitle>
                <CardDescription>Convert between Word and PDF formats</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="conversion-type">Conversion Type</Label>
                        <Select
                            value={conversionType}
                            onValueChange={(value) => {
                                setConversionType(value as ConversionType)
                                setFile(null)
                                setError(null)
                            }}
                        >
                            <SelectTrigger id="conversion-type">
                                <SelectValue placeholder="Select conversion type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="word-to-pdf">Word to PDF</SelectItem>
                                <SelectItem value="pdf-to-word">PDF to Word</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="file-upload">Upload File</Label>
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {conversionType === 'word-to-pdf' ? 'Word (.docx)' : 'PDF (.pdf)'} (MAX. 10MB)
                                    </p>
                                </div>
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept={conversionType === 'word-to-pdf' ? '.docx' : '.pdf'}
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>
                    {file && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            {conversionType === 'word-to-pdf' ? <FileIcon className="mr-2" /> : <PdfIcon className="mr-2" />}
                            {file.name}
                        </div>
                    )}
                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    onClick={handleConvert}
                    disabled={!file || isConverting}
                >
                    {isConverting ? (
                        <>Converting...</>
                    ) : (
                        <>
                            Convert <ArrowRightLeft className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}

