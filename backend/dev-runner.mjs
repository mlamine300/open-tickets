import { inspect } from "node:util";

async function tryImport(name, spec) {
  try {
    console.log(`importing ${name} from ${spec}`);
    const mod = await import(spec);
    console.log(`ok: ${name}`);
    return mod;
  } catch (err) {
    console.error(`FAILED importing ${name} from ${spec}:`);
    console.error(inspect(err, { showHidden: true, depth: null }));
    if (err && err.stack) console.error("\nStack:\n", err.stack);
    process.exit(1);
  }
}

(async () => {
  await tryImport("express", "express");
  await tryImport("dotenv", "dotenv");
  await tryImport("cors", "cors");
  await tryImport("path", "path");

  // local imports from app.ts
  await tryImport("connectToDB", "./src/config/db.js");

  // Import route, controller, model and middleware modules individually to find the failing one
  await tryImport("authController", "./src/controllers/authController.js");
  await tryImport("authRoutes", "./src/routes/authRoutes.js");
  await tryImport("authController", "./src/controllers/authController.js");
  await tryImport("userController", "./src/controllers/userController.js");
  await tryImport("taskController", "./src/controllers/taskController.js");
  await tryImport("reportController", "./src/controllers/reportController.js");
  await tryImport("userModel", "./src/models/User.js");
  await tryImport("taskModel", "./src/models/Task.js");
  await tryImport("authMiddleware", "./src/middlewares/authMiddleware.js");
  await tryImport("uploadMiddleware", "./src/middlewares/uploadMiddleware.js");

  // finally import the app itself (this will pull in routes/controllers)
  await tryImport("app", "./src/app.ts");
})();
