import React from "react";
import { FaTrash } from "react-icons/fa";

const QuantitySelector = ({
  quantity,
  onQuantityChange,
  minQuantity = 10,
  maxQuantity = 100,
  handleRemoveItem,
}) => {
  const updateQuantity = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= minQuantity && newQuantity <= maxQuantity) {
      onQuantityChange(newQuantity);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1 shadow-sm border">
        <button
          onClick={() => updateQuantity(-10)}
          disabled={quantity <= minQuantity}
          className="w-8 h-8 flex items-center justify-center bg-white border rounded-lg disabled:opacity-30"
        >
          −
        </button>
        <span className="text-base font-medium w-16 text-center">
          {quantity} Kg
        </span>
        <button
          onClick={() => updateQuantity(10)}
          disabled={quantity >= maxQuantity}
          className="w-8 h-8 flex items-center justify-center bg-white border rounded-lg disabled:opacity-30"
        >
          +
        </button>
      </div>
      {handleRemoveItem && (
        <button
          onClick={handleRemoveItem}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-100 border rounded-lg transition-all"
        >
          <FaTrash size={14} />
        </button>
      )}
    </div>
  );
};

export default QuantitySelector;
