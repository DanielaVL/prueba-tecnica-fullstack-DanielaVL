import type { NextApiRequest, NextApiResponse } from 'next';
import { getApiDocs } from '../../lib/swagger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const spec = getApiDocs();
  return res.status(200).json(spec);
}
