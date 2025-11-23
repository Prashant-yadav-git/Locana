"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Mic, Phone, PhoneCall } from "lucide-react"
import { useStock } from "@/contexts/stock-context"

interface VoiceUpdateModalProps {
  onClose: () => void
}

export function VoiceUpdateModal({ onClose }: VoiceUpdateModalProps) {
  const { addStockItem } = useStock()
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'ai', text: string, time: string}>>([])
  const [currentStatus, setCurrentStatus] = useState("Ready to chat")
  const recognitionRef = useRef<any>(null)
  const [isCallActive, setIsCallActive] = useState(false)

  useEffect(() => {
    if (isCallActive) {
      startListening()
      const greeting = "नमस्ते! मैं आपका स्टॉक असिस्टेंट हूं। आप क्या अपडेट करना चाहते हैं?"
      speakResponse(greeting)
      addToConversation('ai', greeting)
    }
  }, [isCallActive])

  const startCall = () => {
    setIsCallActive(true)
    setCurrentStatus("Connected")
  }

  const endCall = () => {
    setIsCallActive(false)
    setIsListening(false)
    setCurrentStatus("Call ended")
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setTimeout(() => onClose(), 1000)
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser')
      return
    }

    const recognition = new (window as any).webkitSpeechRecognition()
    recognitionRef.current = recognition
    
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'hi-IN'
    
    recognition.onstart = () => {
      setIsListening(true)
      setCurrentStatus("Listening...")
    }
    
    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript
      }
      
      if (finalTranscript.trim()) {
        processVoiceCommand(finalTranscript.trim())
      }
    }
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setCurrentStatus("Listening...")
      setTimeout(() => restartListening(), 500)
    }
    
    recognition.onend = () => {
      setIsListening(false)
      if (isCallActive) {
        setTimeout(() => restartListening(), 500)
      }
    }
    
    recognition.start()
  }

  const restartListening = () => {
    if (isCallActive && recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (e) {
        startListening()
      }
    }
  }

  const processLocalCommand = (text: string): string => {
    const lower = text.toLowerCase()
    
    if (lower.includes('maggie') || lower.includes('मैगी')) {
      addStockItem('Maggie', 1)
      updateLocalStorage('Maggie', 1)
      return "ठीक है! Maggie का stock add कर दिया। कुछ और?"
    } else if (lower.includes('bread') || lower.includes('ब्रेड')) {
      addStockItem('Bread', 1)
      updateLocalStorage('Bread', 1)
      return "बढ़िया! Bread का stock update हो गया। और कुछ?"
    } else if (lower.includes('milk') || lower.includes('दूध')) {
      addStockItem('Milk', 1)
      updateLocalStorage('Milk', 1)
      return "ठीक है! Milk का stock add कर दिया। कुछ और?"
    } else if (lower.includes('add') || lower.includes('daal') || lower.includes('डाल')) {
      const productName = extractProductName(text)
      if (productName) {
        addStockItem(productName, 1)
        updateLocalStorage(productName, 1)
      }
      return "ठीक है! Stock update हो गया। कुछ और अपडेट करना है?"
    } else {
      return "माफ करिए, समझ नहीं आया। कृपया फिर से बोलिए। जैसे: Maggie stock me add kro"
    }
  }

  const extractProductName = (text: string): string => {
    const words = text.toLowerCase().split(' ')
    const commonWords = ['stock', 'me', 'add', 'kro', 'daal', 'do', 'का', 'को']
    const productWord = words.find(word => !commonWords.includes(word) && word.length > 2)
    return productWord ? productWord.charAt(0).toUpperCase() + productWord.slice(1) : 'Product'
  }

  const updateLocalStorage = (name: string, quantity: number) => {
    const stockItem = {
      id: Date.now().toString(),
      name,
      quantity,
      updatedAt: new Date().toISOString()
    }
    
    const existing = JSON.parse(localStorage.getItem('locana-stock') || '[]')
    const existingIndex = existing.findIndex((item: any) => item.name.toLowerCase() === name.toLowerCase())
    
    if (existingIndex >= 0) {
      existing[existingIndex].quantity += quantity
      existing[existingIndex].updatedAt = stockItem.updatedAt
    } else {
      existing.push(stockItem)
    }
    
    localStorage.setItem('locana-stock', JSON.stringify(existing))
    window.dispatchEvent(new Event('stockUpdated'))
  }

  const processVoiceCommand = async (text: string) => {
    setIsProcessing(true)
    setCurrentStatus("Processing...")
    
    addToConversation('user', text)
    
    try {
      const response = await fetch('/api/openai/stock-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: text,
          method: 'voice'
        })
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const result = await response.json()
      
      const aiResponse = result.success 
        ? `हां भाई! ${result.message} कुछ और अपडेट करना है?`
        : processLocalCommand(text)
      
      addToConversation('ai', aiResponse)
      speakResponse(aiResponse)
      setCurrentStatus("Listening...")
    } catch (error) {
      const aiResponse = processLocalCommand(text)
      addToConversation('ai', aiResponse)
      speakResponse(aiResponse)
      setCurrentStatus("Listening...")
    } finally {
      setIsProcessing(false)
    }
  }

  const speakResponse = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN'
    utterance.rate = 0.9
    utterance.pitch = 1.1
    speechSynthesis.speak(utterance)
  }

  const addToConversation = (type: 'user' | 'ai', text: string) => {
    const time = new Date().toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
    setConversation(prev => [...prev, { type, text, time }])
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold">📞 Stock Assistant</h3>
                  <p className="text-blue-100 text-sm">{currentStatus}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="text-center">
                {!isCallActive ? (
                  <div className="space-y-4">
                    <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                      <Phone className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-sm">Tap to call your AI stock assistant</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                      isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                    }`}>
                      {isListening ? (
                        <Mic className="w-10 h-10 text-white" />
                      ) : (
                        <PhoneCall className="w-10 h-10 text-white" />
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">Connected</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isCallActive && (
            <div className="p-4 max-h-64 overflow-y-auto space-y-3">
              {conversation.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    msg.type === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-sm' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-6 bg-gray-50">
            {!isCallActive ? (
              <Button
                onClick={startCall}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl text-lg font-semibold"
              >
                📞 Start Voice Call
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={endCall}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-semibold"
                >
                  📞 End Call
                </Button>
              </div>
            )}
            
            {!isCallActive && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 mb-2">Examples:</p>
                <div className="space-y-1">
                  <p className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full inline-block">"Maggie stock me add kro"</p>
                  <p className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full inline-block ml-2">"Bread 10 pieces daal do"</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
