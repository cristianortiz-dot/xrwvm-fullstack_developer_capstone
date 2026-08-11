import React, { useEffect, useState } from "react";
import "./Dealers.css";

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("All");
  const [username, setUsername] = useState(sessionStorage.getItem("username") || "");

  const djangoUrl = window.location.origin;

  const getDealers = async (state) => {
    const endpoint =
      state && state !== "All"
        ? `/djangoapp/get_dealers/${state}`
        : "/djangoapp/get_dealers";
    const res = await fetch(djangoUrl + endpoint);
    const json = await res.json();
    const dealers = json.dealers || [];
    setDealersList(dealers);
    if (states.length === 0) {
      setStates([...new Set(dealers.map((d) => d.state))].sort());
    }
  };

  useEffect(() => {
    getDealers("All");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    getDealers(state);
  };

  const logout = async () => {
    await fetch(djangoUrl + "/djangoapp/logout");
    sessionStorage.removeItem("username");
    window.location.href = "/";
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
          {username ? (
            <>
              <span>{username}</span>
              <a href="/" onClick={logout}>
                Logout
              </a>
            </>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </>
          )}
        </div>
      </nav>

      <div className="container-section">
        <h1>Our Dealerships</h1>

        <label htmlFor="stateSelect">
          <strong>Filter by State: </strong>
        </label>
        <select id="stateSelect" value={selectedState} onChange={handleStateChange}>
          <option value="All">All States</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <table className="dealers">
          <thead>
            <tr>
              <th>ID</th>
              <th>Dealer Name</th>
              <th>City</th>
              <th>Address</th>
              <th>Zip</th>
              <th>State</th>
              {username && <th>Review Dealer</th>}
            </tr>
          </thead>
          <tbody>
            {dealersList.map((dealer) => (
              <tr key={dealer.id}>
                <td>{dealer.id}</td>
                <td>
                  <a href={`/dealer/${dealer.id}`}>{dealer.short_name}</a>
                </td>
                <td>{dealer.city}</td>
                <td>{dealer.address}</td>
                <td>{dealer.zip}</td>
                <td>{dealer.state}</td>
                {username && (
                  <td>
                    <a href={`/postreview/${dealer.id}`}>Write a review</a>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dealers;
