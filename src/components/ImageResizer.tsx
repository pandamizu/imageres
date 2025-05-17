import React, { useState, useRef, useEffect } from 'react'
import { Upload, ZoomIn, ZoomOut, Download, Image as ImageIcon } from 'lucide-react'

const ImageResizer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null)
  const [scale, setScale] = useState<number>(1)
  const [scaleInput, setScaleInput] = useState<string>('100')
  const [format, setFormat] = useState<'png' | 'jpg'>('png')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string)
          setScale(1)
          setScaleInput('100')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const resetImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setImage(null)
    setScale(1)
    setScaleInput('100')
    setFormat('png')
  }

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value) && value >= 10 && value <= 200) {
      setScale(value / 100)
      setScaleInput(e.target.value)
    }
  }

  const downloadImage = () => {
    if (!canvasRef.current || !image) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const img = new Image()
    img.onload = () => {
      const width = img.width * scale
      const height = img.height * scale
      
      canvas.width = width
      canvas.height = height
      
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)
      
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
      const dataUrl = canvas.toDataURL(mimeType, format === 'jpg' ? 0.9 : 1.0)
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `resized-image.${format}`
      link.click()
    }
    img.src = image
  }

  useEffect(() => {
    if (!canvasRef.current || !image) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const img = new Image()
    img.onload = () => {
      const width = img.width * scale
      const height = img.height * scale
      
      canvas.width = width
      canvas.height = height
      
      ctx.clearRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)
    }
    img.src = image
  }, [image, scale])

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Image Resizer</h2>
        <div className="flex space-x-2">
          <button
            onClick={resetImage}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            disabled={!image}
          >
            <Upload className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={downloadImage}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            disabled={!image}
          >
            <Download className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="block w-full text-center py-3 px-4 bg-white/30 hover:bg-white/40 rounded-lg cursor-pointer transition-colors text-white font-medium"
        >
          {image ? 'Change Image' : 'Upload Image'}
        </label>
      </div>
      
      {image && (
        <div className="space-y-4">
          <div className="relative aspect-video bg-black/10 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-white text-sm">
              <span>Resolution: {Math.round(scale * 100)}%</span>
              <button
                onClick={() => {
                  setScale(1)
                  setScaleInput('100')
                }}
                className="text-white/70 hover:text-white text-sm"
              >
                Reset
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <ZoomOut className="w-5 h-5 text-white" />
              <input
                type="range"
                min="10"
                max="200"
                step="1"
                value={Math.round(scale * 100)}
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  setScale(value / 100)
                  setScaleInput(e.target.value)
                }}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <ZoomIn className="w-5 h-5 text-white" />
            </div>
            
            <div className="mt-2">
              <input
                type="number"
                min="10"
                max="200"
                value={scaleInput}
                onChange={handleScaleChange}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-center"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-center text-white text-sm mb-2">
              <span>Output Format</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setFormat('png')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    format === 'png' 
                      ? 'bg-white/30 text-white font-medium' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  PNG
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('jpg')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    format === 'jpg' 
                      ? 'bg-white/30 text-white font-medium' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  JPG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageResizer
