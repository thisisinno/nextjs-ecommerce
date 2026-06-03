import React from "react";
import EditableButton from "@/components/AdminInline/EditableButton";
import EditableImage from "@/components/AdminInline/EditableImage";
import EditableText from "@/components/AdminInline/EditableText";

const PromoBanner = () => {
  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- promo banner big --> */}
        <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
          <div className="max-w-[550px] w-full">
            <EditableText className="block font-medium text-xl text-dark mb-3" pageSlug="home" sectionKey="promo" contentKey="promo_1_subtitle" contentType="subtitle" value="Apple iPhone 14 Plus" />

            <EditableText as="h2" className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5" pageSlug="home" sectionKey="promo" contentKey="promo_1_title" contentType="title" value="UP TO 30% OFF" />

            <EditableText as="p" pageSlug="home" sectionKey="promo" contentKey="promo_1_description" contentType="text" value="iPhone 14 has the same superspeedy chip that's in iPhone 13 Pro, A15 Bionic, with a 5-core GPU, powers all the latest features." multiline />

            <EditableButton
              className="inline-flex font-medium text-custom-sm text-white bg-blue py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
              pageSlug="home"
              sectionKey="promo"
              contentKey="promo_1_button"
              label="Buy Now"
              href="#"
            />
          </div>

          <EditableImage
            src="/images/promo/promo-01.png"
            alt="promo img"
            className="absolute bottom-0 right-4 lg:right-26 -z-1"
            pageSlug="home"
            sectionKey="promo"
            contentKey="promo_1_image"
            width={274}
            height={350}
          />
        </div>

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          {/* <!-- promo banner small --> */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#DBF4F3] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <EditableImage
              src="/images/promo/promo-02.png"
              alt="promo img"
              className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-1"
              pageSlug="home"
              sectionKey="promo"
              contentKey="promo_2_image"
              width={241}
              height={241}
            />

            <div className="text-right">
              <EditableText className="block text-lg text-dark mb-1.5" pageSlug="home" sectionKey="promo" contentKey="promo_2_subtitle" contentType="subtitle" value="Foldable Motorised Treadmill" />

              <EditableText as="h2" className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5" pageSlug="home" sectionKey="promo" contentKey="promo_2_title" contentType="title" value="Workout At Home" />

              <EditableText as="p" className="font-semibold text-custom-1 text-teal" pageSlug="home" sectionKey="promo" contentKey="promo_2_caption" contentType="caption" value="Flat 20% off" />

              <EditableButton
                className="inline-flex font-medium text-custom-sm text-white bg-teal py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-teal-dark mt-9"
                pageSlug="home"
                sectionKey="promo"
                contentKey="promo_2_button"
                label="Grab Now"
                href="#"
              />
            </div>
          </div>

          {/* <!-- promo banner small --> */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#FFECE1] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            <EditableImage
              src="/images/promo/promo-03.png"
              alt="promo img"
              className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-8.5 -z-1"
              pageSlug="home"
              sectionKey="promo"
              contentKey="promo_3_image"
              width={200}
              height={200}
            />

            <div>
              <EditableText className="block text-lg text-dark mb-1.5" pageSlug="home" sectionKey="promo" contentKey="promo_3_subtitle" contentType="subtitle" value="Apple Watch Ultra" />

              <EditableText as="h2" className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5" pageSlug="home" sectionKey="promo" contentKey="promo_3_title" contentType="title" value="Up to 40% off" />

              <EditableText as="p" className="max-w-[285px] text-custom-sm" pageSlug="home" sectionKey="promo" contentKey="promo_3_description" contentType="text" value="The aerospace-grade titanium case strikes the perfect balance of everything." multiline />

              <EditableButton
                className="inline-flex font-medium text-custom-sm text-white bg-orange py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-orange-dark mt-7.5"
                pageSlug="home"
                sectionKey="promo"
                contentKey="promo_3_button"
                label="Buy Now"
                href="#"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
