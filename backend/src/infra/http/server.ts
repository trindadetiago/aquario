import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "../config/env";
import { generalLimiter } from "./middlewares/rateLimiter";
import { publicacoesRouter } from "./routes/publicacoes.routes";
import { achadosEPerdidosRouter } from "./routes/achados-e-perdidos.routes";
import { authRouter } from "./routes/auth.routes";
import { vagasRouter } from "./routes/vagas.routes";
import { projetosRouter } from "./routes/projetos.routes";
import { centrosRouter } from "./routes/centros.routes";
import { usuariosRouter } from "./routes/usuarios.routes";
import { entidadesRouter } from "./routes/entidades.routes";
import { feedRouter } from "./routes/feed.routes";
import { searchRoutes } from "./routes/search.routes";
import { guiasRouter } from "./routes/guias.routes";

const app: Express = express();
const port = env.PORT || 3001;

// Security headers
app.use(helmet());

// CORS configuration with specific origin
const corsOrigins = env.CORS_ORIGIN.split(',').map(origin => origin.trim());
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);

// Apply general rate limiting to all routes
app.use(generalLimiter);

app.use(express.json());

app.use("/publicacoes", publicacoesRouter);
app.use("/achados-e-perdidos", achadosEPerdidosRouter);
app.use("/vagas", vagasRouter);
app.use("/projetos", projetosRouter);
app.use("/centros", centrosRouter);
app.use("/usuarios", usuariosRouter);
app.use("/entidades", entidadesRouter);
app.use("/feed", feedRouter);
app.use("/search", searchRoutes);
app.use("/guias", guiasRouter);
app.use(authRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Backend do Aquário está no ar!");
});

app.listen(port, () => {
  console.log(`[server]: Servidor rodando em http://localhost:${port}`);
});
