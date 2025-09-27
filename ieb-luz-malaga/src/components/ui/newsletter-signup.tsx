'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface NewsletterSignupProps {
  compact?: boolean
  showTitle?: boolean
  className?: string
}

export function NewsletterSignup({ 
  compact = false, 
  showTitle = true, 
  className = '', 
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setStatus('error');
      setMessage('Por favor, ingresa tu email');
      return;
    }

    try {
      setLoading(true);
      setStatus('idle');

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
        setName('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Error al suscribirse');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <div className={`space-y-4 ${className}`}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
          </Button>
        </form>
        
        {status === 'success' && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            {message}
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        {showTitle && (
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Newsletter
          </CardTitle>
        )}
        <CardDescription>
          Recibe actualizaciones, devocionales y noticias de la iglesia
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Tu nombre (opcional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            <Input
              type="email"
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Suscribiéndose...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Suscribirse
              </>
            )}
          </Button>
        </form>

        {/* Status Messages */}
        {status === 'success' && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{message}</span>
            </div>
          </div>
        )}
        
        {status === 'error' && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{message}</span>
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Al suscribirte, aceptas recibir emails de la iglesia. 
          Puedes cancelar tu suscripción en cualquier momento.
        </div>
      </CardContent>
    </Card>
  );
}

// Componente compacto para footer
export function NewsletterSignupCompact() {
  return <NewsletterSignup compact={true} showTitle={false} />;
}
