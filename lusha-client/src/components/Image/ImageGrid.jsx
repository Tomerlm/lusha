import React, { useEffect, useState } from 'react';
import './Image.scss';
import ImageView from './ImageView';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { getImages, likeImage } from '../../api/image';
import { IMAGE_VIEW_HEIGHT } from '../../consts';
import { getUpdatedPagesClone } from '../../utils';

export default function EventGrid() {
  const queryClient = useQueryClient();
  const [currentScroll, setCurrentScroll] = useState({
    height: 0,
    top: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const { data, isFetching, fetchNextPage, fetchPreviousPage } =
    useInfiniteQuery('images', getImages);
  const imageMutation = useMutation(likeImage, {
    onMutate: async (imageId) => {
      // this function handles optimistic update
      await queryClient.cancelQueries('images');
      const oldImages = queryClient.getQueryData('images');
      queryClient.setQueryData('images', (oldData) =>
        getUpdatedPagesClone(oldData, imageId),
      );
      return { oldImages };
    },
    onError: (err, newImages, context) => {
      // fallback in case update fails
      queryClient.setQueryData('images', context.oldImages);
    },
  });

  useEffect(() => {
    // fetches data when page changes

    if (data) {
      if (
        currentPage >= data.pages.length &&
        data.pages[data.pages.length - 1].nextPage
      ) {
        fetchNextPage({ pageParam: data.pages.length });
      }
    }
  }, [currentPage, fetchNextPage, fetchPreviousPage, data]);

  useEffect(() => {
    // change page according to scroll
    const { height, top } = currentScroll;
    if (height && top + IMAGE_VIEW_HEIGHT * 4 > height - IMAGE_VIEW_HEIGHT) {
      setCurrentPage((page) => page + 1);
    }
  }, [currentScroll]);

  const images = React.useMemo(
    () =>
      data?.pages.reduce((acc, curr) => {
        acc = acc.concat(curr.images);
        return acc;
      }, []) || [],
    [data],
  );

  if (isFetching && !data?.pages.length) {
    return <div>Loading...</div>;
  } else {
    return (
      <div
        className="gridContainer"
        onScroll={(e) => {
          setCurrentScroll({
            height: e.target.scrollHeight,
            top: e.target.scrollTop,
          });
        }}
      >
        <div className="gridBody">
          {images.map((image) => (
            <ImageView
              image={image}
              key={`image_${image.id}`}
              onLike={() => imageMutation.mutate(image.id)}
            ></ImageView>
          ))}
        </div>
      </div>
    );
  }
}
