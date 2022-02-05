/**
 * Use the api https://api.jonathanczyzyk.com/api/v1/images/small to retrieve the images.
 * You will need to send a GET http call with the header x-api-key="api-key-9b0054fe-b875-4eac-8e0a-1bbcccd0c2fb"
 */

const axios = require('axios');
const _ = require('lodash');

const paginatedImages = {};

const PAGE_SIZE = 15;

const getPaginatedImages = async (page) => {
  return _getPage(page);
};

const likeImage = async (imageId) => {
  const page = Math.floor(imageId / PAGE_SIZE);
  const cachedPage = await _getPage(page, imageId);
  const image = cachedPage.images.find((i) => i.id === imageId);
  image.liked = true;
  image.likes++;
  return { id: imageId, page };
};

const _getPage = async (page, imageId = null) => {
  if (_.isEmpty(paginatedImages)) {
    await _fetchAllImages();
  }
  if (imageId) {
    _checkValidImage(imageId);
  }
  _checkBadPage(page);
  return paginatedImages[page];
};

const _checkValidImage = (imageId) => {
  if (imageId >= paginatedImages.totalImages || imageId < 0) {
    throw new Error('NotFound');
  }
};

const _fetchAllImages = async () => {
  const { data: images } = await axios.get(
    'https://api.jonathanczyzyk.com/api/v1/images/small',
    {
      headers: {
        'x-api-key': 'api-key-9b0054fe-b875-4eac-8e0a-1bbcccd0c2fb',
      },
    },
  );
  let currentPage = 0;
  let currentImages = [];
  let totalImages = 0;
  for (const image of images) {
    image.id = totalImages;
    currentImages.push(image);
    totalImages++;
    if (
      currentImages.length === PAGE_SIZE ||
      totalImages === images.length - 1
    ) {
      paginatedImages[currentPage] = {
        images: _.clone(currentImages),
        nextPage:
          (totalImages !== images.length - 1 && currentPage + 1) || null,
      };
      currentPage++;
      currentImages = [];
    }
  }
  paginatedImages.totalPages = currentPage;
  paginatedImages.totalImages = totalImages;
};

const _checkBadPage = (page) => {
  if (page >= paginatedImages.totalPages || page < 0) {
    throw new Error('BadRequest');
  }
};

module.exports = {
  getPaginatedImages,
  likeImage,
};
