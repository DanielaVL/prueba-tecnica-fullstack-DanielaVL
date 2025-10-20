import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Import dinámico para no empaquetar fs en frontend
  const { getApiDocs } = await import('../../lib/swagger');

  const spec = await getApiDocs();
  return res.status(200).json(spec);
}
