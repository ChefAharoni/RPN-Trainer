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
  const operators = ['+', '-', '*', '/'];
  let tokens: (string | number)[] = [];
  let stackSize = 0;
  
  // Start with 1-2 numbers
  tokens.push(Math.floor(Math.random() * 9) + 1);
  if (Math.random() > 0.3) {
    tokens.push(Math.floor(Math.random() * 9) + 1);
    stackSize = 2;
  } else {
    stackSize = 1;
  }
  
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
  
  // Maximum total tokens is 10 (operands + operators)
  // We need to calculate max length more carefully to ensure valid RPN expression
  // In RPN, if we have N operands, we need (N-1) operators to consume them
  const maxOperands = Math.ceil(targetTokenCount / 2) + 1; // Estimate based on target count
  let operandCount = tokens.length; // Current number of operands
  let operatorCount = 0; // Current number of operators
  
  while (operandCount + operatorCount < targetTokenCount && stackSize > 0 && operandCount + operatorCount < 10) {
    // If stack size < 2, we must add a number (if we haven't reached max operands)
    if (stackSize < 2 && operandCount < maxOperands) {
      tokens.push(Math.floor(Math.random() * 9) + 1);
      stackSize++;
      operandCount++;
    } else if (operandCount < maxOperands && Math.random() > 0.6) {
      // Add a number with lower probability as expression grows
      tokens.push(Math.floor(Math.random() * 9) + 1);
      stackSize++;
      operandCount++;
    } else {
      // Add an operator
      const op = operators[Math.floor(Math.random() * operators.length)];
      
      // Avoid division by zero
      if (op === '/' && tokens[tokens.length - 1] === 0) {
        // Try another operator
        const alternativeOps = ['+', '-', '*'];
        tokens.push(alternativeOps[Math.floor(Math.random() * alternativeOps.length)]);
      } else {
        tokens.push(op);
      }
      
      stackSize--; // Operator consumes 2 values and produces 1
      operatorCount++;
      
      // Break if we've reached the target token count
      if (operandCount + operatorCount >= targetTokenCount) {
        break;
      }
    }
  }
  
  // Ensure the expression is valid by adding operators if needed
  while (stackSize > 1 && operandCount + operatorCount < targetTokenCount && operandCount + operatorCount < 10) {
    const op = operators[Math.floor(Math.random() * operators.length)];
    tokens.push(op);
    stackSize--;
    operatorCount++;
  }
  
  // If we still have multiple items on stack and can't add more operators (due to max limit),
  // restart and try a different expression
  if (stackSize > 1 && operandCount + operatorCount >= 10) {
    return generateRandomRPNExpression();
  }
  
  // Check if the result is valid (integer and not too complex)
  const result = evaluateRPN(tokens.join(' '));
  
  // If result is invalid, not an integer, or too complex, generate a new expression
  if (isNaN(result) || !isFinite(result) || Math.abs(result) > 1000 || !Number.isInteger(result)) {
    return generateRandomRPNExpression();
  }
  
  return tokens.join(' ');
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
