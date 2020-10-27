import { Router } from 'express';
import { CurrentUser } from '@hsftickets/common';

const router = Router();

router.get('/api/users/currentuser', CurrentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export default router;
