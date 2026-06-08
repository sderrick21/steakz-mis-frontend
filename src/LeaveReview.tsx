import React, { useState } from 'react';

const LeaveReview: React.FC = () => {
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Leave a Review</h1>
      {submitted ? (
        <div className="bg-green-100 text-green-800 p-4 rounded">Thank you for your review!</div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <textarea
            className="border p-2 rounded"
            name="review"
            placeholder="Write your review here..."
            value={review}
            onChange={e => setReview(e.target.value)}
            rows={5}
            required
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Submit Review</button>
        </form>
      )}
    </div>
  );
};

export default LeaveReview;
