import Link from "next/link";
import React from "react";
import EditableText from "@/components/AdminInline/EditableText";

const Breadcrumb = ({ title, pages }) => {
  return (
    <div className="overflow-hidden shadow-breadcrumb pt-[209px] sm:pt-[155px] lg:pt-[95px] xl:pt-[165px]">
      <div className="border-t border-gray-3">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-5 xl:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <EditableText as="h1" className="font-semibold text-dark text-xl sm:text-2xl xl:text-custom-2" pageSlug="global" sectionKey="breadcrumb" contentKey={`breadcrumb_${String(title).toLowerCase().replaceAll(" ", "_")}`} contentType="title" value={title} />

            <ul className="flex items-center gap-2">
              <li className="text-custom-sm hover:text-blue">
                <Link href="/">Home /</Link>
              </li>

              {pages.length > 0 &&
                pages.map((page, key) => (
                  <li className="text-custom-sm last:text-blue capitalize" key={key}>
                    <EditableText pageSlug="global" sectionKey="breadcrumb" contentKey={`breadcrumb_page_${String(page).toLowerCase().replaceAll(" ", "_")}`} contentType="label" value={page} />
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
