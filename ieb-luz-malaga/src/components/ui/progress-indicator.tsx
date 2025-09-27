"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, Circle } from "lucide-react";

export interface ProgressStep {
  id: string
  label: string
  description?: string
  status: "completed" | "current" | "upcoming"
}

export interface ProgressIndicatorProps {
  steps: ProgressStep[]
  className?: string
  orientation?: "horizontal" | "vertical"
  showStepNumbers?: boolean
}

const ProgressIndicator = React.forwardRef<HTMLDivElement, ProgressIndicatorProps>(
  ({ steps, className, orientation = "horizontal", showStepNumbers = true }, ref) => {
    const currentStepIndex = steps.findIndex(step => step.status === "current");
    const completedSteps = steps.filter(step => step.status === "completed").length;

    if (orientation === "vertical") {
      return (
        <div
          ref={ref}
          className={cn("flex flex-col space-y-4", className)}
          role="progressbar"
          aria-valuenow={currentStepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
        >
          {steps.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            const isUpcoming = step.status === "upcoming";

            return (
              <div key={step.id} className="flex items-start space-x-3">
                {/* Step Indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                      {
                        "bg-primary border-primary text-white": isCompleted,
                        "bg-primary border-primary text-white ring-4 ring-primary/20": isCurrent,
                        "bg-background border-gray-300 text-gray-500 dark:border-gray-600": isUpcoming,
                      },
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : showStepNumbers ? (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-0.5 h-6 mt-2 transition-colors duration-300",
                        {
                          "bg-primary": index < currentStepIndex,
                          "bg-gray-300 dark:bg-gray-600": index >= currentStepIndex,
                        },
                      )}
                    />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      {
                        "text-primary": isCurrent,
                        "text-gray-900 dark:text-gray-100": isCompleted,
                        "text-gray-500 dark:text-gray-400": isUpcoming,
                      },
                    )}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div
                      className={cn(
                        "text-xs mt-1 transition-colors duration-300",
                        {
                          "text-primary/80": isCurrent,
                          "text-gray-600 dark:text-gray-300": isCompleted,
                          "text-gray-400 dark:text-gray-500": isUpcoming,
                        },
                      )}
                    >
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Horizontal orientation
    return (
      <div
        ref={ref}
        className={cn("w-full", className)}
        role="progressbar"
        aria-valuenow={currentStepIndex + 1}
        aria-valuemin={1}
        aria-valuemax={steps.length}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Progresso: {completedSteps} de {steps.length} etapas
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round((completedSteps / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(completedSteps / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            const isUpcoming = step.status === "upcoming";

            return (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 mb-2",
                    {
                      "bg-primary border-primary text-white": isCompleted,
                      "bg-primary border-primary text-white ring-4 ring-primary/20": isCurrent,
                      "bg-background border-gray-300 text-gray-500 dark:border-gray-600": isUpcoming,
                    },
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : showStepNumbers ? (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                <div className="text-center">
                  <div
                    className={cn(
                      "text-xs font-medium transition-colors duration-300",
                      {
                        "text-primary": isCurrent,
                        "text-gray-900 dark:text-gray-100": isCompleted,
                        "text-gray-500 dark:text-gray-400": isUpcoming,
                      },
                    )}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div
                      className={cn(
                        "text-xs mt-1 transition-colors duration-300 hidden sm:block",
                        {
                          "text-primary/80": isCurrent,
                          "text-gray-600 dark:text-gray-300": isCompleted,
                          "text-gray-400 dark:text-gray-500": isUpcoming,
                        },
                      )}
                    >
                      {step.description}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

ProgressIndicator.displayName = "ProgressIndicator";

export { ProgressIndicator };
