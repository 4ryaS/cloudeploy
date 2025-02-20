import express from "express";
import appRoutes from "./routes/appRoutes";

const app = express();
app.use(express.json());
app.use("/", appRoutes);

app.listen(3000, () => {
    console.log(`The server is live at port 3000`);
});