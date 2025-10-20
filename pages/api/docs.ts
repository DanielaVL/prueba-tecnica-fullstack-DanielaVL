import { NextApiRequest, NextApiResponse } from 'next';
import { getApiDocs } from '../../lib/swagger';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const spec = getApiDocs();
  res.status(200).json(spec);
}
