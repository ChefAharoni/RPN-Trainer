export type StackStep = {
  token: string;
  stack: number[];
  description: string;
  nextStack: number[];
};

// Evaluate an RPN expression and return the result
export function evaluateRPN(expression: string): number {
  const tokens = expression.split(' ');
  const stack: number[] = [];
  
  for (const token of tokens) {
    if (!isNaN(Number(token))) {
      stack.push(Number(token));
    } else {
      const b = stack.pop() as number;
      const a = stack.pop() as number;
      
      switch (token) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          // Handle division by zero by returning NaN
          if (b === 0) {
            return NaN;
          }
          // Only allow integer divisions (no decimal results)
          if (a % b !== 0) {
            return NaN; // This will cause the generator to try again
          }
          stack.push(a / b);
          break;
      }
    }
  }
  
  return stack[0];
}

// Generate a random RPN expression
export function generateRandomRPNExpression(): string {
  // This implementation uses a more reliable approach to ensure valid RPN expressions
  // A valid RPN expression must have exactly one more operand than operators
  const operators = ['+', '-', '*', '/'];
  
  // Determine target token count (5-7 in most cases, max 10)
  // We use a skewed distribution to favor 5-7 range
  let targetTokenCount;
  const rand = Math.random();
  if (rand < 0.4) {
    targetTokenCount = 5; // 40% chance for 5 tokens
  } else if (rand < 0.7) {
    targetTokenCount = 6; // 30% chance for 6 tokens
  } else if (rand < 0.9) {
    targetTokenCount = 7; // 20% chance for 7 tokens
  } else if (rand < 0.95) {
    targetTokenCount = 8; // 5% chance for 8 tokens
  } else if (rand < 0.98) {
    targetTokenCount = 9; // 3% chance for 9 tokens
  } else {
    targetTokenCount = 10; // 2% chance for 10 tokens
  }
  
  // Calculate the required number of operands and operators
  // For n tokens where n is odd, we need (n+1)/2 operands and (n-1)/2 operators
  // For n tokens where n is even, we need n/2+1 operands and n/2-1 operators
  let numOperands = Math.ceil(targetTokenCount / 2) + (targetTokenCount % 2 === 0 ? 0 : 0);
  let numOperators = targetTokenCount - numOperands;
  
  // Ensure we have exactly one more operand than operators
  if (numOperands - numOperators !== 1) {
    numOperators = numOperands - 1;
  }
  
  // Generate the tokens using a new approach that guarantees valid RPN
  return generateValidRPNExpression(numOperands, numOperators);
}

// Helper function to generate valid RPN expressions
function generateValidRPNExpression(numOperands: number, numOperators: number): string {
  const operators = ['+', '-', '*', '/'];
  let attempts = 0;
  const maxAttempts = 50; // Avoid infinite recursion
  
  // Define helper functions outside the loop to comply with strict mode
  const addOperandFn = (
    tokens: (string | number)[], 
    remainingOperands: number, 
    stackSize: number
  ): [number, number] => {
    tokens.push(Math.floor(Math.random() * 9) + 1);
    return [remainingOperands - 1, stackSize + 1];
  };
  
  const addOperatorFn = (
    tokens: (string | number)[], 
    remainingOperators: number, 
    stackSize: number
  ): [string | number, number, number] => {
    let op: string;
    
    // Handle division specially to ensure integer results
    if (Math.random() < 0.25) { // 25% chance for division when picking an operator
      // Try to find a suitable divisor
      let found = false;
      for (let i = 0; i < 5; i++) { // Try a few times to find a suitable division
        const simStack: number[] = [];
        const testTokens = [...tokens]; // Copy current tokens
        
        // Simulate the stack up to this point
        for (const token of testTokens) {
          if (typeof token === 'number') {
            simStack.push(token);
          } else {
            const b = simStack.pop() as number;
            const a = simStack.pop() as number;
            switch (token) {
              case '+': simStack.push(a + b); break;
              case '-': simStack.push(a - b); break;
              case '*': simStack.push(a * b); break;
              case '/': simStack.push(a / b); break;
            }
          }
        }
        
        // Get the top two items on the stack
        if (simStack.length >= 2) {
          const divisor = simStack.pop() as number;
          const dividend = simStack.pop() as number;
          
          // Check if divisor is non-zero and division produces an integer
          if (divisor !== 0 && dividend % divisor === 0) {
            op = '/';
            found = true;
            break;
          }
        }
      }
      
      if (!found) {
        // Pick a non-division operator
        const alternativeOps = ['+', '-', '*'];
        op = alternativeOps[Math.floor(Math.random() * alternativeOps.length)];
      } else {
        op = '/'; // Explicitly set if found
      }
    } else {
      // Pick a random non-division operator
      const nonDivisionOps = ['+', '-', '*'];
      op = nonDivisionOps[Math.floor(Math.random() * nonDivisionOps.length)];
    }
    
    return [op, remainingOperators - 1, stackSize - 1]; // Operator consumes 2 values and produces 1
  };
  
  while (attempts < maxAttempts) {
    attempts++;
    
    // We'll build the expression by tracking the stack state at each step
    let tokens: (string | number)[] = [];
    let stackSize = 0;
    let remainingOperands = numOperands;
    let remainingOperators = numOperators;
    
    // Always start with an operand
    tokens.push(Math.floor(Math.random() * 9) + 1);
    remainingOperands--;
    stackSize = 1;
    
    while (remainingOperands > 0 || remainingOperators > 0) {
      // We can add an operator if we have at least 2 items on the stack
      // and we have operators remaining
      const canAddOperator = stackSize >= 2 && remainingOperators > 0;
      
      // We can add an operand if we have operands remaining
      const canAddOperand = remainingOperands > 0;
      
      // If we can't add either, the generation has failed
      if (!canAddOperator && !canAddOperand) {
        break;
      }
      
      // If we can only add one type, do that
      if (canAddOperator && !canAddOperand) {
        const [op, newRemOps, newStackSize] = addOperatorFn(tokens, remainingOperators, stackSize);
        tokens.push(op);
        remainingOperators = newRemOps;
        stackSize = newStackSize;
        continue;
      }
      
      if (!canAddOperator && canAddOperand) {
        const [newRemOps, newStackSize] = addOperandFn(tokens, remainingOperands, stackSize);
        remainingOperands = newRemOps;
        stackSize = newStackSize;
        continue;
      }
      
      // If we can add both, decide based on the stack state and remaining tokens
      // We need to ensure we'll be able to reduce the stack to 1 item at the end
      
      // If adding all remaining operands would overload the stack beyond what 
      // our operators can reduce, we should add an operator now
      if (stackSize + remainingOperands - remainingOperators > 1) {
        const [op, newRemOps, newStackSize] = addOperatorFn(tokens, remainingOperators, stackSize);
        tokens.push(op);
        remainingOperators = newRemOps;
        stackSize = newStackSize;
      } else {
        // Otherwise decide randomly, but favor operands early and operators later
        const threshold = 0.5 * (remainingOperands / numOperands); // Decreases as we use more operands
        if (Math.random() < threshold) {
          const [newRemOps, newStackSize] = addOperandFn(tokens, remainingOperands, stackSize);
          remainingOperands = newRemOps;
          stackSize = newStackSize;
        } else {
          const [op, newRemOps, newStackSize] = addOperatorFn(tokens, remainingOperators, stackSize);
          tokens.push(op);
          remainingOperators = newRemOps;
          stackSize = newStackSize;
        }
      }
    }
    
    // Check if we used all operands and operators and the stack has exactly 1 item
    if (remainingOperands === 0 && remainingOperators === 0 && stackSize === 1) {
      const expression = tokens.join(' ');
      const result = evaluateRPN(expression);
      
      // Check result is valid (integer and reasonable size)
      if (!isNaN(result) && isFinite(result) && Math.abs(result) <= 1000 && Number.isInteger(result)) {
        return expression;
      }
    }
  }
  
  // If we fail after max attempts, try with different counts
  // If the target token count is high, try with fewer tokens
  if (numOperands + numOperators > 6) {
    return generateValidRPNExpression(numOperands - 1, numOperators - 1);
  }
  
  // Fall back to a simple expression if all else fails
  return "3 4 + 5 *";
}

// Generate steps for stack visualization
export function generateStackSteps(expression: string): StackStep[] {
  const tokens = expression.split(' ');
  const steps: StackStep[] = [];
  let stack: number[] = [];
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const stepStack = [...stack]; // Copy current stack state
    let description = '';
    
    if (!isNaN(Number(token))) {
      description = `Push ${token} onto stack`;
      stack.push(Number(token));
    } else {
      const b = stack.pop() as number;
      const a = stack.pop() as number;
      let result: number;
      
      switch (token) {
        case '+':
          result = a + b;
          description = `Pop ${b} and ${a}, calculate ${a} + ${b} = ${result}, push result`;
          break;
        case '-':
          result = a - b;
          description = `Pop ${b} and ${a}, calculate ${a} - ${b} = ${result}, push result`;
          break;
        case '*':
          result = a * b;
          description = `Pop ${b} and ${a}, calculate ${a} * ${b} = ${result}, push result`;
          break;
        case '/':
          result = a / b;
          description = `Pop ${b} and ${a}, calculate ${a} / ${b} = ${result}, push result`;
          break;
        default:
          result = 0;
          description = "Unknown operator";
      }
      
      stack.push(result);
    }
    
    steps.push({
      token,
      stack: stepStack,
      description,
      nextStack: [...stack]
    });
  }
  
  return steps;
}
