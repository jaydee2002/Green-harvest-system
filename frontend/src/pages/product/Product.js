import React from "react";
import ProductDetails from "../../components/ProductDetails/ProductDetails";

const Product = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 mt-24">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Product Details Section */}
        <div className="w-full lg:w-2/3">
          <ProductDetails />
        </div>

        {/* Related Products Sidebar */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Related Products
          </h2>
          <div className="space-y-4">
            {/* Skeleton for Related Product 1 */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-md animate-pulse">
              <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            {/* Skeleton for Related Product 2 */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-md animate-pulse">
              <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            {/* Skeleton for Related Product 3 */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-md animate-pulse">
              <div className="w-20 h-20 bg-gray-200 rounded-md"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Customer Reviews
        </h2>
        <div className="space-y-4">
          {/* Skeleton for Review 1 */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md animate-pulse">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mt-1"></div>
          </div>
          {/* Skeleton for Review 2 */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md animate-pulse">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mt-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
