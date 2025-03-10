import { StackStep } from "@/lib/rpn";

interface StackVisualizationProps {
  steps: StackStep[];
}

export function StackVisualization({ steps }: StackVisualizationProps) {
  return (
    <div className="flex flex-col-reverse items-center space-y-reverse space-y-2">
      <div className="w-full">
        <div className="relative">
          {steps.map((step, index) => (
            <div key={index} className="stack-step mb-4 transition-all duration-300">
              <div className="text-sm text-gray-500 mb-1">
                Step {index + 1}: Parsing "{step.token}"
              </div>
              <div className="flex items-center">
                <div className="w-1/2 flex justify-end pr-4">
                  <div className="flex flex-col-reverse">
                    {step.nextStack.map((item, i) => (
                      <div
                        key={i}
                        className="border border-gray-300 bg-white h-10 w-16 flex items-center justify-center rounded mt-1"
                      >
                        <span className="font-mono">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-1/2 pl-4 text-sm text-gray-600">
                  {step.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
