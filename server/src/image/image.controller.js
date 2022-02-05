const express = require('express');
const imageService = require('./image.service');
const router = express.Router();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 0;
  try {
    console.log(`getting images, page ${page}`);
    const images = await imageService.getPaginatedImages(page);
    res.send({ data: images });
  } catch (e) {
    handleError(e, res);
  }
});

router.patch('/:id', async (req, res) => {
  const imageId = parseInt(req.params.id, 10);
  try {
    console.log(`like image id ${imageId}`);
    const result = await imageService.likeImage(imageId);
    res.send(result);
  } catch (e) {
    handleError(e, res);
  }
});

const handleError = (e, res) => {
  console.error(e.message);
  switch (e.message) {
    case 'NotFound':
      res.sendStatus(404);
      break;
    case 'BadRequest':
      res.sendStatus(400);
      break;
    default:
      res.sendStatus(500);
      break;
  }
};

module.exports = router;
