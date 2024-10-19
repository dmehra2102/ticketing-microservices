import express from 'express';
import { currentUserMiddleware } from '../middlewares/current-user.middleware';

const router = express.Router();

router.get('/details', currentUserMiddleware, (req, res) => {
   const user = req.currentUser;
   res.send({ currentUser: user || null });
});

export { router as currentUserRouter };
