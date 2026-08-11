import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Dealers.css";

const PostReview = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState(null);
  const [carModels, setCarModels] = useState([]);
  const [review, setReview] = useState("");
  const [purchase, setPurchase] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState(new Date().getFullYear());

  const djangoUrl = window.location.origin;
  const username = sessionStorage.getItem("username") || "";

  useEffect(() => {
    const fetchData = async () => {
      const dealerRes = await fetch(djangoUrl + `/djangoapp/dealer/${id}`);
      const dealerJson = await dealerRes.json();
      const dealerData = Array.isArray(dealerJson.dealer)
        ? dealerJson.dealer[0]
        : dealerJson.dealer;
      setDealer(dealerData);

      const carsRes = await fetch(djangoUrl + "/djangoapp/get_cars");
      const carsJson = await carsRes.json();
      setCarModels(carsJson.CarModels || []);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const postReview = async (e) => {
    e.preventDefault();
    const [make, model] = carModel ? carModel.split("|") : ["", ""];

    const reviewData = {
      name: username,
      dealership: id,
      review: review,
      purchase: purchase,
      purchase_date: purchaseDate,
      car_make: make || carMake,
      car_model: model,
      car_year: carYear,
    };

    const res = await fetch(djangoUrl + "/djangoapp/add_review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });
    const json = await res.json();
    if (json.status === 200) {
      window.location.href = `/dealer/${id}`;
    } else {
      alert("Could not post review.");
    }
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
        <div className="user-info">{username && <span>{username}</span>}</div>
      </nav>

      <div className="container-section">
        <h1>{dealer ? dealer.full_name || dealer.short_name : "Post a Review"}</h1>

        <form className="review-form" onSubmit={postReview}>
          <label>Review</label>
          <textarea
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review here"
            required
          />

          <label>
            <input
              type="checkbox"
              checked={purchase}
              onChange={(e) => setPurchase(e.target.checked)}
            />{" "}
            I purchased a car here
          </label>

          <label>Purchase Date</label>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />

          <label>Car Make / Model</label>
          <select value={carModel} onChange={(e) => setCarModel(e.target.value)}>
            <option value="">Select a car</option>
            {carModels.map((c, idx) => (
              <option key={idx} value={`${c.CarMake}|${c.CarModel}`}>
                {c.CarMake} {c.CarModel}
              </option>
            ))}
          </select>

          <label>Car Year</label>
          <input
            type="number"
            value={carYear}
            min="1990"
            max="2030"
            onChange={(e) => setCarYear(e.target.value)}
          />

          <button className="submit" type="submit">
            Post Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostReview;
