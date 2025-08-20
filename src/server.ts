import express, { Request, Response } from 'express';
import { IUser } from './interfaces';
import { loggingMiddleware } from './middlewares/loggingMiddleware';

const app = express();
const port = 3000;

// MIDDLEWARES GLOBAIS
app.use(express.json());
app.use(loggingMiddleware);

// Banco de dados em memória
let users: IUser[] = [
  { id: 1, name: "João Silva", email: "joao@email.com", isActive: true },
  { id: 2, name: "Maria Souza", email: "maria@email.com", isActive: false },
];

// ROTAS
app.get('/users', (req: Request, res: Response) => {
  res.json(users);
});

app.get('/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  res.json(user);
});

app.post('/users', (req: Request, res: Response) => {
  const { id, name, email, isActive } = req.body;
  
  if (typeof id !== 'number' || typeof name !== 'string' || 
      typeof email !== 'string' || typeof isActive !== 'boolean') {
    return res.status(400).json({ message: 'Dados inválidos' });
  }

  if (users.some(u => u.id === id)) {
    return res.status(409).json({ message: 'ID já existe' });
  }

  const newUser: IUser = { id, name, email, isActive };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json(users[userIndex]);
});

app.delete('/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  users.splice(userIndex, 1);
  res.status(204).send();
});

// INICIAR SERVIDOR
app.listen(port, () => {
  console.log(`🚀 API rodando na porta ${port}`);
  console.log(`📝 Logs serão exibidos abaixo para cada requisição:`);
});
