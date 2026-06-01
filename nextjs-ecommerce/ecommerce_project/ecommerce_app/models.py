from django.conf import settings
from django.db import models
from django.utils.text import slugify


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Page(TimeStampedModel):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Section(TimeStampedModel):
    page = models.ForeignKey(Page, related_name="sections", on_delete=models.CASCADE)
    key = models.SlugField()
    title = models.CharField(max_length=255, blank=True)
    section_type = models.CharField(max_length=80, default="content")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]
        unique_together = ("page", "key")

    def __str__(self):
        return f"{self.page.slug}:{self.key}"


class MediaAsset(TimeStampedModel):
    file = models.FileField(upload_to="content/%Y/%m/")
    alt_text = models.CharField(max_length=255, blank=True)
    caption = models.CharField(max_length=255, blank=True)
    crop_data = models.JSONField(default=dict, blank=True)
    adjustment_data = models.JSONField(default=dict, blank=True)
    original_width = models.PositiveIntegerField(null=True, blank=True)
    original_height = models.PositiveIntegerField(null=True, blank=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.alt_text or self.file.name


class ContentBlock(TimeStampedModel):
    TEXT = "text"
    RICH_TEXT = "rich_text"
    IMAGE = "image"
    LINK = "link"
    BUTTON = "button"
    CAPTION = "caption"
    SUBTITLE = "subtitle"
    TITLE = "title"
    PRICE = "price"
    JSON = "json"
    CONTENT_TYPES = (
        (TEXT, "Text"),
        (RICH_TEXT, "Rich text"),
        (IMAGE, "Image"),
        (LINK, "Link"),
        (BUTTON, "Button"),
        (CAPTION, "Caption"),
        (SUBTITLE, "Subtitle"),
        (TITLE, "Title"),
        (PRICE, "Price"),
        (JSON, "JSON"),
    )

    section = models.ForeignKey(Section, related_name="blocks", on_delete=models.CASCADE)
    key = models.SlugField()
    content_type = models.CharField(max_length=40, choices=CONTENT_TYPES, default=TEXT)
    value = models.TextField(blank=True)
    media = models.ForeignKey(MediaAsset, null=True, blank=True, on_delete=models.SET_NULL)
    order = models.PositiveIntegerField(default=0)
    metadata = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]
        unique_together = ("section", "key")

    def __str__(self):
        return f"{self.section}:{self.key}"


class Menu(TimeStampedModel):
    LOCATIONS = (("header", "Header"), ("footer", "Footer"), ("sidebar", "Sidebar"), ("mobile", "Mobile"), ("filter", "Filter"))
    name = models.CharField(max_length=120)
    location = models.CharField(max_length=40, choices=LOCATIONS)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("name", "location")

    def __str__(self):
        return f"{self.name} ({self.location})"


class MenuItem(TimeStampedModel):
    menu = models.ForeignKey(Menu, related_name="items", on_delete=models.CASCADE)
    parent = models.ForeignKey("self", related_name="children", null=True, blank=True, on_delete=models.CASCADE)
    title = models.CharField(max_length=180)
    path = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class Category(TimeStampedModel):
    title = models.CharField(max_length=180)
    slug = models.SlugField(unique=True, blank=True)
    image = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "title"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class FilterGroup(TimeStampedModel):
    TYPES = (("category", "Category"), ("gender", "Gender"), ("size", "Size"), ("color", "Color"), ("price", "Price"), ("custom", "Custom"))
    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    type = models.CharField(max_length=40, choices=TYPES, default="custom")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class FilterOption(TimeStampedModel):
    filter_group = models.ForeignKey(FilterGroup, related_name="options", on_delete=models.CASCADE)
    label = models.CharField(max_length=120)
    value = models.SlugField()
    product_count = models.PositiveIntegerField(default=0)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "label"]
        unique_together = ("filter_group", "value")

    def __str__(self):
        return f"{self.filter_group.name}: {self.label}"


class Product(TimeStampedModel):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category = models.ForeignKey(Category, related_name="products", null=True, blank=True, on_delete=models.SET_NULL)
    stock = models.PositiveIntegerField(default=0)
    filters = models.ManyToManyField(FilterOption, related_name="products", blank=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ProductImage(TimeStampedModel):
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    media = models.ForeignKey(MediaAsset, null=True, blank=True, on_delete=models.SET_NULL)
    image = models.CharField(max_length=255, blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    image_type = models.CharField(max_length=40, default="preview")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]


class Order(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    email = models.EmailField(blank=True)
    status = models.CharField(max_length=40, default="pending")
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    metadata = models.JSONField(default=dict, blank=True)


class CartActivity(models.Model):
    ACTIONS = (("add", "Add"), ("remove", "Remove"), ("update", "Update"))
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    session_key = models.CharField(max_length=120, blank=True)
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.SET_NULL)
    quantity = models.PositiveIntegerField(default=1)
    action = models.CharField(max_length=20, choices=ACTIONS)
    created_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]


class AnalyticsEvent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    session_key = models.CharField(max_length=120, blank=True)
    event_type = models.CharField(max_length=80)
    page = models.CharField(max_length=180, blank=True)
    product = models.ForeignKey(Product, null=True, blank=True, on_delete=models.SET_NULL)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
