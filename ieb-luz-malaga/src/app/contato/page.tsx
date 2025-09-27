"use client";

import { useState, useCallback, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { SuccessCheck, LoadingSpinner, Shake, HoverCard } from "@/components/ui/micro-interactions";
import { ChurchLocationMap } from "@/components/ui/google-maps";
import { MapPin, Phone, Mail, Clock, Send, AlertCircle } from "lucide-react";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { ContactFormFallback, MapFallback } from "@/components/ui/suspense-fallbacks";

export default function ContatoPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur",
  });


  const progressSteps = [
    { id: 'info', label: 'Informações Pessoais', description: 'Nome e email', status: 'completed' as const },
    { id: 'subject', label: 'Assunto', description: 'Tema da mensagem', status: 'completed' as const },
    { id: 'message', label: 'Mensagem', description: 'Detalhes da sua mensagem', status: 'current' as const },
    { id: 'review', label: 'Revisão', description: 'Confirmação final', status: 'upcoming' as const },
  ];

  const onSubmit = useCallback(async(_data: ContactFormData) => {
    try {
      // Simular envio do formulário
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      reset();
      setShowErrors(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao enviar formulário:', error);
      setShowErrors(true);
      // Hide error animation after 2 seconds
      setTimeout(() => setShowErrors(false), 2000);
    }
  }, [reset]);

  const handleResetForm = useCallback(() => setIsSubmitted(false), []);
  const handleOpenMaps = useCallback(() => window.open('https://maps.google.com/maps?q=Avenida+Antonio+Gaudí,+4,+29004+Málaga,+Espanha&dirflg=d', '_blank'), []);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">

        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Entre em Contato
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Estamos aqui para ajudá-lo. Entre em contato conosco para qualquer dúvida, 
            oração ou informação sobre nossa igreja.
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Envie uma Mensagem</CardTitle>
                <CardDescription>
                  Preencha o formulário abaixo e entraremos em contato o mais breve possível.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8 animate-fade-in-up">
                    <SuccessCheck size="lg" className="mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Mensagem Enviada!</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Obrigado por entrar em contato. Responderemos em breve.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={handleResetForm}
                    >
                      Enviar Nova Mensagem
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Progress Indicator */}
                    <div className="mb-6">
                      <ProgressIndicator 
                        steps={progressSteps} 
                        orientation="horizontal"
                        showStepNumbers={true}
                      />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Nome Completo *
                        </label>
                        <Shake active={showErrors && !!errors.name}>
                          <Input
                            id="name"
                            {...register("name")}
                            placeholder="Seu nome completo"
                            className={`transition-all duration-200 ${errors.name ? "border-red-500" : ""}`}
                          />
                        </Shake>
                        {errors.name && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            {errors.name.message}
                          </div>
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
                          <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            {errors.email.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Teléfono
                        </label>
                        <Input
                          id="phone"
                          {...register("phone")}
                          placeholder="+34 952 23 04 00"
                          className={`transition-all duration-200 ${errors.phone ? "border-red-500" : ""}`}
                        />
                        {errors.phone && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            {errors.phone.message}
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                          Assunto *
                        </label>
                        <Shake active={showErrors && !!errors.subject}>
                          <Input
                            id="subject"
                            {...register("subject")}
                            placeholder="Assunto da mensagem"
                            className={`transition-all duration-200 ${errors.subject ? "border-red-500" : ""}`}
                          />
                        </Shake>
                        {errors.subject && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            {errors.subject.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Mensagem *
                      </label>
                      <Shake active={showErrors && !!errors.message}>
                        <Textarea
                          id="message"
                          {...register("message")}
                          rows={5}
                          placeholder="Escreva sua mensagem aqui..."
                          className={`resize-none transition-all duration-200 ${errors.message ? "border-red-500" : ""}`}
                        />
                      </Shake>
                      {errors.message && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          {errors.message.message}
                        </div>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="sm" color="text-white" className="mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Contact Information */}
          <section className="space-y-6">
            {/* Church Info */}
            <HoverCard>
              <Card>
              <CardHeader>
                <CardTitle>Informações da Igreja</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Endereço</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Avenida Antonio Gaudí, 4<br />
                      29004 Málaga, Espanha
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      CIF: R2900286B | FEREDE: 016332
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Teléfonos</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      +34 952 23 04 00<br />
                      +34 670 77 90 98
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>
            </HoverCard>

            {/* Worship Times */}
            <HoverCard>
              <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Horários de Culto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Escola Bíblica</span>
                    <span className="text-primary font-semibold">Domingo 11:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Culto de Adoração</span>
                    <span className="text-primary font-semibold">Domingo 18:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Reunião de Mulheres (UMMBE)</span>
                    <span className="text-primary font-semibold">Quarta 17:30</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Culto de Oração</span>
                    <span className="text-primary font-semibold">Quarta 19:00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            </HoverCard>

            {/* Quick Actions */}
            <HoverCard>
              <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>
                  Links úteis para sua visita
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleOpenMaps}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Como Chegar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  Próximos Eventos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Newsletter
                </Button>
              </CardContent>
            </Card>
            </HoverCard>
          </section>
        </div>

        {/* Map Section */}
        <section className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Nossa Localização</CardTitle>
              <CardDescription>
                Venha nos visitar - estamos ansiosos para conhecê-lo!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<MapFallback />}>
                <ChurchLocationMap />
              </Suspense>
            </CardContent>
          </Card>
        </section>

        {/* Emergency Contact */}
        <section className="mt-12">
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">
                Contato de Emergência
              </CardTitle>
              <CardDescription>
                Para situações urgentes ou pedidos de oração
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium">Pastor Eliezer Bueno Martín</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    +34 952 23 04 00
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Llamar Ahora
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

