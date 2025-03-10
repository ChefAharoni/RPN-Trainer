import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StackVisualization } from "@/components/StackVisualization";
import { 
  evaluateRPN,
  generateRandomRPNExpression,
  generateStackSteps,
  type StackStep
} from "@/lib/rpn";
import { ChevronDown, ChevronUp } from "lucide-react";

export function RPNCalculator() {
  const [currentExpression, setCurrentExpression] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [stackSteps, setStackSteps] = useState<StackStep[]>([]);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);

  // Generate a new expression on initial load
  useEffect(() => {
    generateNewExpression();
  }, []);

  // Generate a new RPN expression and reset state
  const generateNewExpression = () => {
    setIsCorrect(null);
    setUserAnswer("");
    setShowValidationMessage(false);
    
    const expression = generateRandomRPNExpression();
    setCurrentExpression(expression);
    
    const answer = evaluateRPN(expression);
    setCurrentAnswer(answer);
    
    // Generate stack visualization steps
    const steps = generateStackSteps(expression);
    setStackSteps(steps);
  };

  // Handle user answer input
  const handleAnswerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
    setShowValidationMessage(false);
  };

  // Check if the user's answer is correct
  const handleCheckAnswer = () => {
    const parsedUserAnswer = parseFloat(userAnswer);
    
    if (isNaN(parsedUserAnswer)) {
      setValidationMessage("Please enter a valid number");
      setShowValidationMessage(true);
      return;
    }
    
    // Check if the answer is correct (allow small floating point differences)
    const isAnswerCorrect = Math.abs(parsedUserAnswer - (currentAnswer || 0)) < 0.001;
    setIsCorrect(isAnswerCorrect);
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        {/* Expression Display */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-2">Calculate this expression:</h2>
          <div className="bg-gray-100 p-4 rounded text-2xl font-mono text-center tracking-wider">
            {currentExpression}
          </div>
        </div>

        {/* Input Area */}
        <div className="mb-6">
          <label htmlFor="answer-input" className="block text-md font-medium text-gray-700 mb-2">
            Your Answer:
          </label>
          <div className="flex">
            <Input
              id="answer-input"
              type="number"
              placeholder="Enter your answer"
              value={userAnswer}
              onChange={handleAnswerInput}
              step="any"
              className="w-full"
            />
          </div>
          {showValidationMessage && (
            <div className="mt-2 text-sm text-red-500">{validationMessage}</div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
          <Button 
            onClick={handleCheckAnswer}
            className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 flex-1"
          >
            Check Answer
          </Button>
          <Button 
            onClick={generateNewExpression}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300 flex-1"
          >
            New Expression
          </Button>
        </div>

        {/* Result Feedback */}
        {isCorrect !== null && (
          <div 
            className={`mb-6 p-4 rounded-md ${
              isCorrect 
                ? "bg-green-100 border border-green-500" 
                : "bg-red-100 border border-red-500"
            }`}
          >
            {isCorrect ? (
              <div className="text-green-700 font-medium">
                Correct! {currentAnswer} is the right answer.
              </div>
            ) : (
              <div className="text-red-700 font-medium">
                Incorrect. The correct answer is {currentAnswer}.
              </div>
            )}
          </div>
        )}

        {/* Stack Visualization Toggle */}
        <div className="mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 w-full justify-between border border-gray-300"
            onClick={() => setShowVisualization(!showVisualization)}
          >
            <span className="font-medium text-gray-700">Stack Visualization</span>
            {showVisualization ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Stack Visualization Content */}
        {showVisualization && (
          <div className="mb-6 animate-in fade-in duration-300">
            <StackVisualization steps={stackSteps} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
