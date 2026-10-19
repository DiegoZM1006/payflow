from django.contrib import admin

from .models import Customer, Merchant, Transaction


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ["customer_id", "name", "customer_type", "city"]
    list_filter = ["customer_type", "city"]
    search_fields = ["customer_id", "name"]


@admin.register(Merchant)
class MerchantAdmin(admin.ModelAdmin):
    list_display = ["name", "category"]
    list_filter = ["category"]
    search_fields = ["name"]


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = [
        "transaction_id",
        "created_at",
        "customer",
        "merchant",
        "amount",
        "status",
    ]
    list_filter = ["status", "channel", "merchant__category"]
    search_fields = ["transaction_id", "customer__name", "merchant__name"]
    list_select_related = ["customer", "merchant"]
    date_hierarchy = "created_at"
