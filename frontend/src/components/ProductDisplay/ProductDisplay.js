import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext.js";
import FoodItem from "../Product/Product";
import { useNavigate } from "react-router-dom";
import { Mic, Headphones } from "lucide-react";

const ProductDisplay = () => {
  const { food_list, addToCart } = useContext(StoreContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Setup SpeechRecognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event) => {
        const voiceSearchTerm = event.results[0][0].transcript;
        setSearchTerm(voiceSearchTerm);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      console.error("Speech Recognition not supported in this browser.");
    }
  }, []);

  const handleVoiceSearch = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsListening(!isListening);
    }
  };

  if (!food_list) {
    return (
      <p className="text-center text-gray-500 text-lg font-medium">
        Loading...
      </p>
    );
  }

  const handleClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (id) => {
    if (addToCart) {
      addToCart(id);
    }
  };

  // Filter and sort food_list
  const filteredFoodList = food_list
    .filter((item) => {
      const matchesSearchTerm = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearchTerm && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "price-asc") return a.price - b.price;
      if (sortOption === "price-desc") return b.price - b.price;
      return 0;
    });

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center w-full md:w-auto gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-gray-900 placeholder-gray-400"
          />
          <button
            onClick={handleVoiceSearch}
            className={`p-3 rounded-md transition duration-200 flex items-center gap-2 text-white text-sm font-medium ${
              isListening
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isListening ? (
              <>
                <Headphones size={18} />
                <span className="hidden sm:inline">Listening</span>
              </>
            ) : (
              <>
                <Mic size={18} />
                <span className="hidden sm:inline">Voice</span>
              </>
            )}
          </button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-44 p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-gray-900"
          >
            <option value="all">All Categories</option>
            <option value="Carrots">Carrots</option>
            <option value="Leeks">Leeks</option>
            <option value="Potatoes">Potatoes</option>
          </select>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full md:w-44 p-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-gray-900"
          >
            <option value="default">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFoodList.length > 0 ? (
          filteredFoodList.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              onClick={() => handleClick(item._id)}
              onAddToCart={() => handleAddToCart(item._id)}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 text-lg font-medium">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDisplay;
