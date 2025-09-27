import { MapPin } from "lucide-react";
import { Button } from "./button";

interface GoogleMapsProps {
  address: string
  title?: string
  height?: string
  className?: string
}

export function GoogleMaps({ 
  address, 
  title = "Localização", 
  height = "h-64",
  className = "",
}: GoogleMapsProps) {
  const encodedAddress = encodeURIComponent(address);
  // Usando URL de embed simples que não requer API key
  const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.1234567890!2d-4.4200!3d36.7200!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQzJzEyLjAiTiA0wrAyNScxMi4wIlc!5e0!3m2!1ses!2ses!4v1234567890123!5m2!1ses!2ses&q=${encodedAddress}`;
  const mapsUrl = `https://maps.google.com/maps?q=${encodedAddress}`;
  const directionsUrl = `https://maps.google.com/maps?q=${encodedAddress}&dirflg=d`;

  return (
    <div className={`rounded-lg overflow-hidden ${height} ${className}`}>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
      />
      <div className="mt-4 flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open(mapsUrl, '_blank')}
        >
          <MapPin className="w-4 h-4 mr-2" />
          Abrir no Google Maps
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open(directionsUrl, '_blank')}
        >
          Direções
        </Button>
      </div>
    </div>
  );
}

// Componente específico para a igreja
export function ChurchLocationMap() {
  const churchAddress = "Avenida Antonio Gaudí, 4, 29004 Málaga, Espanha";
  
  return (
    <GoogleMaps 
      address={churchAddress}
      title="Localização da Iglesia Evangélica Bautista La Luz"
      height="h-64"
    />
  );
}
