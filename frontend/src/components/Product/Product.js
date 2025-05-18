import React, { useContext } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const Product = ({ id, name, price, description, image, onClick }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  return (
    <div
      className="max-w-sm rounded-lg overflow-hidden bg-white border border-gray-100 hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        {!cartItems[id] ? (
          <button
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(id, 2);
            }}
          >
            <ShoppingCart size={16} />
            Add
          </button>
        ) : (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white border border-gray-200 rounded-md p-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFromCart(id, 2);
              }}
              className="p-1 text-red-500 hover:bg-gray-100 rounded-sm transition-colors"
            >
              <Minus size={16} />
            </button>
            <p className="text-sm font-medium text-gray-900 px-2">
              {cartItems[id]}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(id, 2);
              }}
              className="p-1 text-green-500 hover:bg-gray-100 rounded-sm transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-lg font-semibold text-gray-900 mb-1">{name}</p>
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">{description}</p>
        <p className="text-gray-900 font-bold">
          LKR <span className="text-xl">{price}.00</span>
        </p>
      </div>
    </div>
  );
};

export default Product;
