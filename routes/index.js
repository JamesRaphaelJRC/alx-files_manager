/* Routes module */
import express from 'express';
import AppController from '../controllers/AppController';

function controllerRouting(app) {
  const router = express.Router();
  app.use('/', router);

  // Route to get redis server status
  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  // Returns number of users and files in DB
  router.get('/stats', (req, res) => {
    AppController.getStatus(req, res);
  });
}

export default controllerRouting;
