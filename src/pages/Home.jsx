// SplashScreen.jsx
import './Home.css';
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); // Redirect to /login after 7 seconds
    }, 10000); // 7 seconds

    return () => clearTimeout(timer); // Cleanup
  }, [navigate]);

  return (
    <section className="home">
      <div className="home__container">
        <h1>Welcome Traveler</h1>
        <p>Explore the world with us!</p>
      </div>
    </section>
  );
}
