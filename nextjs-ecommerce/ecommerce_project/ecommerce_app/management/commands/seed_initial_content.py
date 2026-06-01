from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils.text import slugify

from ecommerce_app.models import Category, ContentBlock, FilterGroup, FilterOption, Menu, MenuItem, Page, Product, ProductImage, Section


PRODUCTS = [
    ("Havit HV-G69 USB Gamepad", 59, 29, ["/images/products/product-1-sm-1.png", "/images/products/product-1-sm-2.png"], ["/images/products/product-1-bg-1.png", "/images/products/product-1-bg-2.png"]),
    ("iPhone 14 Plus , 6/128GB", 899, 99, ["/images/products/product-2-sm-1.png", "/images/products/product-2-sm-2.png"], ["/images/products/product-2-bg-1.png", "/images/products/product-2-bg-2.png"]),
    ("Apple iMac M1 24-inch 2021", 59, 29, ["/images/products/product-3-sm-1.png", "/images/products/product-3-sm-2.png"], ["/images/products/product-3-bg-1.png", "/images/products/product-3-bg-2.png"]),
    ("MacBook Air M1 chip, 8/256GB", 59, 29, ["/images/products/product-4-sm-1.png", "/images/products/product-4-sm-2.png"], ["/images/products/product-4-bg-1.png", "/images/products/product-4-bg-2.png"]),
    ("Apple Watch Ultra", 99, 29, ["/images/products/product-5-sm-1.png", "/images/products/product-5-sm-2.png"], ["/images/products/product-5-bg-1.png", "/images/products/product-5-bg-2.png"]),
    ("Logitech MX Master 3 Mouse", 59, 29, ["/images/products/product-6-sm-1.png", "/images/products/product-6-sm-2.png"], ["/images/products/product-6-bg-1.png", "/images/products/product-6-bg-2.png"]),
    ("Apple iPad Air 5th Gen - 64GB", 59, 29, ["/images/products/product-7-sm-1.png", "/images/products/product-7-sm-2.png"], ["/images/products/product-7-bg-1.png", "/images/products/product-7-bg-2.png"]),
    ("Asus RT Dual Band Router", 59, 29, ["/images/products/product-8-sm-1.png", "/images/products/product-8-sm-2.png"], ["/images/products/product-8-bg-1.png", "/images/products/product-8-bg-2.png"]),
]

CATEGORIES = [
    ("Televisions", "/images/categories/categories-01.png"),
    ("Laptop & PC", "/images/categories/categories-02.png"),
    ("Mobile & Tablets", "/images/categories/categories-03.png"),
    ("Games & Videos", "/images/categories/categories-04.png"),
    ("Home Appliances", "/images/categories/categories-05.png"),
    ("Health & Sports", "/images/categories/categories-06.png"),
    ("Watches", "/images/categories/categories-07.png"),
]

MENU = [
    ("Popular", "/", []),
    ("Shop", "/shop-with-sidebar", []),
    ("Contact", "/contact", []),
    ("pages", "/", [
        ("Shop With Sidebar", "/shop-with-sidebar"),
        ("Shop Without Sidebar", "/shop-without-sidebar"),
        ("Checkout", "/checkout"),
        ("Cart", "/cart"),
        ("Wishlist", "/wishlist"),
        ("Sign in", "/signin"),
        ("Sign up", "/signup"),
        ("My Account", "/my-account"),
        ("Contact", "/contact"),
        ("Error", "/error"),
        ("Mail Success", "/mail-success"),
    ]),
    ("blogs", "/", [
        ("Blog Grid with sidebar", "/blogs/blog-grid-with-sidebar"),
        ("Blog Grid", "/blogs/blog-grid"),
        ("Blog details with sidebar", "/blogs/blog-details-with-sidebar"),
        ("Blog details", "/blogs/blog-details"),
    ]),
]

FILTERS = {
    "category": [("Desktop", 10), ("Laptop", 12), ("Monitor", 30), ("UPS", 23), ("Phone", 10), ("Watch", 13)],
    "gender": [("Men", 10), ("Women", 23), ("Unisex", 8)],
    "size": [("Small", 0), ("Medium", 0), ("Large", 0), ("Extra Large", 0)],
    "color": [("Blue", 0), ("Red", 0), ("Green", 0), ("Black", 0), ("White", 0)],
    "price": [("$0 - $50", 0), ("$50 - $100", 0), ("$100 - $500", 0), ("$500+", 0)],
}


class Command(BaseCommand):
    help = "Seed database content from the frontend placeholder data."

    def handle(self, *args, **options):
        pages = ["home", "shop-with-sidebar", "shop-without-sidebar", "shop-details", "cart", "checkout", "wishlist", "contact", "signin", "signup", "my-account", "orders", "blog-grid", "blog-details"]
        for order, slug in enumerate(pages):
            page, _ = Page.objects.get_or_create(slug=slug, defaults={"title": slug.replace("-", " ").title()})
            section, _ = Section.objects.get_or_create(page=page, key="main", defaults={"title": page.title, "section_type": "page", "order": order})
            ContentBlock.objects.get_or_create(section=section, key="title", defaults={"content_type": "title", "value": page.title})

        home = Page.objects.get(slug="home")
        for order, key in enumerate(["hero-carousel", "hero-promos", "feature-cards", "categories", "new-arrivals", "promo-banner", "best-seller", "countdown", "testimonials", "newsletter", "footer"]):
            section, _ = Section.objects.get_or_create(page=home, key=key, defaults={"title": key.replace("-", " ").title(), "section_type": key, "order": order})
            ContentBlock.objects.get_or_create(section=section, key="heading", defaults={"content_type": "title", "value": section.title})

        menu, _ = Menu.objects.get_or_create(name="Main Menu", location="header")
        for order, (title, path, children) in enumerate(MENU):
            item, _ = MenuItem.objects.get_or_create(menu=menu, parent=None, title=title, defaults={"path": path, "order": order, "metadata": {"newTab": False}})
            for child_order, (child_title, child_path) in enumerate(children):
                MenuItem.objects.get_or_create(menu=menu, parent=item, title=child_title, defaults={"path": child_path, "order": child_order, "metadata": {"newTab": False}})

        category_objs = []
        for order, (title, image) in enumerate(CATEGORIES):
            category, _ = Category.objects.get_or_create(slug=slugify(title), defaults={"title": title, "image": image, "order": order})
            category_objs.append(category)

        filter_options = {}
        for order, (group_slug, options_list) in enumerate(FILTERS.items()):
            group, _ = FilterGroup.objects.get_or_create(slug=group_slug, defaults={"name": group_slug.title(), "type": group_slug, "order": order})
            filter_options[group_slug] = []
            for option_order, (label, count) in enumerate(options_list):
                option, _ = FilterOption.objects.get_or_create(filter_group=group, value=slugify(label), defaults={"label": label, "product_count": count, "order": option_order})
                filter_options[group_slug].append(option)

        for index, (title, price, discounted, thumbnails, previews) in enumerate(PRODUCTS):
            product, _ = Product.objects.get_or_create(
                slug=slugify(title),
                defaults={
                    "title": title,
                    "description": "Seeded placeholder product content.",
                    "price": Decimal(price),
                    "discounted_price": Decimal(discounted),
                    "category": category_objs[index % len(category_objs)],
                    "stock": 25,
                    "is_featured": index < 4,
                    "metadata": {"reviews": 15 if index in (0, 5, 6, 7) else 5},
                },
            )
            for img_order, image in enumerate(thumbnails):
                ProductImage.objects.get_or_create(product=product, image=image, image_type="thumbnail", order=img_order)
            for img_order, image in enumerate(previews):
                ProductImage.objects.get_or_create(product=product, image=image, image_type="preview", order=img_order)
            if filter_options["category"]:
                product.filters.add(filter_options["category"][index % len(filter_options["category"])])

        self.stdout.write(self.style.SUCCESS("Initial ecommerce content seeded."))
