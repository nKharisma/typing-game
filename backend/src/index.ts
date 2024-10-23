import express, { Application } from "express";

const app: Application = express();
const port: number = 3000;

app.get("/", (req, res) => {
  res.send("Hello from TypeScript and Express!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
// just checking to make sure this works