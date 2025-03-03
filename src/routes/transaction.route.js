import express from "express";
import prisma from "../prisma/prismaClient.js";

const transactionRouter = express.Router();

transactionRouter.get("/transactions", async (req, res) => {
  //passa il parametro nel url

  const { month } = req.query;
  try {
    //divide il parametro in due parti
    let [year, monthNumber] = month.split("-");

    //converte il mese in numero
    let parsedMonth = parseInt(monthNumber) - 1;
    let parsedYear = parseInt(year);

    //controlla se il mese è valido
    if (parsedMonth < 0 || parsedMonth > 11) {
      return res
        .status(400)
        .json({ error: "Mese non valido. Deve essere tra 01 e 12." });
    }

    //aggiunge un if in modo che quando devo visuallizare le transazioni di dicembre, prenda le transazioni tra dicembre e gennaio dell'anno successivo
    // if (monthNumber === 11) {
    //   console.log(typeof monthNumber);
    //   const nextYear = parseInt(year) + 1; // Passa all'anno successivo
    //   year = nextYear; // Aggiorna l'anno

    //   // Modifica il mese per prendere gennaio (01)
    //   monthNumber = 0;
    // }
    /*  console.log(
      parsedMonth,
      new Date(Date.UTC(parsedYear, parsedMonth + 1, 1))
    ); */
    const transactions = await prisma.transactions.findMany({
      orderBy: {
        date: "desc",
      },
      where: {
        date: {
          gte: new Date(Date.UTC(parsedYear, parsedMonth, 1)), // Inizio del mese
          lt: new Date(Date.UTC(parsedYear, parsedMonth + 1, 1)), // Inizio del mese successivo
        },
      },
    });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "impossibile trovare transazioni" });
  }
});

transactionRouter.get("/transactions/filter", async (req, res) => {
  const { date_min, date_max } = req.query;
  try {
    const minDate = new Date(date_min);
    const maxDate = new Date(date_max);
    const filteredTransactions = await prisma.transactions.findMany({
      orderBy: {
        date: "desc",
      },
      where: {
        AND: [{ date: { gt: minDate } }, { date: { lt: maxDate } }],
      },
    });
    res.json(filteredTransactions);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "impossibile trovare le transazioni filtrati per data" });
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
