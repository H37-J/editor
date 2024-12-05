import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/server/prisma';

const handler = async(req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const data = await prisma.user.findMany({});
      return res.status(200).json({data});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'fail'})
    }
  } else {
    return res.status(405).json({ msg: 'Method now supported'});
  }
}

export default handler;