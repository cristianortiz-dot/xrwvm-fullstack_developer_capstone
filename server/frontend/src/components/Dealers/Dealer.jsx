import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Dealers.css";

const Dealer = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [username] = useState(sessionStorage.getItem("username") || "");

  const djangoUrl = window.location.origin;

  useEffect(() => {
    const fetchData = async () => {
      const dealerRes = await fetch(djangoUrl + `/djangoapp/dealer/${id}`);
      const dealerJson = await dealerRes.json();
      const dealerData = Array.isArray(dealerJson.dealer)
        ? dealerJson.dealer[0]
        : dealerJson.dealer;
      setDealer(dealerData);

      const reviewsRes = await fetch(djangoUrl + `/djangoapp/reviews/dealer/${id}`);
      const reviewsJson = await reviewsRes.json();
      setReviews(reviewsJson.reviews || []);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const sentimentIcon = (sentiment) => {
    if (sentiment === "positive") return "🙂";
    if (sentiment === "negative") return "🙁";
    return "😐";
  };

  return (
    <div>
      <nav className="navbar">
        <a className="brand" href="/">
          Dealerships
        </a>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/about/">About Us</a>
          <a href="/contact/">Contact Us</a>
        </div>
        <div className="user-info">
          {username ? <span>{username}</span> : <a href="/login">Login</a>}
        </div>
      </nav>

      <div className="container-section">
        {dealer ? (
          <>
            <div className="dealer-header">
              <h1>{dealer.full_name || dealer.short_name}</h1>
              {username && (
                <a className="write-review-btn" href={`/postreview/${id}`}>
                  ✍️ Write a review
                </a>
              )}
            </div>
            <p>
              {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
            </p>
          </>
        ) : (
          <p>Loading dealer details...</p>
        )}

        <h2>Reviews</h2>
        {reviews.length === 0 && <p>No reviews yet for this dealer.</p>}
        <div className="reviews-list">
          {reviews.map((review) => (
            <div className="review-card" key={review.id}>
              <p>{sentimentIcon(review.sentiment)} {review.review}</p>
              <p className="review-meta">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dealer;
