import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvc, setCVC] = useState("");
  const [zip, setZip] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state;

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validateString = (value) => /^[A-Za-z]+$/.test(value);
  const validateCardNumber = (value) =>
    /^\d{16}$/.test(value.replace(/\s/g, ""));
  const validateExpirationDate = (value) =>
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
  const validateCVC = (value) => /^\d{3}$/.test(value);
  const validateZip = (value) => /^\d{5}$/.test(value);

  const formatCardNumber = (value) => {
    return value.replace(/\s?/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleExpirationDateChange = (value) => {
    let cleanedValue = value.replace(/\D/g, "");

    if (cleanedValue.length > 2) {
      cleanedValue = `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 4)}`;
    }

    return cleanedValue;
  };

  const handleInputChange = (field, value) => {
    let newErrors = { ...errors };

    switch (field) {
      case "email":
        setEmail(value);
        if (!validateEmail(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
      case "firstName":
        const firstNameValue = value.replace(/[^A-Za-z]/g, "");
        setFirstName(firstNameValue);
        if (!validateString(firstNameValue)) {
          newErrors.firstName = "First Name can only contain letters";
        } else {
          delete newErrors.firstName;
        }
        break;
      case "lastName":
        const lastNameValue = value.replace(/[^A-Za-z]/g, "");
        setLastName(lastNameValue);
        if (!validateString(lastNameValue)) {
          newErrors.lastName = "Last Name can only contain letters";
        } else {
          delete newErrors.lastName;
        }
        break;
      case "cardNumber":
        const formattedCardNumber = formatCardNumber(
          value.replace(/\D/g, "").slice(0, 16)
        );
        setCardNumber(formattedCardNumber);
        if (!validateCardNumber(formattedCardNumber)) {
          newErrors.cardNumber = "Card Number must be exactly 16 digits";
        } else {
          delete newErrors.cardNumber;
        }
        break;
      case "expirationDate":
        const formattedExpirationDate = handleExpirationDateChange(value);
        setExpirationDate(formattedExpirationDate);
        if (!validateExpirationDate(formattedExpirationDate)) {
          newErrors.expirationDate =
            "Expiration Date must follow the MM/YY format";
        } else {
          delete newErrors.expirationDate;
        }
        break;
      case "cvc":
        const cvcValue = value.replace(/\D/g, "").slice(0, 3);
        setCVC(cvcValue);
        if (!validateCVC(cvcValue)) {
          newErrors.cvc = "CVC must be exactly 3 digits.";
        } else {
          delete newErrors.cvc;
        }
        break;
      case "zip":
        const zipValue = value.replace(/\D/g, "").slice(0, 5);
        setZip(zipValue);
        if (!validateZip(zipValue)) {
          newErrors.zip = "ZIP code must be exactly 5 digits.";
        } else {
          delete newErrors.zip;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handlePayment = async () => {
    if (
      Object.keys(errors).length > 0 ||
      !email ||
      !firstName ||
      !lastName ||
      !cardNumber ||
      !expirationDate ||
      !cvc ||
      !zip
    ) {
      alert("Please fill in all the fields correctly before submitting.");
      return;
    }

    try {
      if (!orderData || !orderData.amount) {
        console.error(
          "Order data is not available or missing required fields."
        );
        return;
      }

      const updatedOrderData = { ...orderData, payment: true };
      console.log("Updated Order Data:", updatedOrderData);

      await axios.post(
        "http://localhost:3001/api/orders/add-order",
        updatedOrderData
      );

      setTimeout(() => {
        alert("Payment Successful");
        navigate("/my-orders");
      }, 1000);
    } catch (error) {
      console.error("Payment error:", error);
      alert("An error occurred during payment. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex items-center">
      <form className="w-full bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Payment Summary
        </h2>

        <div className="mb-4">
          <div className="border border-blue-500 rounded-md p-4 bg-blue-50 text-blue-700 text-lg font-medium hover:bg-blue-100 transition-colors">
            Amount to Pay LKR {orderData?.amount ?? "N/A"}
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-800">
          Personal Information
        </h3>

        <div className="space-y-4">
          <div className="w-full max-w-sm min-w-[200px]">
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`peer w-full bg-transparent text-gray-700 text-sm border border-gray-200 rounded-md px-3 py-2.5 transition duration-300 ease focus:outline-none focus:border-gray-400 hover:border-gray-300 shadow-sm focus:shadow ${
                  errors.email ? "border-red-400" : ""
                }`}
              />
              <label
                htmlFor="email"
                className={`absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-gray-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-gray-400 peer-focus:scale-90 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-400 peer-not-placeholder-shown:scale-90`}
              >
                Email Address
              </label>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2 max-w-[150px] min-w-[100px]">
              <div className="relative">
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className={`peer w-full bg-transparent text-gray-700 text-sm border border-gray-200 rounded-md px-3 py-2.5 transition duration-300 ease focus:outline-none focus:border-gray-400 hover:border-gray-300 shadow-sm focus:shadow ${
                    errors.firstName ? "border-red-400" : ""
                  }`}
                />
                <label
                  htmlFor="firstName"
                  className={`absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-gray-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-gray-400 peer-focus:scale-90 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-400 peer-not-placeholder-shown:scale-90`}
                >
                  First Name
                </label>
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
            </div>
            <div className="w-1/2 max-w-[150px] min-w-[100px]">
              <div className="relative">
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className={`peer w-full bg-transparent text-gray-700 text-sm border border-gray-200 rounded-md px-3 py-2.5 transition duration-300 ease focus:outline-none focus:border-gray-400 hover:border-gray-300 shadow-sm focus:shadow ${
                    errors.lastName ? "border-red-400" : ""
                  }`}
                />
                <label
                  htmlFor="lastName"
                  className={`absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-gray-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-gray-400 peer-focus:scale-90 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-400 peer-not-placeholder-shown:scale-90`}
                >
                  Last Name
                </label>
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) =>
                  handleInputChange("cardNumber", e.target.value)
                }
                className={`peer w-full bg-transparent text-gray-700 text-sm border border-gray-200 rounded-md px-3 py-2.5 transition duration-300 ease focus:outline-none focus:border-gray-400 hover:border-gray-300 shadow-sm focus:shadow ${
                  errors.cardNumber ? "border-red-400" : ""
                }`}
              />
              <label
                htmlFor="cardNumber"
                className={`absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-gray-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-gray-400 peer-focus:scale-90 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-400 peer-not-placeholder-shown:scale-90`}
              >
                Card Number
              </label>
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/3 max-w-[120px] min-w-[80px]">
              <div className="relative">
                <input
                  type="text"
                  id="expirationDate"
                  value={expirationDate}
                  onChange={(e) =>
                    handleInputChange("expirationDate", e.target.value)
                  }
                  className={`peer w-full bg-transparent text-gray-700 text-sm border border-gray-200 rounded-md px-3 py-2.5 transition duration-300 ease focus:outline-none focus:border-gray-400 hover:border-gray-300 shadow-sm focus:shadow ${
                    errors.expirationDate ? "border-red-400" : ""
                  }`}
                />
                <label
                  htmlFor="expirationDate"
                  className={`absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-gray-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-gray-400 peer-focus:scale-90 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-400 peer-not-placeholder-shown:scale-90`}
                >
                  MM/YY
                </label>
                {errors.expirationDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.expirationDate}
                  </p>
                )}
              </div>
            </div>
            <div className="w-1/3 max-w-[120px] min-w-[80px]">
              <div className="relative">
                <input
                  type="text"
                  id="cvc"
                  value={cvc}
                  onChange={(e) => handleInputChange("cvc", e.target.value)}
                  className={`peer w-full bg-transparent text-gray-700 text-sm border border-gray-200 rounded-md px-3 py-2.5 transition duration-300 ease focus:outline-none focus:border-gray-400 hover:border-gray-300 shadow-sm focus:shadow ${
                    errors.cvc ? "border-red-400" : ""
                  }`}
                />
                <label
                  htmlFor="cvc"
                  className={`absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-gray-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-gray-400 peer-focus:scale-90 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-400 peer-not-placeholder-shown:scale-90`}
                >
                  CVC
                </label>
                {errors.cvc && (
                  <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
                )}
              </div>
            </div>
            <div className="w-1/3 max-w-[120px] min-w-[80px]">
              <div className="relative">
                <input
                  type="text"
                  id="zip"
                  value={zip}
                  onChange={(e) => handleInputChange("zip", e.target.value)}
                  className={`peer w-full bg-transparent text-gray-700 text-sm border border-gray-200 rounded-md px-3 py-2.5 transition duration-300 ease focus:outline-none focus:border-gray-400 hover:border-gray-300 shadow-sm focus:shadow ${
                    errors.zip ? "border-red-400" : ""
                  }`}
                />
                <label
                  htmlFor="zip"
                  className={`absolute cursor-text bg-white px-1 left-2.5 top-2.5 text-gray-400 text-sm transition-all transform origin-left peer-focus:-top-2 peer-focus:left-2.5 peer-focus:text-xs peer-focus:text-gray-400 peer-focus:scale-90 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-gray-400 peer-not-placeholder-shown:scale-90`}
                >
                  ZIP
                </label>
                {errors.zip && (
                  <p className="text-red-500 text-xs mt-1">{errors.zip}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePayment}
            className="w-full py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Pay Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentPage;
