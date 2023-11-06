"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.post('/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ error: 'Please provide status' });
    }
    const result = yield prisma.status.create({
        data: {
            name: status,
        },
    });
    res.json(result);
}));
app.get('/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = yield prisma.status.findMany();
    res.json(status);
}));
app.get('/task', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield prisma.task.findMany();
    res.json(task);
}));
app.post('/task', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, statusId } = req.body;
    if (!title || !description || !statusId) {
        return res.status(400).json({ error: 'Please provide title, description, and statusId' });
    }
    if (!Number(statusId)) {
        return res.status(400).json({ error: 'Please provide statusId as type Number' });
    }
    try {
        const task = yield prisma.task.create({
            data: {
                title: title,
                description: description,
                statusId: statusId
            },
        });
        res.json(task);
    }
    catch (error) {
        res.status(500).json({ error: 'Unable to create the task' });
    }
}));
app.put('/task/:id/:statusId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, statusId } = req.params;
    try {
        const matchingTask = yield prisma.task.findUnique({
            where: { id: Number(id) }
        });
        if (!matchingTask) {
            return res.status(400).json({ error: `Task with ID ${id} does not exist in the database` });
        }
        const updatedTask = yield prisma.task.update({
            where: { id: Number(id) || undefined },
            data: { statusId: Number(statusId) },
        });
        res.json(updatedTask);
    }
    catch (error) {
        res.status(500).json({ error: `Unabe to update the task` });
    }
}));
app.delete(`/task/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const task = yield prisma.task.delete({
            where: {
                id: Number(id),
            },
        });
        res.status(200).json(task);
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
app.listen(3000, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:3000`);
});
