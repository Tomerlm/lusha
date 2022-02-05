import React, { useMemo, useState, useCallback } from 'react';
import './Image.scss';
import { ReactComponent as Heart } from '../../assets/iconmonstr-heart-thin.svg';

export default function ImageView({ image, onLike }) {
  const [isHovered, setIsHovered] = useState(false);

  const toggleHover = useCallback(() => {
    setIsHovered(!isHovered);
  }, [isHovered]);

  const handleDoubleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (!image.liked) {
        onLike(image.id);
      }
    },
    [image, onLike],
  );

  return useMemo(
    () => (
      <div
        className="imageViewContainer"
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
        onDoubleClick={handleDoubleClick}
      >
        {isHovered && (
          <div className="imageOverlay">
            <div className="desc">{image.description}</div>
            <div className="likesContainer">
              <Heart className={`heart${image.liked ? ' heartRed' : ''}`} />
              {image.likes}
            </div>
          </div>
        )}
        <img src={image.url} alt={image.description} />
      </div>
    ),
    [image, isHovered, toggleHover, handleDoubleClick],
  );
}
