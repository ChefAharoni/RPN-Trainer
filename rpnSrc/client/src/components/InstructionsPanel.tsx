import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export function InstructionsPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary">How RPN Works</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-gray-600 hover:text-primary"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <span>Hide Instructions</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>Show Instructions</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="animate-in fade-in duration-300">
            <p className="mb-4">RPN (Reverse Polish Notation) uses a stack-based approach to calculate expressions:</p>
            <ol className="list-decimal list-inside space-y-2 mb-4">
              <li>Numbers are pushed onto the stack</li>
              <li>When an operator is encountered, it pops the top two values</li>
              <li>The operator is applied to these values</li>
              <li>The result is pushed back onto the stack</li>
            </ol>
            <p className="mb-2">
              <span className="font-semibold">Example:</span> 7 3 5 * +
            </p>
            <ul className="list-disc list-inside pl-4 text-gray-700 space-y-1">
              <li>Push 7, 3, 5 onto stack → [7, 3, 5]</li>
              <li>See * operator: pop 5 and 3, calculate 3 * 5 = 15</li>
              <li>Push 15 onto stack → [7, 15]</li>
              <li>See + operator: pop 15 and 7, calculate 7 + 15 = 22</li>
              <li>Push 22 onto stack → [22]</li>
              <li>Final answer: 22</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
