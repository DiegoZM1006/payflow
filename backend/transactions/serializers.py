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


class SummarySerializer(serializers.Serializer):
    approved_amount = serializers.IntegerField()
    total_transactions = serializers.IntegerField()
    average_ticket = serializers.IntegerField()
    approval_rate = serializers.FloatField()
    unique_customers = serializers.IntegerField()


class MonthlyMetricSerializer(serializers.Serializer):
    month = serializers.CharField(help_text="Month in YYYY-MM format.")
    approved_amount = serializers.IntegerField()
    total_transactions = serializers.IntegerField()
    approval_rate = serializers.FloatField()


class CategoryMetricSerializer(serializers.Serializer):
    category = serializers.CharField()
    total_transactions = serializers.IntegerField()
    approved_amount = serializers.IntegerField()
    share = serializers.FloatField(help_text="Share of the total approved amount (%).")


class ChannelMetricSerializer(serializers.Serializer):
    channel = serializers.CharField()
    total_transactions = serializers.IntegerField()
    by_status = serializers.DictField(
        child=serializers.IntegerField(),
        help_text="Number of transactions per status.",
    )


class TopCustomerSerializer(serializers.Serializer):
    customer_id = serializers.CharField()
    customer_name = serializers.CharField()
    approved_amount = serializers.IntegerField()
    total_transactions = serializers.IntegerField()
    last_purchase_at = serializers.DateTimeField(allow_null=True)
