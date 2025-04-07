import { InstructionsPanel } from "@/components/InstructionsPanel";
import { RPNCalculator } from "@/components/RPNCalculator";

export default function Home() {
  return (
    <h1>Try the full version here: <a href=https://algorithm-trainer.com>algorithm-trainer.com></a></h1>
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <header className="mb-8 text-center">
              <h1>Try the full version here: {" "} <a href="https://algorithm-trainer.com">algorithm-trainer.com></a></h1>
                            <br>
          <h1 className="text-3xl font-bold text-primary mb-2">RPN Calculator Trainer</h1>
          <p className="text-gray-600">Learn and practice Reverse Polish Notation calculations</p>
        </header>

        <RPNCalculator />
        <InstructionsPanel />

        <footer className="text-center text-gray-500 text-sm mt-8">
          <p>
            RPN Calculator Trainer | Learn more about{" "}
            <a 
              href="https://en.wikipedia.org/wiki/Reverse_Polish_notation" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Reverse Polish Notation
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
