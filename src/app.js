import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const CorsOptions={
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowHeaders: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MDS. Content-Type, Date, X-Api-Version',
    credentials: true,
};


//* IMPORTACION DE RUTAS
import indexRouter from './routes/indexRoutes.js';

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors(CorsOptions))
app.use(express.json());

app.use("/api", indexRouter);


export default  app;