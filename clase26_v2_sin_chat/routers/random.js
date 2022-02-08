import express from 'express'
import { fork } from "child_process";

const randomApiRouter = express.Router()

randomApiRouter.get("/random", (req, res) => {
    const cant = parseInt(req.query.cant || 100000000);
    if (isNaN(cant)) {
      res.status(400).send({
        error: "Parameter 'cant' must be a number",
      });
      return;
    }
    const random = fork("./utils/random.js", [cant]);
    random.on("message", (data) => {
      res.json({ iterations: cant, numbers: data });
    });
  });
  
  export default randomApiRouter;