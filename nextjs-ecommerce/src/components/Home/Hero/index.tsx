import React from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import EditableImage from "@/components/AdminInline/EditableImage";
import EditableText from "@/components/AdminInline/EditableText";

const Hero = () => {
  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousel />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                <div className="flex items-center gap-14">
                  <div>
                    <EditableText as="h2" className="max-w-[153px] font-semibold text-dark text-xl mb-20" pageSlug="home" sectionKey="hero_offers" contentKey="offer_1_title" contentType="title" value="iPhone 14 Plus & 14 Pro Max" />

                    <div>
                      <EditableText as="p" className="font-medium text-dark-4 text-custom-sm mb-1.5" pageSlug="home" sectionKey="hero_offers" contentKey="offer_1_caption" contentType="caption" value="limited time offer" />
                      <span className="flex items-center gap-3">
                        <EditableText className="font-medium text-heading-5 text-red" pageSlug="home" sectionKey="hero_offers" contentKey="offer_1_price" contentType="price" value="$699" />
                        <EditableText className="font-medium text-2xl text-dark-4 line-through" pageSlug="home" sectionKey="hero_offers" contentKey="offer_1_old_price" contentType="price" value="$999" />
                      </span>
                    </div>
                  </div>

                  <div>
                    <EditableImage
                      src="/images/hero/hero-02.png"
                      alt="mobile image"
                      pageSlug="home"
                      sectionKey="hero_offers"
                      contentKey="offer_1_image"
                      width={123}
                      height={161}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                <div className="flex items-center gap-14">
                  <div>
                    <EditableText as="h2" className="max-w-[153px] font-semibold text-dark text-xl mb-20" pageSlug="home" sectionKey="hero_offers" contentKey="offer_2_title" contentType="title" value="Wireless Headphone" />

                    <div>
                      <EditableText as="p" className="font-medium text-dark-4 text-custom-sm mb-1.5" pageSlug="home" sectionKey="hero_offers" contentKey="offer_2_caption" contentType="caption" value="limited time offer" />
                      <span className="flex items-center gap-3">
                        <EditableText className="font-medium text-heading-5 text-red" pageSlug="home" sectionKey="hero_offers" contentKey="offer_2_price" contentType="price" value="$699" />
                        <EditableText className="font-medium text-2xl text-dark-4 line-through" pageSlug="home" sectionKey="hero_offers" contentKey="offer_2_old_price" contentType="price" value="$999" />
                      </span>
                    </div>
                  </div>

                  <div>
                    <EditableImage
                      src="/images/hero/hero-01.png"
                      alt="mobile image"
                      pageSlug="home"
                      sectionKey="hero_offers"
                      contentKey="offer_2_image"
                      width={123}
                      height={161}
                    />
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};

export default Hero;
