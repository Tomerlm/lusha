const expect = require('chai').expect;
const { default: axios } = require('axios');

const baseUrl = 'http://localhost:3001/api';

const enpoints = {
  getPage: (page) => `${baseUrl}/image?page=${page}`,
  likeImage: (imageId) => `${baseUrl}/image/${imageId}`,
};

describe('Images', () => {
  describe('Get Images', async () => {
    it('returns 15 images for page 1', async () => {
      const response = await axios.get(enpoints.getPage(1));
      expect(response.status).to.equal(200);
      expect(response.data.data.nextPage).to.equal(2);
      expect(response.data.data.images.length).to.equal(15);
      return response;
    });
    it('400 on bad page ', async () => {
      try {
        await axios.get(enpoints.getPage(-1));
      } catch (e) {
        expect(e.response.status).to.equal(400);
      }
      try {
        await axios.get(enpoints.getPage(1000));
      } catch (e) {
        expect(e.response.status).to.equal(400);
      }
    });
  });
  describe('Like an Image', () => {
    it('likes an image with id 100', async () => {
      const imageId = 100;
      const likeResponse = await axios.patch(enpoints.likeImage(imageId));
      expect(likeResponse.status).to.equal(200);
      const page = Math.floor(imageId / 15);
      const response = await axios.get(enpoints.getPage(page));
      expect(response.data.data.nextPage).to.equal(page + 1);
      const image = response.data.data.images.find((i) => i.id === imageId);
      expect(image.liked).to.be.true;
    });

    it('non existing image', async () => {
      const imageIdBig = 10000;
      const imageIdNegative = -1;
      try {
        await axios.patch(enpoints.likeImage(imageIdBig));
      } catch (e) {
        expect(e.response.status).to.equal(404);
      }
      try {
        await axios.patch(enpoints.likeImage(imageIdNegative));
      } catch (e) {
        expect(e.response.status).to.equal(404);
      }
    });
  });
});
