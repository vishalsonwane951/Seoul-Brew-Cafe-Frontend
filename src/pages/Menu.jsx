import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import API from '../services/api'

function Menu() {
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState("");
  const { addToCart } = useContext(CartContext);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/menu");
      console.log(`API: ${API}`)
      setMenu(res.data);
    } catch (err) {
      setError("Failed to load menu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        {error} <button onClick={fetchMenu} className="ml-2 underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 p-6 bg-cream min-h-screen">
      {menu.map((item) => {
        const [hover, setHover] = useState(false);
        return (
          <div
            key={item._id}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={`bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 ${hover ? "scale-105" : "scale-100"}`}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold text-darkCoffee">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-coffee font-semibold mt-2">₹ {item.price}</p>

              <button
                onClick={() => addToCart(item)}
                className="mt-3 bg-coffee text-white px-4 py-2 rounded-lg hover:bg-darkCoffee transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Menu;