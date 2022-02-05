import axios from 'axios';

const getImages = async ({ pageParam = 0 }) => {
  try {
    const {
      data: { data: events },
    } = await axios.get(`http://localhost:3001/api/image?page=${pageParam}`);
    return events;
  } catch (e) {
    console.error(e.message);
    return e.message;
  }
};

const likeImage = async (id) => {
  try {
    const {
      data: { data: events },
    } = await axios.patch(`http://localhost:3001/api/image/${id}`);
    return events;
  } catch (e) {
    console.error(e.message);
    return e.message;
  }
};

export { getImages, likeImage };
