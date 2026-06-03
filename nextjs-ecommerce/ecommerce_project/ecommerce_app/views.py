from django.db.models import Count
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AnalyticsEvent, CartActivity, Category, ContentBlock, FilterGroup, FilterOption, MediaAsset, Menu, MenuItem, Order, Page, Product, ProductImage, Section
from .permissions import IsStaffOrSuperuser
from .serializers import AnalyticsEventSerializer, CartActivitySerializer, CategorySerializer, ContentBlockSerializer, FilterGroupSerializer, FilterOptionSerializer, MediaAssetSerializer, MenuItemSerializer, MenuSerializer, OrderSerializer, PageSerializer, ProductImageSerializer, ProductSerializer, SectionSerializer, UserSummarySerializer


class APIHealthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok", "service": "ecommerce-api"})


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSummarySerializer(request.user).data)


class PageListView(generics.ListAPIView):
    queryset = Page.objects.filter(is_active=True).prefetch_related("sections__blocks")
    serializer_class = PageSerializer
    permission_classes = [AllowAny]


class PageDetailView(generics.RetrieveAPIView):
    queryset = Page.objects.filter(is_active=True).prefetch_related("sections__blocks")
    serializer_class = PageSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


class SectionListView(generics.ListAPIView):
    queryset = Section.objects.filter(is_active=True).select_related("page").prefetch_related("blocks")
    serializer_class = SectionSerializer
    permission_classes = [AllowAny]


class ContentBlockListView(generics.ListAPIView):
    queryset = ContentBlock.objects.filter(is_active=True).select_related("section", "media")
    serializer_class = ContentBlockSerializer
    permission_classes = [AllowAny]


class MenuListView(generics.ListAPIView):
    queryset = Menu.objects.filter(is_active=True).prefetch_related("items__children")
    serializer_class = MenuSerializer
    permission_classes = [AllowAny]


class FilterGroupListView(generics.ListAPIView):
    queryset = FilterGroup.objects.filter(is_active=True).prefetch_related("options")
    serializer_class = FilterGroupSerializer
    permission_classes = [AllowAny]


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related("category").prefetch_related("images", "filters")
        for key, values in self.request.query_params.lists():
            if key.startswith("filter_"):
                queryset = queryset.filter(filters__filter_group__slug=key.replace("filter_", ""), filters__value__in=values)
        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(category__slug=category)
        return queryset.distinct()


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True).select_related("category").prefetch_related("images", "filters")
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Category.objects.filter(is_active=True, parent__isnull=True).annotate(product_count=Count("products"))


class ContentBlockListCreateView(generics.ListCreateAPIView):
    queryset = ContentBlock.objects.all().select_related("section", "media")
    serializer_class = ContentBlockSerializer
    permission_classes = [IsStaffOrSuperuser]


class ContentBlockUpsertView(APIView):
    permission_classes = [IsStaffOrSuperuser]

    def post(self, request):
        page_slug = request.data.get("page_slug")
        section_key = request.data.get("section_key")
        block_key = request.data.get("key")

        if not page_slug or not section_key or not block_key:
            return Response(
                {"detail": "page_slug, section_key, and key are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        page_title = request.data.get("page_title") or page_slug.replace("-", " ").title()
        section_title = request.data.get("section_title") or section_key.replace("-", " ").title()

        page, _ = Page.objects.get_or_create(slug=page_slug, defaults={"title": page_title})
        section, _ = Section.objects.get_or_create(
            page=page,
            key=section_key,
            defaults={"title": section_title},
        )
        block, _ = ContentBlock.objects.get_or_create(section=section, key=block_key)

        for field in ("content_type", "value", "metadata"):
            if field in request.data:
                setattr(block, field, request.data.get(field))
        if "media" in request.data:
            block.media_id = request.data.get("media")
        block.is_active = True
        block.save()

        serializer = ContentBlockSerializer(block, context={"request": request})
        return Response(serializer.data)


class ContentBlockDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ContentBlock.objects.all()
    serializer_class = ContentBlockSerializer
    permission_classes = [IsStaffOrSuperuser]


class MediaAssetListCreateView(generics.ListCreateAPIView):
    queryset = MediaAsset.objects.all()
    serializer_class = MediaAssetSerializer
    permission_classes = [IsStaffOrSuperuser]


class MediaAssetDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MediaAsset.objects.all()
    serializer_class = MediaAssetSerializer
    permission_classes = [IsStaffOrSuperuser]


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all().select_related("category").prefetch_related("images", "filters")
    serializer_class = ProductSerializer
    permission_classes = [IsStaffOrSuperuser]


class ProductDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all().select_related("category").prefetch_related("images", "filters")
    serializer_class = ProductSerializer
    permission_classes = [IsStaffOrSuperuser]


class ProductImageCreateView(generics.CreateAPIView):
    serializer_class = ProductImageSerializer
    permission_classes = [IsStaffOrSuperuser]

    def perform_create(self, serializer):
        serializer.save(product_id=self.kwargs["pk"])


class ProductImageDetailView(generics.DestroyAPIView):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsStaffOrSuperuser]


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all().select_related("parent").prefetch_related("children")
    serializer_class = CategorySerializer
    permission_classes = [IsStaffOrSuperuser]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all().select_related("parent").prefetch_related("children")
    serializer_class = CategorySerializer
    permission_classes = [IsStaffOrSuperuser]


class MenuListCreateView(generics.ListCreateAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer
    permission_classes = [IsStaffOrSuperuser]


class MenuDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer
    permission_classes = [IsStaffOrSuperuser]


class MenuItemListCreateView(generics.ListCreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsStaffOrSuperuser]


class MenuItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [IsStaffOrSuperuser]


class FilterGroupListCreateView(generics.ListCreateAPIView):
    queryset = FilterGroup.objects.all().prefetch_related("options")
    serializer_class = FilterGroupSerializer
    permission_classes = [IsStaffOrSuperuser]


class FilterGroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FilterGroup.objects.all()
    serializer_class = FilterGroupSerializer
    permission_classes = [IsStaffOrSuperuser]


class FilterOptionListCreateView(generics.ListCreateAPIView):
    queryset = FilterOption.objects.all()
    serializer_class = FilterOptionSerializer
    permission_classes = [IsStaffOrSuperuser]


class FilterOptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FilterOption.objects.all()
    serializer_class = FilterOptionSerializer
    permission_classes = [IsStaffOrSuperuser]


class AdminOrderListView(generics.ListAPIView):
    queryset = Order.objects.all().select_related("user")
    serializer_class = OrderSerializer
    permission_classes = [IsStaffOrSuperuser]


class AdminAnalyticsListView(generics.ListAPIView):
    queryset = AnalyticsEvent.objects.all().select_related("user", "product")
    serializer_class = AnalyticsEventSerializer
    permission_classes = [IsStaffOrSuperuser]


class AdminCartActivityListView(generics.ListAPIView):
    queryset = CartActivity.objects.all().select_related("user", "product")
    serializer_class = CartActivitySerializer
    permission_classes = [IsStaffOrSuperuser]


class AnalyticsEventCreateView(generics.CreateAPIView):
    queryset = AnalyticsEvent.objects.all()
    serializer_class = AnalyticsEventSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)


class CartActivityCreateView(generics.CreateAPIView):
    queryset = CartActivity.objects.all()
    serializer_class = CartActivitySerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)
