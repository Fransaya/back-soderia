import { Router } from "express";

import { getRolesControllers } from "../controllers/rolesController.js";

const rolesRoutes = Router();

rolesRoutes.get('/', getRolesControllers);

export default rolesRoutes;