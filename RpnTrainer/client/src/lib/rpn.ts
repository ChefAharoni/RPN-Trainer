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
          // Round to 2 decimal places for nicer answers
          stack.push(Math.round((a / b) * 100) / 100);
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
  
  // Length of expression between 5 and 9 tokens
  const targetLength = Math.floor(Math.random() * 5) + 5;
  
  while (tokens.length < targetLength) {
    // If stack size < 2, we must add a number
    if (stackSize < 2) {
      tokens.push(Math.floor(Math.random() * 9) + 1);
      stackSize++;
    } else {
      // Decide whether to add number or operator
      const addOperator = Math.random() > 0.5;
      
      if (addOperator) {
        const op = operators[Math.floor(Math.random() * operators.length)];
        
        // Avoid division by zero
        if (op === '/' && tokens[tokens.length - 1] === 0) {
          tokens.push(Math.floor(Math.random() * 8) + 1); // 1-9, avoiding 0
          stackSize++;
        } else {
          tokens.push(op);
          stackSize--; // Operator consumes 2 values and produces 1
        }
      } else {
        tokens.push(Math.floor(Math.random() * 9) + 1);
        stackSize++;
      }
    }
  }
  
  // Ensure the expression is valid by adding operators if needed
  while (stackSize > 1) {
    const op = operators[Math.floor(Math.random() * operators.length)];
    tokens.push(op);
    stackSize--;
  }
  
  // Check if the result is valid (not too complicated)
  const result = evaluateRPN(tokens.join(' '));
  
  // If result is invalid or too complex, generate a new expression
  if (isNaN(result) || !isFinite(result) || Math.abs(result) > 1000) {
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
          result = Math.round((a / b) * 100) / 100;
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
