import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { 
  ssr: false,
  loading: () => <div>Cargando documentación...</div>
});

// Marca la página como cliente
export const config = {
  unstable_runtimeJS: true
};

export default function ApiDoc() {
  const [spec, setSpec] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchSpec() {
      try {
        const response = await fetch('/api/docs');
        if (!response.ok) {
          throw new Error('Error al cargar la documentación');
        }
        const data = await response.json();
        setSpec(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    }
    fetchSpec();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!spec) {
    return <div>Cargando especificación...</div>;
  }

  return (
    <div className="swagger-container">
      <SwaggerUI spec={spec} />
    </div>
  );
}