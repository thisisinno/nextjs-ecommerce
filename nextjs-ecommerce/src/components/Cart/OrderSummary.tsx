import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import EditableText from "@/components/AdminInline/EditableText";

const OrderSummary = () => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  return (
    <div className="lg:max-w-[455px] w-full">
      {/* <!-- order list box --> */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <EditableText as="h3" className="font-medium text-xl text-dark" pageSlug="cart" sectionKey="summary" contentKey="summary_title" contentType="title" value="Order Summary" />
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* <!-- title --> */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <EditableText as="h4" className="font-medium text-dark" pageSlug="cart" sectionKey="summary" contentKey="summary_product_header" contentType="label" value="Product" />
            </div>
            <div>
              <EditableText as="h4" className="font-medium text-dark text-right" pageSlug="cart" sectionKey="summary" contentKey="summary_subtotal_header" contentType="label" value="Subtotal" />
            </div>
          </div>

          {/* <!-- product item --> */}
          {cartItems.map((item, key) => (
            <div key={key} className="flex items-center justify-between py-5 border-b border-gray-3">
              <div>
                <p className="text-dark">{item.title}</p>
              </div>
              <div>
                <p className="text-dark text-right">
                  ${item.discountedPrice * item.quantity}
                </p>
              </div>
            </div>
          ))}

          {/* <!-- total --> */}
          <div className="flex items-center justify-between pt-5">
            <div>
              <EditableText as="p" className="font-medium text-lg text-dark" pageSlug="cart" sectionKey="summary" contentKey="summary_total_label" contentType="label" value="Total" />
            </div>
            <div>
              <p className="font-medium text-lg text-dark text-right">
                ${totalPrice}
              </p>
            </div>
          </div>

          {/* <!-- checkout button --> */}
          <button
            type="submit"
            className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
          >
            <EditableText pageSlug="cart" sectionKey="summary" contentKey="checkout_button" contentType="button" value="Process to Checkout" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
