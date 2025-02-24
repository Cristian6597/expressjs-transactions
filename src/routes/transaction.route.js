import express from "express";
import prisma from "../prisma/prismaClient.js";

const transactionRouter = express.Router();

transactionRouter.get("/transactions", async (req, res) => {
  try {
    const transactions = await prisma.transactions.findMany({
      orderBy: {
        date: "desc",
      },
    });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "impossibile trovare transazioni" });
  }
});

transactionRouter.post("/transactions", async (req, res) => {
  const { date, location, amount } = req.body;
  try {
    const newMovement = await prisma.transactions.create({
      data: {
        date,
        location,
        amount,
      },
    });
    res.json(newMovement);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "impossibile creare transazione" });
  }
});

transactionRouter.delete("/transactions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTransaction = await prisma.transactions.delete({
      where: {
        //metodo utilizzato da prisma per eliminare un record
        id: parseInt(id),
      },
    });
    res.json(deleteTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "impossibile eliminare transazione" });
  }
});

transactionRouter.put("/transactions/:id", async (req, res) => {
  const { id } = req.params;
  const { date, location, amount } = req.body;
  try {
    const updateTransactions = await prisma.transactions.update({
      where: {
        id: parseInt(id),
      },
      data: {
        date,
        location,
        amount,
      },
    });
    res.json(updateTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "impossibile aggiornare" });
  }
});

export default transactionRouter;
