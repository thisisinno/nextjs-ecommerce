from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework import serializers

from .models import (
    AnalyticsEvent,
    CartActivity,
    Category,
    ContentBlock,
    FilterGroup,
    FilterOption,
    MediaAsset,
    Menu,
    MenuItem,
    Order,
    Page,
    Product,
    ProductImage,
    Section,
)


class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ("id", "username", "email", "is_staff", "is_superuser")


class MediaAssetSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = MediaAsset
        fields = "__all__"
        read_only_fields = ("uploaded_by", "created_at", "updated_at", "file_url")

    def get_file_url(self, obj):
        if not obj.file:
            return ""
        request = self.context.get("request")
        url = obj.file.url
        return request.build_absolute_uri(url) if request else url

    def create(self, validated_data):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["uploaded_by"] = request.user
        return super().create(validated_data)


class ContentBlockSerializer(serializers.ModelSerializer):
    media_detail = MediaAssetSerializer(source="media", read_only=True)

    class Meta:
        model = ContentBlock
        fields = "__all__"


class SectionSerializer(serializers.ModelSerializer):
    blocks = ContentBlockSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = "__all__"


class PageSerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)

    class Meta:
        model = Page
        fields = "__all__"


class MenuItemSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = "__all__"

    def get_children(self, obj):
        items = obj.children.filter(is_active=True).order_by("order", "id")
        return MenuItemSerializer(items, many=True, context=self.context).data


class MenuSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = Menu
        fields = "__all__"

    def get_items(self, obj):
        items = obj.items.filter(parent__isnull=True, is_active=True).order_by("order", "id")
        return MenuItemSerializer(items, many=True, context=self.context).data


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = "__all__"

    def get_children(self, obj):
        children = obj.children.filter(is_active=True).annotate(product_count=Count("products"))
        return CategorySerializer(children, many=True, context=self.context).data

    def get_product_count(self, obj):
        if hasattr(obj, "product_count"):
            return obj.product_count
        return obj.products.count()


class FilterOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FilterOption
        fields = "__all__"


class FilterGroupSerializer(serializers.ModelSerializer):
    options = FilterOptionSerializer(many=True, read_only=True)

    class Meta:
        model = FilterGroup
        fields = "__all__"


class ProductImageSerializer(serializers.ModelSerializer):
    media_detail = MediaAssetSerializer(source="media", read_only=True)

    class Meta:
        model = ProductImage
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category_detail = CategorySerializer(source="category", read_only=True)
    filters_detail = FilterOptionSerializer(source="filters", many=True, read_only=True)

    class Meta:
        model = Product
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    user_detail = UserSummarySerializer(source="user", read_only=True)

    class Meta:
        model = Order
        fields = "__all__"


class CartActivitySerializer(serializers.ModelSerializer):
    user_detail = UserSummarySerializer(source="user", read_only=True)
    product_detail = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = CartActivity
        fields = "__all__"


class AnalyticsEventSerializer(serializers.ModelSerializer):
    user_detail = UserSummarySerializer(source="user", read_only=True)

    class Meta:
        model = AnalyticsEvent
        fields = "__all__"
