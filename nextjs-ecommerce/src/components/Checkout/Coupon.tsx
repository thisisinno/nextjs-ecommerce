import React from "react";
import EditableText from "@/components/AdminInline/EditableText";

const Coupon = () => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <EditableText as="h3" className="font-medium text-xl text-dark" pageSlug="checkout" sectionKey="coupon" contentKey="coupon_title" contentType="title" value="Have any Coupon Code?" />
      </div>

      <div className="py-8 px-4 sm:px-8.5">
        <div className="flex gap-4">
          <input
            type="text"
            name="coupon"
            id="coupon"
            placeholder="Enter coupon code"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />

          <button
            type="submit"
            className="inline-flex font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
          >
            <EditableText pageSlug="checkout" sectionKey="coupon" contentKey="apply_coupon_button" contentType="button" value="Apply" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coupon;
