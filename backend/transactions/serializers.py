from rest_framework import serializers

from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    customer_id = serializers.CharField(source="customer.customer_id", read_only=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    customer_type = serializers.CharField(
        source="customer.customer_type", read_only=True
    )
    city = serializers.CharField(source="customer.city", read_only=True)
    merchant = serializers.CharField(source="merchant.name", read_only=True)
    category = serializers.CharField(source="merchant.category", read_only=True)
    amount_range = serializers.CharField(read_only=True)
    weekday = serializers.CharField(read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "transaction_id",
            "created_at",
            "customer_id",
            "customer_name",
            "customer_type",
            "city",
            "merchant",
            "category",
            "channel",
            "amount",
            "amount_range",
            "currency",
            "installments",
            "status",
            "weekday",
        ]
