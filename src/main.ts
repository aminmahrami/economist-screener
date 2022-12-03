import express, { Express, Request, Response } from "express";
const port = 3000;
const cors = require("cors");
import fetch from "node-fetch";
const app: Express = express();

app.use(cors());
app.use(express.static("public"));
app.get("/article", getArticle);
app.get("*", (req, res) => {
  console.log(req.url);
  res.end();
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

async function getArticle(req: Request, res: Response) {
  const { url } = req.query;
  console.log("Fetching Article: ", url);
  if (!url || typeof url !== "string") {
    set404Status(res);
    res.send("Are you sure about this input?");
    return;
  }
  if (!url.includes("https://www.economist.com/")) {
    set404Status(res);
    res.send("Sorry, only Economist URLs are valid here :p");
    return;
  }
  const fetchRes = await fetch(url);
  const html = await fetchRes.text();
  res.send(html);
}

const set404Status = (res: Response) => res.status(404);
