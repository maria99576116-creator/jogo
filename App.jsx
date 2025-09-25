import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { BookOpen, Trophy, RotateCcw, Star, CheckCircle, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import perguntasData from './data/perguntas.json'
import './App.css'

function App() {
  const [gameState, setGameState] = useState('menu') // 'menu', 'playing', 'result'
  const [selectedLevel, setSelectedLevel] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState([])

  const levels = {
    facil: { name: 'Fácil', color: 'bg-green-500', points: 10 },
    medio: { name: 'Médio', color: 'bg-yellow-500', points: 20 },
    dificil: { name: 'Difícil', color: 'bg-red-500', points: 30 }
  }

  const startGame = (level) => {
    setSelectedLevel(level)
    setQuestions(perguntasData[level])
    setCurrentQuestion(0)
    setScore(0)
    setAnsweredQuestions([])
    setGameState('playing')
    setShowResult(false)
  }

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)
    setShowResult(true)
    
    const isCorrect = answer === questions[currentQuestion].resposta
    const points = isCorrect ? levels[selectedLevel].points : 0
    
    setAnsweredQuestions(prev => [...prev, {
      question: questions[currentQuestion],
      selectedAnswer: answer,
      isCorrect,
      points
    }])
    
    if (isCorrect) {
      setScore(prev => prev + points)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer('')
      setShowResult(false)
    } else {
      setGameState('result')
    }
  }

  const resetGame = () => {
    setGameState('menu')
    setSelectedLevel('')
    setCurrentQuestion(0)
    setScore(0)
    setQuestions([])
    setSelectedAnswer('')
    setShowResult(false)
    setAnsweredQuestions([])
  }

  const getScoreMessage = () => {
    const percentage = (score / (questions.length * levels[selectedLevel].points)) * 100
    if (percentage >= 80) return { message: 'Excelente! Você domina a literatura brasileira!', icon: '🏆' }
    if (percentage >= 60) return { message: 'Muito bom! Continue estudando!', icon: '⭐' }
    if (percentage >= 40) return { message: 'Bom trabalho! Há espaço para melhorar!', icon: '📚' }
    return { message: 'Continue estudando! A literatura brasileira é fascinante!', icon: '💪' }
  }

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
              >
                <BookOpen className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Literatura Brasileira
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-2">
                Teste seus conhecimentos sobre os grandes autores e obras da nossa literatura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold text-center mb-6">Escolha o nível de dificuldade:</h3>
              <div className="grid gap-4">
                {Object.entries(levels).map(([key, level]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => startGame(key)}
                      className={`w-full h-16 text-lg font-semibold ${level.color} hover:opacity-90 transition-all duration-200 shadow-lg`}
                      variant="default"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{level.name}</span>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {level.points} pts por acerto
                        </Badge>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (gameState === 'playing') {
    const question = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-6"
          >
            <div className="flex items-center gap-4">
              <Badge className={`${levels[selectedLevel].color} text-white px-4 py-2`}>
                {levels[selectedLevel].name}
              </Badge>
              <span className="text-lg font-semibold">
                Pergunta {currentQuestion + 1} de {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-xl font-bold">{score} pts</span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm mb-6">
                <CardHeader>
                  <CardTitle className="text-2xl leading-relaxed">
                    {question.pergunta}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {question.opcoes.map((opcao, index) => {
                      let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 hover:shadow-md"
                      
                      if (showResult) {
                        if (opcao === question.resposta) {
                          buttonClass += " bg-green-100 border-green-500 text-green-800"
                        } else if (opcao === selectedAnswer && opcao !== question.resposta) {
                          buttonClass += " bg-red-100 border-red-500 text-red-800"
                        } else {
                          buttonClass += " bg-gray-100 border-gray-300 text-gray-600"
                        }
                      } else {
                        buttonClass += " bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                      }

                      return (
                        <motion.button
                          key={index}
                          whileHover={!showResult ? { scale: 1.01 } : {}}
                          whileTap={!showResult ? { scale: 0.99 } : {}}
                          onClick={() => !showResult && handleAnswer(opcao)}
                          className={buttonClass}
                          disabled={showResult}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg">{opcao}</span>
                            {showResult && opcao === question.resposta && (
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            )}
                            {showResult && opcao === selectedAnswer && opcao !== question.resposta && (
                              <XCircle className="w-6 h-6 text-red-600" />
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>

                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 text-center"
                    >
                      <Button
                        onClick={nextQuestion}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
                      >
                        {currentQuestion < questions.length - 1 ? 'Próxima Pergunta' : 'Ver Resultado'}
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  if (gameState === 'result') {
    const { message, icon } = getScoreMessage()
    const maxScore = questions.length * levels[selectedLevel].points
    const percentage = Math.round((score / maxScore) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl mb-4"
              >
                {icon}
              </motion.div>
              <CardTitle className="text-3xl font-bold mb-2">Resultado Final</CardTitle>
              <CardDescription className="text-xl">{message}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{score}</div>
                <div className="text-lg text-gray-600">de {maxScore} pontos ({percentage}%)</div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Resumo das Respostas:</h3>
                {answeredQuestions.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    {item.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sm">Pergunta {index + 1}</div>
                      <div className="text-xs text-gray-600">
                        {item.isCorrect ? 'Correto' : `Incorreto - Resposta: ${item.question.resposta}`}
                      </div>
                    </div>
                    <Badge variant={item.isCorrect ? "default" : "secondary"}>
                      +{item.points} pts
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => startGame(selectedLevel)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Jogar Novamente
                </Button>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  className="flex-1"
                >
                  Menu Principal
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }
}

export default App
