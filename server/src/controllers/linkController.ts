import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { uploadCSVToS3 } from '../services/exportService'
import { Parser } from 'json2csv'

const prisma = new PrismaClient()

export const createLink = async (req: Request, res: Response) => {
  const { originalUrl, shortUrl } = req.body

  if (!/^https?:\/\/.+$/.test(originalUrl)) {
    return res.status(400).json({ error: 'Invalid original URL' })
  }

  if (shortUrl && !/^[a-zA-Z0-9_-]{4,12}$/.test(shortUrl)) {
    return res.status(400).json({ error: 'Invalid short URL format' })
  }

  try {
    const existing = await prisma.link.findUnique({ where: { shortUrl } })
    if (existing) return res.status(409).json({ error: 'Short URL already exists' })

    const link = await prisma.link.create({
      data: { originalUrl, shortUrl: shortUrl || Math.random().toString(36).substring(2, 8) }
    })

    res.status(201).json(link)
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const deleteLink = async (req: Request, res: Response) => {
  const { shortUrl } = req.params
  try {
    await prisma.link.delete({ where: { shortUrl } })
    res.status(200).json({ message: 'Deleted' })
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
}

export const listLinks = async (_: Request, res: Response) => {
  const links = await prisma.link.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(links)
}

export const incrementAccess = async (req: Request, res: Response) => {
  const { shortUrl } = req.params
  try {
    await prisma.link.update({
      where: { shortUrl },
      data: { accessCount: { increment: 1 } }
    })
    res.sendStatus(204)
  } catch {
    res.status(404).json({ error: 'Not found' })
  }
}

export const exportCSV = async (_: Request, res: Response) => {
  const links = await prisma.link.findMany()
  const parser = new Parser({ fields: ['id', 'originalUrl', 'shortUrl', 'accessCount', 'createdAt'] })
  const csv = parser.parse(links)
  const url = await uploadCSVToS3(csv)
  res.json({ csvUrl: url })
}

export const redirectToOriginal = async (req: Request, res: Response) => {
  const { shortUrl } = req.params
  const link = await prisma.link.findUnique({ where: { shortUrl } })

  if (!link) return res.status(404).json({ error: 'Short URL not found' })

  await prisma.link.update({
    where: { shortUrl },
    data: { accessCount: { increment: 1 } }
  })

  res.redirect(link.originalUrl)
}