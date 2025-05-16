import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import loginsRoutes from "./routes/logins.routes.js";
import niveauxRoutes from "./routes/niveaux.routes.js";
import montantsRoutes from "./routes/montants.routes.js";
import etudiantsRoutes from "./routes/etudiants.routes.js";
import tableNumCompteRoutes from "./routes/tableNumComptes.routes.js";
import paiementsRoutes from "./routes/paiements.routes.js";
import dashboardRoutes from './routes/dashboard.routes.js';

dotenv.config({ path: ".env" });

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  })
);

app.use(express.json());

// Monte chaque routeur sur un préfixe clair
app.use("/api", loginsRoutes);
app.use("/api", niveauxRoutes);
app.use("/api", montantsRoutes);
app.use("/api", etudiantsRoutes);
app.use("/api", tableNumCompteRoutes);
app.use("/api", paiementsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});