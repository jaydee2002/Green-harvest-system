import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx"; // Import xlsx for Excel export
import { FileText, FileSpreadsheet } from "lucide-react";
import { Mic } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "./AIAssistant.css";
import AdvancedCharts from "./AdvancedCharts";
import logo from "../components/LogoImage.png";

const OrderAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt"); // Default sort by creation date
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [data, setData] = useState([]); // Initialize as an empty array to avoid iterability issues
  const [isLoading, setIsLoading] = useState(true); // Loading state for API call
  const [isListening, setIsListening] = useState(false); // State to track if the assistant is listening
  const [activeTab, setActiveTab] = useState("allOrders");

  const WIT_AI_TOKEN = "JGRZHK2QCSQ5NHVR6O345MRTYNA27F4F"; // Replace with your Wit.ai token

  const statuses = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];
  const paymentStatuses = ["All", "Paid", "Unpaid"];

  // const vegetables = ["Big Onion", "Fresh Broccoli", "Carrot", "Cabbage", "Onion", "Garlic", "Ginger", "Beetroot", "Radish", "Cucumber"];
  const sortOptions = [
    { value: "createdAt", label: "Order Date" },
    { value: "amount", label: "Total Amount" },
    { value: "status", label: "Status" },
  ];

  const itemsPerPage = 9; // Number of rows per page

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true); // Set loading state
      try {
        const response = await fetch("http://localhost:3001/api/orders/list");
        const result = await response.json();

        // Check if the response contains the 'data' key and if it's an array
        if (result.success && Array.isArray(result.data)) {
          setData(result.data); // Use result.data, which is the actual array
        } else {
          console.error("Unexpected response structure:", result);
          setData([]); // Reset to empty array if structure is not as expected
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setData([]); // Handle error by resetting data to an empty array
      } finally {
        setIsLoading(false); // Stop loading
      }
    };
    fetchOrders();
  }, []);

  // Sort the data based on the selected sort option
  const sortedData = [...data].sort((a, b) => {
    if (sortBy === "amount") {
      // Sort by amount
      return b.amount - a.amount;
    } else {
      return new Date(b[sortBy]) - new Date(a[sortBy]); // Sort by date or other fields
    }
  });

  // Filtered data based on search term, status, and payment status
  const filteredData = sortedData.filter((order) => {
    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;
    const matchesPaymentStatus =
      selectedPaymentStatus === "All" ||
      (selectedPaymentStatus === "Paid" && order.payment) ||
      (selectedPaymentStatus === "Unpaid" && !order.payment);
    const matchesSearchTerm = order.items.some((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesStatus && matchesPaymentStatus && matchesSearchTerm;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Paginate the filtered data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle order status update
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch("http://localhost:3001/api/orders/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          status: newStatus,
        }),
      });
      const result = await response.json();
      if (result.success) {
        // Update the order status locally
        setData((prevData) =>
          prevData.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const exportPDF = () => {
    const input = document.getElementById("table-to-pdf");

    // Capture table section as image for PDF
    html2canvas(input, {
      scale: 2, // Increase resolution of canvas for better quality
      scrollX: 0,
      scrollY: -window.scrollY,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait", // Use portrait for A4
        unit: "mm",
        format: "a4", // Standard A4 size
      });

      const pageHeight = pdf.internal.pageSize.height;

      // Company Header (similar to `generatePDF`)
      const companyName = "GSP Traders Pvt Ltd";
      const address = "A12, Dedicated Economic Centre, Nuwara Eliya, Sri Lanka";
      const email = "gsptraders29@gmail.com";
      const phone = "+94 77 7144 133";
      const imgLogo = logo; // Use imported logo for the header

      // Header - Company details and logo
      pdf.setTextColor("#11532F"); // Company green color
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text(companyName, 195, 20, { align: "right" });

      // Add the company logo
      pdf.addImage(imgLogo, "PNG", 15, 15, 25, 25);

      // Add address and contact details
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(address, 195, 28, { align: "right" });
      pdf.text(`Email: ${email}`, 195, 34, { align: "right" });
      pdf.text(`Phone: ${phone}`, 195, 40, { align: "right" });

      // Divider line below header
      pdf.setDrawColor("#11532F");
      pdf.setLineWidth(1);
      pdf.line(10, 50, 200, 50);

      // Subheader - Report title
      pdf.setFontSize(16);
      pdf.setTextColor(40, 44, 52); // Dark color for header
      pdf.setFont("helvetica", "bold");
      pdf.text("Detailed Sales Report", 105, 60, { align: "center" });

      // Capture and add table as image
      const imgWidth = 190; // Max width for A4 portrait
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add table image after header
      pdf.addImage(imgData, "PNG", 10, 70, imgWidth, imgHeight);

      // Calculate Y position after table
      const afterTableY = 70 + imgHeight + 10;

      // Ensure space for footer, if not add a new page
      if (afterTableY + 30 > pageHeight) {
        pdf.addPage();
      }

      // Footer - positioned near the bottom of the page
      const footerY = pageHeight - 20;

      // Footer divider line
      pdf.setDrawColor("#11532F");
      pdf.setLineWidth(0.5);
      pdf.line(10, footerY - 10, 200, footerY - 10);

      // Footer with generated date
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();

      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Generated on: ${currentDate} at ${currentTime}`,
        105,
        footerY - 5,
        { align: "center" }
      );

      // Footer contact details
      pdf.setFontSize(8);
      pdf.text(
        "Contact us at: info@gsptraders.com | +94 77 7144 133",
        105,
        footerY + 1,
        { align: "center" }
      );

      // Page number
      const pageCount = pdf.internal.getNumberOfPages();
      pdf.setFontSize(8);
      pdf.text(`Page ${pageCount}`, 105, pageHeight - 10, { align: "center" });

      // Save PDF with meaningful filename
      pdf.save("GSP_Traders_Sales_Report.pdf");
    });
  };

  // Export table as Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TableData");
    XLSX.writeFile(workbook, "table.xlsx");
  };

  const speakMessage = (message) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "en-US"; // Set language to English (US)
      utterance.pitch = 1; // Set pitch (range: 0-2)
      utterance.rate = 1; // Set speaking rate (range: 0.1-10)
      utterance.volume = 1; // Set volume (range: 0-1)

      // Speak the message
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Your browser does not support Speech Synthesis.");
    }
  };

  // Start listening using the Web Speech API
  const startListening = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    // speakMessage('Hello! I am your AI assistant. How can I help you today?');

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendToWitAI(transcript); // Send the transcript to Wit.ai
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      speakMessage("Sorry, I couldn't understand that. Please try again.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Send voice input to Wit.ai for intent recognition
  const sendToWitAI = async (command) => {
    try {
      const response = await fetch(
        `https://api.wit.ai/message?v=20241004&q=${encodeURIComponent(
          command
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${WIT_AI_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      handleWitAIResponse(result);
    } catch (error) {
      console.error("Error communicating with Wit.ai:", error);
    }
  };

  // Handle Wit.ai response
  const handleWitAIResponse = (response) => {
    console.log("Wit.ai response:", response);
    const intent = response.intents?.[0]?.name;
    const entities = response.entities;

    switch (intent) {
      case "search_order":
        const productEntity = entities["product:product"]?.[0]?.value;
        if (productEntity) {
          speakMessage("Sure, let me search for the product you mentioned.");
          setSearchTerm(productEntity);
        } else {
          alert("Sorry, I couldn't find the product you mentioned.");
        }
        break;

      case "filter_status":
        const statusEntity =
          entities["status:status"]?.map((e) => e.value?.toLowerCase()) || [];
        const product = entities["product:product"]?.[0]?.value?.toLowerCase(); // Check for product entity
        let matchedStatus = null;
        let isOrderStatus = false; // To track if it's an order status or payment status

        // If a product entity exists, handle it and break
        if (product) {
          setSelectedStatus("All");
          setSelectedPaymentStatus("All");
          setSearchTerm(product);
          speakMessage(
            `I see you're looking for a product named "${productEntity}". Let me search for it.`
          );
          break;
        }

        if (statusEntity.length > 0) {
          // Give priority to statuses other than "all"
          const prioritizedStatuses = statusEntity.filter(
            (status) => status !== "all".toLowerCase()
          );
          const statusToMatch =
            prioritizedStatuses.length > 0
              ? prioritizedStatuses[0]
              : statusEntity[0];

          // Check for matching order status first
          matchedStatus = statuses.find(
            (status) =>
              status.toLowerCase().includes(statusToMatch) ||
              statusToMatch.includes(status.toLowerCase())
          );
          isOrderStatus = !!matchedStatus; // If we found a match, set to true

          if (!matchedStatus) {
            // If no matching order status is found, check payment statuses
            matchedStatus = paymentStatuses.find(
              (paymentStatus) =>
                paymentStatus.toLowerCase() === statusToMatch ||
                statusToMatch === paymentStatus.toLowerCase()
            );
          }

          if (matchedStatus) {
            setSearchTerm("");
            setSelectedStatus("All");
            setSelectedPaymentStatus("All");
            if (isOrderStatus) {
              // It's an order status
              setSelectedStatus(matchedStatus);
              if (matchedStatus === "All") {
                speakMessage("Sure, here is the all the orders.");
              } else {
                speakMessage(
                  `Sure, here is the filtered result of all the ${matchedStatus} orders.`
                );
              }
            } else {
              // It's a payment status
              setSelectedPaymentStatus(matchedStatus);
              if (matchedStatus === "All") {
                speakMessage("Sure, here is the all the orders.");
              } else {
                speakMessage(
                  `Sure, here is the filtered result of all the ${matchedStatus} orders.`
                );
              }
            }
          } else {
            speakMessage("Sorry, I couldn't find the status you mentioned.");
          }
        } else {
          speakMessage("Sorry, I couldn't find the status you mentioned.");
        }
        break;

      case "update_status": {
        // Extract the status, order ID, or order number from the voice command
        let statusEntities = entities["status:status"];
        const orderIdEntity = entities["order_id:order_id"]?.[0]?.value;
        let orderNumberEntity = entities["orderNumber:orderNumber"]?.[0]?.value;

        // Check if multiple status entities are detected
        let statusEntity;
        if (statusEntities && statusEntities.length > 1) {
          // Filter the status entity to pick the correct one based on valid statuses
          statusEntity = statusEntities.find((status) =>
            statuses.some(
              (validStatus) =>
                validStatus.toLowerCase() === status.value?.toLowerCase()
            )
          )?.value;
        } else {
          // Use the first status entity if only one exists
          statusEntity = statusEntities?.[0]?.value?.toLowerCase();
        }

        // Pad orderNumberEntity to match the format in filteredData (e.g., "01", "02", etc.)
        if (orderNumberEntity) {
          orderNumberEntity = orderNumberEntity.padStart(2, "0"); // Pads with zero to ensure two digits
        }

        if (statusEntity && (orderIdEntity || orderNumberEntity)) {
          // Convert status entity to match defined statuses
          const matchedStatus = statuses.find(
            (status) =>
              status.toLowerCase().includes(statusEntity) ||
              statusEntity.includes(status.toLowerCase())
          );

          if (matchedStatus) {
            if (orderIdEntity) {
              // Update order status using the order ID
              updateOrderStatus(orderIdEntity, matchedStatus);
              speakMessage(
                `The status of order ${orderIdEntity} has been updated to ${matchedStatus}.`
              );
            } else if (orderNumberEntity) {
              // Find the order by the order number and update status
              const matchedOrder = filteredData.find(
                (order) => order.orderNumber === orderNumberEntity
              );
              if (matchedOrder) {
                updateOrderStatus(matchedOrder._id, matchedStatus);
                speakMessage(
                  `The status of order ${orderNumberEntity} has been updated to ${matchedStatus}.`
                );
              } else {
                speakMessage(
                  `Sorry, I couldn't find an order with number ${orderNumberEntity}.`
                );
              }
            }
          } else {
            speakMessage("Sorry, I couldn't find the status you mentioned.");
          }
        } else {
          speakMessage(
            "Sorry, I couldn't find the order ID or status in your command."
          );
        }
        break;
      }

      case "export_pdf":
        exportPDF();
        console.log("Exporting as PDF");
        speakMessage("Sure, your PDF has been downloaded.");
        break;

      case "export_excel":
        exportExcel();
        console.log("Exporting as Excel");
        speakMessage("Sure, your Excel sheet has been downloaded.");
        break;

      case "next_page":
        goToNextPage();
        speakMessage("Sure");
        break;

      case "previous_page":
        goToPreviousPage();
        speakMessage("Sure");
        break;
      case "say_hi":
        const humanEntity = entities["human:human"]?.[0]?.value;
        if (humanEntity) {
          speakMessage(`Hi, ${humanEntity}! How can I assist you today?`);
        } else {
          speakMessage("Hi there! How can I assist you today?");
        }
        break;
      default:
        speakMessage("Sorry, I didn't understand what you are saying.");
    }
  };

  return (
    <div className="container max-w-full mx-auto px-2">
      <div className="  ">
        {/* Tab Content */}
        <div>
          {activeTab === "allOrders" ? (
            <div>
              {/* <OrdersTab /> */}
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold text-gray-800">
                  Order Admin
                </h2>

                <div className="flex items-center gap-4">
                  <button
                    onClick={exportExcel}
                    className="px-4 py-2 flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <FileSpreadsheet size={16} className="text-green-500" />
                    Export Excel
                  </button>
                  <button
                    onClick={exportPDF}
                    className="px-4 py-2 flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <FileText size={16} className="text-red-500" />
                    Export PDF
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Search Input */}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by product name"
                  className="border border-gray-300 rounded-md px-3 py-3 text-sm shadow-sm focus:ring-2 focus:ring-black transition w-full"
                />

                {/* Status Dropdown */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-3 text-sm shadow-sm focus:ring-2 focus:ring-black transition w-full"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                {/* Payment Status Dropdown */}
                <select
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-3 text-sm shadow-sm focus:ring-2 focus:ring-black transition w-full"
                >
                  {paymentStatuses.map((paymentStatus) => (
                    <option key={paymentStatus} value={paymentStatus}>
                      {paymentStatus}
                    </option>
                  ))}
                </select>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-3 text-sm shadow-sm focus:ring-2 focus:ring-black transition w-full"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div id="table-to-pdf">
                {isLoading ? (
                  <p>Loading orders...</p>
                ) : filteredData.length === 0 ? (
                  <p className="py-6 px-8 text-center flex justify-center items-center mt-20 mb-40">
                    No orders found.
                  </p>
                ) : (
                  <div className="rounded-lg border overflow-hidden shadow-sm">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100 text-left text-gray-500">
                          <th scope="col" className="py-3 px-6 font-semibold">
                            Order No
                          </th>
                          <th scope="col" className="py-3 px-6 font-semibold">
                            Amount
                          </th>
                          <th scope="col" className="py-3 px-6 font-semibold">
                            Payment
                          </th>
                          <th scope="col" className="py-3 px-6 font-semibold">
                            Phone
                          </th>
                          <th scope="col" className="py-3 px-6 font-semibold">
                            Address
                          </th>
                          <th scope="col" className="py-3 px-6 font-semibold">
                            Items
                          </th>
                          <th scope="col" className="py-3 px-6 font-semibold">
                            Status
                          </th>
                          <th scope="col" className="py-3 px-6 font-semibold">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((order) => (
                          <tr
                            key={order._id}
                            className="hover:bg-gray-50 border-t"
                          >
                            <td className="py-3 px-6 font-medium text-gray-900">
                              {order.orderNumber}
                            </td>
                            <td className="py-3 px-6 font-medium text-gray-900">
                              <div className="flex flex-col text-lg">
                                <span>${order.amount}</span>
                                <span className="text-xs text-gray-500">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      weekday: "short",
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-6">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  order.payment
                                    ? "bg-green-200 text-green-800"
                                    : "bg-red-200 text-red-800"
                                }`}
                              >
                                {order.payment ? "Paid" : "Unpaid"}
                              </span>
                            </td>
                            <td className="py-3 px-6">{order.address.phone}</td>
                            <td className="py-3 px-6 text-sm text-gray-500">
                              <span className="text-gray-700">
                                {order.billingAddress.country} -{" "}
                                {order.billingAddress.postalCode}
                              </span>
                              <br />
                              {order.billingAddress.street},{" "}
                              {order.billingAddress.city}.
                            </td>
                            <td className="py-3 px-6">
                              {order.items.map((item) => (
                                <div key={item._id}>{item.name}</div>
                              ))}
                            </td>
                            <td className="py-3 px-6">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  order.status === "Processing"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : order.status === "Shipped"
                                    ? "bg-blue-200 text-blue-800"
                                    : order.status === "Delivered"
                                    ? "bg-green-200 text-green-800"
                                    : order.status === "Cancelled"
                                    ? "bg-red-200 text-red-800"
                                    : "bg-gray-200 text-gray-800"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-6">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  updateOrderStatus(order._id, e.target.value)
                                }
                                className="border border-gray-300 p-1 rounded"
                              >
                                {statuses.slice(1).map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex items-center mt-6">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border transition ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <ChevronLeft size={18} />
                  <span className="text-sm">Previous</span>
                </button>

                <p className="text-sm text-gray-500 px-10">
                  Page{" "}
                  <span className="font-semibold text-gray-800">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800">
                    {totalPages}
                  </span>
                </p>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border transition ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <span className="text-sm">Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <AdvancedCharts ordersData={data} />
            </div>
          )}
        </div>
      </div>

      {/* Floating Voice Command Button */}
      <button
        onClick={startListening}
        disabled={isListening}
        className={`fixed bottom-6 right-6 bg-black text-white px-5 py-3 rounded-full shadow-md transition-all duration-300 ease-in-out flex items-center gap-3 hover:bg-gray-900 ${
          isListening ? "opacity-90 cursor-not-allowed" : ""
        }`}
      >
        <div
          className={`p-2 rounded-full bg-white/20 ${
            isListening ? "animate-pulse" : ""
          }`}
        >
          <Mic size={20} strokeWidth={1.5} className="text-white" />
        </div>
        <span className="text-sm font-medium tracking-wide">
          {isListening ? "Listening..." : "AI Assistant"}
        </span>
      </button>
    </div>
  );
};

export default OrderAdmin;
