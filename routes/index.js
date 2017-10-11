import express from 'express';

const router = express.Router();

/* GET index page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Hellooooooo'
  });
});

/* GET another page. */
router.get('/lol', (req, res) => {
    res.render('index', {
        title: 'LOL'
    });
});

export default router;
