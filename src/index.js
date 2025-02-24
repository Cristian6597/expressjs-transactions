import express from "express";
import transactionRouter from "./routes/transaction.route.js";
const app = express();

app.use(express.json());
app.use(transactionRouter);

const PORT = 3001;

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
