import { PAGE_SIZE } from './consts';
import cloneDeep from 'lodash/cloneDeep';

export const getUpdatedPagesClone = (oldData, imageId) => {
  const { pages: oldPages } = oldData;
  const page = Math.floor(imageId / PAGE_SIZE);
  const idx = oldPages[page].images.findIndex((i) => i.id === imageId);
  const image = oldPages[page].images[idx];
  const newImage = {
    ...image,
    likes: image.likes + 1,
    liked: true,
  };
  const newData = cloneDeep(oldData);
  const { pages: newPages } = newData;
  newPages[page].images[idx] = newImage;
  return newData;
};
