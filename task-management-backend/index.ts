import express, { Express, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'
import cors from 'cors';

const app: Express = express();
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.post('/status', async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Please provide status' });
  }

  const result = await prisma.status.create({
    data: {
      name: status,
    },
  })
  res.json(result)
});

app.get('/status', async (req, res) => {

  const status = await prisma.status.findMany();
  res.json(status)
});

app.get('/task', async (req, res) => {

  const task = await prisma.task.findMany();
  res.json(task)
})

app.post('/task', async (req, res) => {
  const { title, description, statusId } = req.body;

  if (!title || !description || !statusId) {
    return res.status(400).json({ error: 'Please provide title, description, and statusId' });
  }

  if (!Number(statusId)) {
    return res.status(400).json({ error: 'Please provide statusId as type Number' });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: title,
        description: description,
        statusId: statusId
      },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create the task' });
  }
});

app.put('/task/:id/:statusId', async (req, res) => {
  const { id, statusId } = req.params

  try {
    const matchingTask = await prisma.task.findUnique({
      where: { id: Number(id) }
    })

    if(!matchingTask){
      return res.status(400).json({ error: `Task with ID ${id} does not exist in the database` });
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) || undefined },
      data: { statusId: Number(statusId) },
    })
    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ error: `Unabe to update the task` })
  }
})

app.delete(`/task/:id`, async (req, res) => {
  const { id } = req.params
  try{
    const task = await prisma.task.delete({
      where: {
        id: Number(id),
      },
    })
    res.status(200).json(task)
  } catch (error) {
    res.status(500).json(error)
  }

})

app.listen(3000, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:3000`);
});
