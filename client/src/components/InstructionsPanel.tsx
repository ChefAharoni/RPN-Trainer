import { Card, CardContent } from "@/components/ui/card";

export function InstructionsPanel() {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">How RPN Works</h2>
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
      </CardContent>
    </Card>
  );
}
