import express from "express";
import transactionRouter from "./routes/transaction.route.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", //indirizzo del server
    methods: "*", //metodi che accetta
  })
);
app.use(express.json());
app.use(transactionRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
