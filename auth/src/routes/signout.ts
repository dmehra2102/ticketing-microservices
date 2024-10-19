import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
   req.session = null;

   res.status(200).send({ message: 'Logout Successful!' });
});

export { router as signoutRouter };
