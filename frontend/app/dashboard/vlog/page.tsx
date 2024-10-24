"use client"

import { SetStateAction, useState } from "react"
import { Film, Music, Image, Plus, X, Play, Download, Share2 } from "lucide-react"

// Mock data for demonstration
const mockItinerary = [
  { day: 1, title: "Arrival and Beach Exploration", location: "Saint Martin's Island" },
  { day: 2, title: "Snorkeling Adventure", location: "Coral Reef" },
  { day: 3, title: "Island Hopping", location: "Surrounding Islands" },
  { day: 4, title: "Sunset at Chera Dwip", location: "Chera Dwip" },
  { day: 5, title: "Departure", location: "Saint Martin's Island" },
]

const mockImages = [
  { id: 1, src: "/placeholder.svg?height=100&width=100", alt: "Beach sunset" },
  { id: 2, src: "/placeholder.svg?height=100&width=100", alt: "Snorkeling" },
  { id: 3, src: "/placeholder.svg?height=100&width=100", alt: "Island view" },
  { id: 4, src: "/placeholder.svg?height=100&width=100", alt: "Group photo" },
  { id: 5, src: "/placeholder.svg?height=100&width=100", alt: "Local cuisine" },
]

const mockMusicTracks = [
  { id: 1, name: "Tropical Breeze", mood: "Calm" },
  { id: 2, name: "Island Adventure", mood: "Upbeat" },
  { id: 3, name: "Ocean Waves", mood: "Relaxing" },
  { id: 4, name: "Sunset Serenade", mood: "Romantic" },
]

export default function TravelVlogGenerator() {
  const [selectedImages, setSelectedImages] = useState<{ id: number; src?: string; alt?: string }[]>([])
  const [selectedMusic, setSelectedMusic] = useState<{ id: number; name: string; mood: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVlog, setGeneratedVlog] = useState<{ title: string; duration: string; thumbnail: string } | null>(null)

  const handleImageSelect = (image: { id: number; src?: string; alt?: string }) => {
    setSelectedImages(prev =>
      prev.includes(image)
        ? prev.filter(i => i.id !== image.id)
        : [...prev, image]
    )
  }

  const handleMusicSelect = (track: { id: number; name: string; mood: string }) => {
    setSelectedMusic(track)
  }

  const handleGenerateVlog = () => {
    setIsGenerating(true)
    // Simulate vlog generation process
    setTimeout(() => {
      setGeneratedVlog({
        title: "Saint Martin Island Adventure",
        duration: "3:45",
        thumbnail: "/placeholder.svg?height=200&width=300"
      })
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center text-orange-600 mb-8">Travel Vlog Generator</h1>
      
      {/* Itinerary Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-orange-500">Your Itinerary</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {mockItinerary.map((item, index) => (
            <div key={index} className="flex items-center p-4 border-b border-gray-200 last:border-b-0">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                Day {item.day}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-orange-500">Select Images</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {mockImages.map((image) => (
            <div
              key={image.id}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                selectedImages.includes(image) ? 'ring-4 ring-orange-500' : 'hover:shadow-lg'
              }`}
              onClick={() => handleImageSelect(image)}
            >
              <img src={image.src} alt={image.alt} className="w-full h-24 object-cover" />
              {selectedImages.includes(image) && (
                <div className="absolute inset-0 bg-orange-500 bg-opacity-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
          <div className="flex items-center justify-center w-full h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors duration-300">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Music Selection */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-orange-500">Choose Background Music</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockMusicTracks.map((track) => (
            <div
              key={track.id}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedMusic?.id === track.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white shadow-md hover:shadow-lg'
              }`}
              onClick={() => handleMusicSelect(track)}
            >
              <div className="flex items-center">
                <Music className="w-6 h-6 mr-3" />
                <div>
                  <h3 className="font-semibold">{track.name}</h3>
                  <p className="text-sm opacity-75">{track.mood}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Vlog Button */}
      <div className="text-center mb-8">
        <button
          className={`px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 ${
            isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl'
          }`}
          onClick={handleGenerateVlog}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Vlog...
            </>
          ) : (
            <>
              <Film className="inline-block mr-2 -mt-1" />
              Generate Travel Vlog
            </>
          )}
        </button>
      </div>

      {/* Generated Vlog Preview */}
      {generatedVlog && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="relative">
            <img src={generatedVlog.thumbnail} alt="Vlog Thumbnail" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Play className="w-16 h-16 text-white opacity-75 hover:opacity-100 cursor-pointer transition-opacity duration-300" />
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-2">{generatedVlog.title}</h3>
            <p className="text-gray-600 mb-4">Duration: {generatedVlog.duration}</p>
            <div className="flex justify-between">
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300">
                <Download className="w-5 h-5 inline-block mr-1" /> Download
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
                <Share2 className="w-5 h-5 inline-block mr-1" /> Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
