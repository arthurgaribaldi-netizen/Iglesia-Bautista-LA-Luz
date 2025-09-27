"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { SuccessCheck, LoadingSpinner, Shake } from "@/components/ui/micro-interactions";
import { logger } from "@/lib/logger";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

// Example schema for a multi-step form
const multiStepFormSchema = z.object({
  // Step 1: Personal Information
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  
  // Step 2: Address Information
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  zipCode: z.string().min(5, "CEP deve ter pelo menos 5 caracteres"),
  country: z.string().min(2, "País é obrigatório"),
  
  // Step 3: Preferences
  interests: z.string().min(10, "Interesses devem ter pelo menos 10 caracteres"),
  newsletter: z.boolean().optional(),
  notifications: z.boolean().optional(),
  
  // Step 4: Additional Information
  comments: z.string().optional(),
  howDidYouHear: z.string().optional(),
});

type MultiStepFormData = z.infer<typeof multiStepFormSchema>

interface FormWithProgressProps {
  onSubmit: (data: MultiStepFormData) => Promise<void>
  className?: string
}

export function FormWithProgress({ onSubmit, className }: FormWithProgressProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [showErrors, setShowErrors] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    trigger,
  } = useForm<MultiStepFormData>({
    resolver: zodResolver(multiStepFormSchema),
    mode: "onBlur",
  });

  const watchedFields = watch();

  const steps = [
    {
      id: 'personal',
      label: 'Informações Pessoais',
      description: 'Seus dados básicos',
      fields: ['firstName', 'lastName', 'email', 'phone'],
      status: currentStep > 0 ? 'completed' as const : 'current' as const,
    },
    {
      id: 'address',
      label: 'Endereço',
      description: 'Onde você mora',
      fields: ['address', 'city', 'zipCode', 'country'],
      status: currentStep === 1 ? 'current' as const : currentStep > 1 ? 'completed' as const : 'upcoming' as const,
    },
    {
      id: 'preferences',
      label: 'Preferências',
      description: 'Seus interesses',
      fields: ['interests', 'newsletter', 'notifications'],
      status: currentStep === 2 ? 'current' as const : currentStep > 2 ? 'completed' as const : 'upcoming' as const,
    },
    {
      id: 'additional',
      label: 'Informações Adicionais',
      description: 'Comentários finais',
      fields: ['comments', 'howDidYouHear'],
      status: currentStep === 3 ? 'current' as const : 'upcoming' as const,
    },
  ];

  const currentStepData = steps[currentStep];

  const handleNext = async() => {
    const fieldsToValidate = currentStepData.fields as (keyof MultiStepFormData)[];
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setShowErrors(true);
      setTimeout(() => setShowErrors(false), 2000);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = async(data: MultiStepFormData) => {
    try {
      await onSubmit(data);
      setIsSubmitted(true);
      reset();
    } catch (error) {
      logger.error('Erro ao enviar formulário:', error);
      setShowErrors(true);
      setTimeout(() => setShowErrors(false), 2000);
    }
  };

  if (isSubmitted) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-12">
          <SuccessCheck size="lg" className="mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Formulário Enviado!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Obrigado por preencher o formulário. Entraremos em contato em breve.
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(0);
            }}
          >
            Preencher Novo Formulário
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Formulário Multi-Etapas</CardTitle>
        <CardDescription>
          Complete todas as etapas para enviar o formulário
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Indicator */}
        <ProgressIndicator 
          steps={steps} 
          orientation="horizontal"
          showStepNumbers={true}
        />

        {/* Current Step Content */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">{currentStepData.label}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentStepData.description}
            </p>
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 0 && (
            <div className="grid md:grid-cols-2 gap-4 animate-fade-in-up">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                  Nome *
                </label>
                <Shake active={showErrors && !!errors.firstName}>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="Seu nome"
                    className={`transition-all duration-200 ${errors.firstName ? "border-red-500" : ""}`}
                  />
                </Shake>
                {errors.firstName && (
                  <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                  Sobrenome *
                </label>
                <Shake active={showErrors && !!errors.lastName}>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Seu sobrenome"
                    className={`transition-all duration-200 ${errors.lastName ? "border-red-500" : ""}`}
                  />
                </Shake>
                {errors.lastName && (
                  <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <Shake active={showErrors && !!errors.email}>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="seu@email.com"
                    className={`transition-all duration-200 ${errors.email ? "border-red-500" : ""}`}
                  />
                </Shake>
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Telefone
                </label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+34 952 123 456"
                  className={`transition-all duration-200 ${errors.phone ? "border-red-500" : ""}`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Address Information */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in-up">
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-2">
                  Endereço *
                </label>
                <Shake active={showErrors && !!errors.address}>
                  <Input
                    id="address"
                    {...register("address")}
                    placeholder="Rua, número, bairro"
                    className={`transition-all duration-200 ${errors.address ? "border-red-500" : ""}`}
                  />
                </Shake>
                {errors.address && (
                  <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium mb-2">
                    Cidade *
                  </label>
                  <Shake active={showErrors && !!errors.city}>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="Sua cidade"
                      className={`transition-all duration-200 ${errors.city ? "border-red-500" : ""}`}
                    />
                  </Shake>
                  {errors.city && (
                    <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                    CEP *
                  </label>
                  <Shake active={showErrors && !!errors.zipCode}>
                    <Input
                      id="zipCode"
                      {...register("zipCode")}
                      placeholder="29004"
                      className={`transition-all duration-200 ${errors.zipCode ? "border-red-500" : ""}`}
                    />
                  </Shake>
                  {errors.zipCode && (
                    <p className="text-sm text-red-600 mt-1">{errors.zipCode.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium mb-2">
                    País *
                  </label>
                  <Shake active={showErrors && !!errors.country}>
                    <Input
                      id="country"
                      {...register("country")}
                      placeholder="Espanha"
                      className={`transition-all duration-200 ${errors.country ? "border-red-500" : ""}`}
                    />
                  </Shake>
                  {errors.country && (
                    <p className="text-sm text-red-600 mt-1">{errors.country.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in-up">
              <div>
                <label htmlFor="interests" className="block text-sm font-medium mb-2">
                  Interesses *
                </label>
                <Shake active={showErrors && !!errors.interests}>
                  <Textarea
                    id="interests"
                    {...register("interests")}
                    placeholder="Conte-nos sobre seus interesses..."
                    rows={4}
                    className={`resize-none transition-all duration-200 ${errors.interests ? "border-red-500" : ""}`}
                  />
                </Shake>
                {errors.interests && (
                  <p className="text-sm text-red-600 mt-1">{errors.interests.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    id="newsletter"
                    type="checkbox"
                    {...register("newsletter")}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="newsletter" className="text-sm font-medium">
                    Receber newsletter por email
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="notifications"
                    type="checkbox"
                    {...register("notifications")}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="notifications" className="text-sm font-medium">
                    Receber notificações sobre eventos
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Additional Information */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in-up">
              <div>
                <label htmlFor="comments" className="block text-sm font-medium mb-2">
                  Comentários Adicionais
                </label>
                <Textarea
                  id="comments"
                  {...register("comments")}
                  placeholder="Alguma informação adicional que gostaria de compartilhar?"
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div>
                <label htmlFor="howDidYouHear" className="block text-sm font-medium mb-2">
                  Como conheceu nossa igreja?
                </label>
                <Input
                  id="howDidYouHear"
                  {...register("howDidYouHear")}
                  placeholder="Indicação de amigo, internet, etc."
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              type="button"
              onClick={handleSubmit(handleFormSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" color="text-white" className="mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Enviar Formulário
                </>
              )}
            </Button>
          ) : (
            <Button type="button" onClick={handleNext}>
              Próximo
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
