import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import validateForm from "../../Validation/orderForm_validate";

const OrderForm = () => {
  const { id } = useParams();
  const { food_list, cartItems } = useContext(StoreContext);
  const product = food_list.find((item) => item._id === id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    address: {
      country: "",
      street: "",
      city: "",
      postalCode: "",
      phone: "",
    },
    billingAddress: {
      country: "",
      street: "",
      city: "",
      postalCode: "",
      phone: "",
    },
    billingAddressOption: "same",
  });

  const [isSameAsShipping, setIsSameAsShipping] = useState(true);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [field, subfield] = name.split(".");

    if (name === "address.phone" || name === "billingAddress.phone") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 10) {
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [subfield]: numericValue },
      }));
    } else if (
      name === "address.postalCode" ||
      name === "billingAddress.postalCode"
    ) {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length > 5) {
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [subfield]: numericValue },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: subfield ? { ...prev[field], [subfield]: value } : value,
      }));
    }

    const tempFormData = {
      ...formData,
      [field]: subfield ? { ...formData[field], [subfield]: value } : value,
    };

    const validationErrors = validateForm(tempFormData);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      const errorKey = subfield
        ? `${field}${subfield.charAt(0).toUpperCase() + subfield.slice(1)}`
        : name;

      if (validationErrors[errorKey]) {
        newErrors[errorKey] = validationErrors[errorKey];
      } else {
        delete newErrors[errorKey];
      }

      return newErrors;
    });
  };

  const handleBillingAddressToggle = (e) => {
    setIsSameAsShipping(e.target.value === "same");
  };

  useEffect(() => {
    if (isSameAsShipping) {
      setFormData((prev) => ({
        ...prev,
        billingAddress: { ...prev.address },
      }));
    }
  }, [isSameAsShipping, formData.address]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const orderData = {
      userId: formData.userId,
      items: [
        {
          id: product._id,
          name: product.name,
          qty: cartItems[id],
          price: product.price,
          image: product.image,
        },
      ],
      amount: product.price * cartItems[id] + 250,
      address: formData.address,
      billingAddress: formData.billingAddress,
      payment: false,
    };

    try {
      navigate("/payment", { state: orderData });
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto 0 min-h-screen flex items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white rounded-xl shadow-sm p-6 space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-900">Order Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Shipping Address
              </h3>
              <div className="space-y-4">
                {["street", "city", "country", "postalCode", "phone"].map(
                  (field) => (
                    <div key={field} className="w-full max-w-sm min-w-[200px]">
                      <div className="relative">
                        <input
                          name={`address.${field}`}
                          id={`address.${field}`}
                          onChange={handleChange}
                          value={formData.address[field]}
                          placeholder=" "
                          className={`peer w-full bg-transparent text-gray-700 text-sm border border-gray-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-gray-400 hover:border-gray-300 shadow-sm focus:shadow ${
                            errors[
                              `address${
                                field.charAt(0).toUpperCase() + field.slice(1)
                              }`
                            ]
                              ? "border-red-400"
                              : ""
                          }`}
                          required
                        />
                        <label
                          htmlFor={`address.${field}`}
                          className={`absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-gray-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-gray-400 peer-focus:scale-90 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-400 peer-valid:scale-90`}
                        >
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        {errors[
                          `address${
                            field.charAt(0).toUpperCase() + field.slice(1)
                          }`
                        ] && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              errors[
                                `address${
                                  field.charAt(0).toUpperCase() + field.slice(1)
                                }`
                              ]
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Billing Address
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="billingAddressOption"
                    value="same"
                    checked={isSameAsShipping}
                    onChange={handleBillingAddressToggle}
                    className="mr-2 accent-blue-500"
                  />
                  <label className="text-sm text-gray-600">
                    Same as shipping address
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="billingAddressOption"
                    value="different"
                    checked={!isSameAsShipping}
                    onChange={handleBillingAddressToggle}
                    className="mr-2 accent-blue-500"
                  />
                  <label className="text-sm text-gray-600">
                    Use a different billing address
                  </label>
                </div>

                {!isSameAsShipping &&
                  ["street", "city", "country", "postalCode", "phone"].map(
                    (field) => (
                      <div
                        key={field}
                        className="w-full max-w-sm min-w-[200px]"
                      >
                        <div className="relative">
                          <input
                            name={`billingAddress.${field}`}
                            id={`billingAddress.${field}`}
                            onChange={handleChange}
                            value={formData.billingAddress[field]}
                            placeholder=" "
                            className={`peer w-full bg-transparent text-gray-700 text-sm border border-gray-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-gray-400 hover:border-gray-300 shadow-sm focus:shadow ${
                              errors[
                                `billingAddress${
                                  field.charAt(0).toUpperCase() + field.slice(1)
                                }`
                              ]
                                ? "border-red-400"
                                : ""
                            }`}
                            required
                          />
                          <label
                            htmlFor={`billingAddress.${field}`}
                            className={`absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-gray-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-gray-400 peer-focus:scale-90 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-400 peer-valid:scale-90`}
                          >
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          {errors[
                            `billingAddress${
                              field.charAt(0).toUpperCase() + field.slice(1)
                            }`
                          ] && (
                            <p className="text-red-500 text-xs mt-1">
                              {
                                errors[
                                  `billingAddress${
                                    field.charAt(0).toUpperCase() +
                                    field.slice(1)
                                  }`
                                ]
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  )}
              </div>
            </section>

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-500">{cartItems[id]} Kg</p>
                </div>
                <p className="font-medium">Rs {product.price}.00</p>
              </div>
            </div>

            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs {product.price * cartItems[id]}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>Rs 250.00</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs {product.price * cartItems[id] + 250}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
