import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDoc() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    async function fetchSpec() {
      const response = await fetch('/api/docs');
      const data = await response.json();
      setSpec(data);
    }
    fetchSpec();
  }, []);

  if (!spec) {
    return <div>Cargando...</div>;
  }

  return <SwaggerUI spec={spec} />;
}