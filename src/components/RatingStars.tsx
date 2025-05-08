
import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  setRating: (rating: number) => void;
}

const RatingStars = ({ rating, setRating }: RatingStarsProps) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-6 w-6 cursor-pointer ${
            star <= rating ? 'fill-robot-blue text-robot-blue' : 'text-gray-300'
          }`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setRating(star)}
        />
      ))}
    </div>
  );
};

export default RatingStars;
