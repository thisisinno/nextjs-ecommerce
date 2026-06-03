import React from "react";
import { Testimonial } from "@/types/testimonial";
import Image from "next/image";
import EditableImage from "@/components/AdminInline/EditableImage";
import EditableText from "@/components/AdminInline/EditableText";

const SingleItem = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="shadow-testimonial bg-white rounded-[10px] py-7.5 px-4 sm:px-8.5 m-1">
      <div className="flex items-center gap-1 mb-5">
        <Image
          src="/images/icons/icon-star.svg"
          alt="star icon"
          width={15}
          height={15}
        />
        <Image
          src="/images/icons/icon-star.svg"
          alt="star icon"
          width={15}
          height={15}
        />
        <Image
          src="/images/icons/icon-star.svg"
          alt="star icon"
          width={15}
          height={15}
        />
        <Image
          src="/images/icons/icon-star.svg"
          alt="star icon"
          width={15}
          height={15}
        />
        <Image
          src="/images/icons/icon-star.svg"
          alt="star icon"
          width={15}
          height={15}
        />
      </div>

      <EditableText as="p" className="text-dark mb-6" pageSlug="home" sectionKey="testimonials" contentKey={`testimonial_${testimonial.authorName.toLowerCase().replaceAll(" ", "_")}_review`} contentType="text" value={testimonial.review} multiline />

      <a href="#" className="flex items-center gap-4">
        <div className="w-12.5 h-12.5 rounded-full overflow-hidden">
          <EditableImage
            src={testimonial.authorImg}
            alt="author"
            className="w-12.5 h-12.5 rounded-full overflow-hidden"
            pageSlug="home"
            sectionKey="testimonials"
            contentKey={`testimonial_${testimonial.authorName.toLowerCase().replaceAll(" ", "_")}_image`}
            width={50}
            height={50}
          />
        </div>

        <div>
          <EditableText as="h3" className="font-medium text-dark" pageSlug="home" sectionKey="testimonials" contentKey={`testimonial_${testimonial.authorName.toLowerCase().replaceAll(" ", "_")}_name`} contentType="title" value={testimonial.authorName} />
          <EditableText as="p" className="text-custom-sm" pageSlug="home" sectionKey="testimonials" contentKey={`testimonial_${testimonial.authorName.toLowerCase().replaceAll(" ", "_")}_role`} contentType="caption" value={testimonial.authorRole} />
        </div>
      </a>
    </div>
  );
};

export default SingleItem;
