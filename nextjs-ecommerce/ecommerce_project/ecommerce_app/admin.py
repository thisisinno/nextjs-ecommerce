from django.contrib import admin

from .models import AnalyticsEvent, CartActivity, Category, ContentBlock, FilterGroup, FilterOption, MediaAsset, Menu, MenuItem, Order, Page, Product, ProductImage, Section


class ContentBlockInline(admin.TabularInline):
    model = ContentBlock
    extra = 0


class SectionInline(admin.TabularInline):
    model = Section
    extra = 0


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "is_active")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [SectionInline]


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ("page", "key", "title", "section_type", "order", "is_active")
    inlines = [ContentBlockInline]


@admin.register(ContentBlock)
class ContentBlockAdmin(admin.ModelAdmin):
    list_display = ("section", "key", "content_type", "order", "is_active")
    list_filter = ("content_type", "is_active")


class MenuItemInline(admin.TabularInline):
    model = MenuItem
    extra = 0
    fk_name = "menu"


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ("name", "location", "is_active")
    inlines = [MenuItemInline]


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("title", "menu", "parent", "path", "order", "is_active")


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "category", "price", "discounted_price", "stock", "is_active", "is_featured")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ProductImageInline]
    filter_horizontal = ("filters",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "order", "is_active")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(FilterGroup)
class FilterGroupAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "type", "order", "is_active")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(FilterOption)
class FilterOptionAdmin(admin.ModelAdmin):
    list_display = ("filter_group", "label", "value", "product_count", "order", "is_active")


admin.site.register(MediaAsset)
admin.site.register(Order)
admin.site.register(CartActivity)
admin.site.register(AnalyticsEvent)
