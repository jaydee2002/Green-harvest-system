import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaMicrophone } from "react-icons/fa";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const { food_list } = useContext(StoreContext);
  const [cartItems, setCartItems] = useState({});
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.post("http://localhost:3001/api/cart/get");
        if (response.data.success) {
          setCartItems(response.data.cartData);
          console.log("Fetched Cart Data:", response.data.cartData);
        } else {
          console.error("Failed to fetch cart data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, []);

  const handleRemoveFromCart = async (itemId) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/cart/remove",
        {
          userId: "6139e2b53e8bfc456789abcd",
          itemId: itemId,
        }
      );

      if (response.data.success) {
        console.log("Item removed from cart:", itemId);
        setCartItems((prevItems) => {
          const updatedItems = { ...prevItems };
          delete updatedItems[itemId];
          return updatedItems;
        });
      } else {
        console.error(
          "Failed to remove item from cart:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleQuantityChange = (itemId, change) => {
    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };
      const newQuantity = updatedItems[itemId] + change;
      if (newQuantity > 0) {
        updatedItems[itemId] = newQuantity;
      }
      return updatedItems;
    });
  };

  const calculateDiscountPercentage = (quantity) => {
    if (quantity >= 10 && quantity <= 25) return 5;
    if (quantity >= 26 && quantity <= 50) return 7;
    if (quantity >= 51 && quantity <= 100) return 11;
    if (quantity > 100) return 14;
    return 0;
  };

  const calculateTotal = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const product = food_list.find((item) => item._id === itemId);
      const quantity = cartItems[itemId];
      const discountPercentage = calculateDiscountPercentage(quantity) / 100;
      const discountedPrice = product
        ? product.price * (1 - discountPercentage) * quantity
        : 0;
      return total + discountedPrice;
    }, 0);
  };

  const calculateNetWeight = () => {
    return Object.values(cartItems).reduce(
      (totalWeight, quantity) => totalWeight + quantity,
      0
    );
  };

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onresult = (event) => {
    const voiceCommand = event.results[0][0].transcript.toLowerCase();
    console.log("Voice Command:", voiceCommand);

    if (voiceCommand.includes("remove")) {
      let productToRemove;
      if (voiceCommand.includes("from the cart")) {
        productToRemove = voiceCommand
          .split("remove ")[1]
          .split(" from the cart")[0]
          .trim();
      } else {
        productToRemove = voiceCommand.split("remove ")[1].trim();
      }

      const product = food_list.find(
        (item) => item.name.toLowerCase() === productToRemove.toLowerCase()
      );

      if (product) {
        handleRemoveFromCart(product._id);
        alert(`"${product.name}" has been removed from your cart.`);
      } else {
        alert(`Product "${productToRemove}" not found in the cart.`);
      }
    }
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  const handleVoiceCommand = () => {
    recognition.start();
  };

  return (
    <div className="flex items-center min-h-screen justify-center">
      <div className="bg-white  p-6 rounded-xl border w-full max-w-5xl mx-4">
        <h1 className="text-3xl font-semibold mb-8 text-gray-900">Your Cart</h1>

        {Object.keys(cartItems).length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
            <p className="ml-3 text-sm text-gray-500">Loading...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b">
                    <th className="pb-4">Product</th>
                    <th className="pb-4">Quantity</th>
                    <th className="pb-4">Discount</th>
                    <th className="pb-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(cartItems).map((itemId) => {
                    const product = food_list.find(
                      (item) => item._id === itemId
                    );
                    if (!product) {
                      console.warn(
                        `Product with ID ${itemId} not found in food_list.`
                      );
                      return null;
                    }

                    const quantity = cartItems[itemId];
                    const discountPercentage =
                      calculateDiscountPercentage(quantity);
                    const discountedPrice =
                      product.price * (1 - discountPercentage / 100) * quantity;

                    return (
                      <tr
                        key={itemId}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 flex items-center">
                          <div className="w-12 h-12 mr-3 rounded-md overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Rs {product.price.toFixed(2)}
                            </p>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="flex items-center border rounded-md">
                              <button
                                onClick={() => handleQuantityChange(itemId, -1)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 text-sm">
                                {cartItems[itemId]} Kg
                              </span>
                              <button
                                onClick={() => handleQuantityChange(itemId, 1)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            <button
                              className="ml-3 text-gray-400 hover:text-red-500"
                              onClick={() => handleRemoveFromCart(itemId)}
                            >
                              <Trash2 size={18} className="text-red-500" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {discountPercentage}%
                        </td>
                        <td className="py-4 text-right text-sm font-medium">
                          <p className="line-through text-gray-400">
                            Rs {product.price.toFixed(2)}
                          </p>
                          Rs {discountedPrice.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
                <div className="mb-4 sm:mb-0">
                  <span className="text-gray-500">Net Weight</span>
                  <p className="font-medium text-gray-900">
                    {calculateNetWeight()} Kg
                  </p>
                </div>
                <div className="mb-4 sm:mb-0">
                  <span className="text-gray-500">Total</span>
                  <p className="font-semibold text-lg text-gray-900">
                    Rs {calculateTotal().toFixed(2)}
                  </p>
                </div>
                <Link to="/checkout">
                  <button className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                    Checkout
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}

        <div className="fixed bottom-6 right-6 group">
          <div className="relative">
            <div
              className={`absolute inset-0 flex items-center justify-center ${
                isListening ? "" : "hidden"
              }`}
            >
              <div className="absolute w-full h-full rounded-full border-2 border-blue-300 opacity-70 animate-ping"></div>
              <div className="absolute w-full h-full rounded-full border-2 border-blue-300 opacity-50 animate-ping delay-150"></div>
            </div>

            <div
              className={`absolute -top-12 left-1/2 transform -translate-x-1/2 ${
                isListening ? "block" : "hidden"
              }`}
            >
              <div className="flex space-x-1">
                <span className="block w-1 h-5 bg-blue-500 animate-[voice-wave_0.5s_ease-in-out_infinite_alternate]"></span>
                <span className="block w-1 h-7 bg-blue-500 animate-[voice-wave_0.5s_ease-in-out_infinite_alternate_0.1s]"></span>
                <span className="block w-1 h-4 bg-blue-500 animate-[voice-wave_0.5s_ease-in-out_infinite_alternate_0.2s]"></span>
                <span className="block w-1 h-6 bg-blue-500 animate-[voice-wave_0.5s_ease-in-out_infinite_alternate_0.3s]"></span>
              </div>
            </div>

            <button
              onClick={handleVoiceCommand}
              className={`p-3 rounded-full text-white shadow-md transition-all ${
                isListening
                  ? "bg-blue-500 scale-110"
                  : "bg-gray-300 hover:bg-blue-400"
              }`}
              title="Voice Assistant"
            >
              <FaMicrophone size={20} />
            </button>
          </div>

          <div className="opacity-0 group-hover:opacity-100 absolute bottom-12 right-1/2 translate-x-1/2 bg-gray-700 text-white text-xs py-1 px-2 rounded transition-opacity">
            {isListening ? "Listening..." : "Voice Command"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
