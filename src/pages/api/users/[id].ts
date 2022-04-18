import { prisma, User } from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = { user: User } | { err: string } | {}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(req.query)
  const id = req.query.id

  switch (req.method) {
    case 'PUT':
      if (typeof id !== 'string') {
        res.status(400).json({ err: 'Bad Requset' })
        return
      }
      prisma.user
        .update({
          where: {
            id: +id,
          },
          data: {
            name: req.body.name,
            email: req.body.email,
          },
        })
        .then((user) => {
          res.status(200).json({ user })
        })
        .catch(() => {
          res.status(501).json({ err: 'error' })
        })
      // 課題４：req.query から id を取得し、PrismaClient でユーザーを更新してみて
      break
    case 'DELETE':
      prisma.user
        .delete({
          where: {
            id: +id,
          },
        })
        .then(() => {
          res.status(204).json({})
        })
        .catch(() => {
          res.status(504).json({})
        })
      // 課題５：req.query から id を取得し、PrismaClient でユーザーを物理削除してみて

      break
    default:
      res.status(405).json({ err: 'Method Not Allowed' })
  }
}
