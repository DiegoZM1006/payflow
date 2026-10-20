from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import SearchFilter

from .filters import StableOrderingFilter, TransactionFilter
from .models import Transaction
from .serializers import TransactionSerializer


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transaction.objects.select_related("customer", "merchant")
    serializer_class = TransactionSerializer
    lookup_field = "transaction_id"
    filter_backends = [DjangoFilterBackend, SearchFilter, StableOrderingFilter]
    filterset_class = TransactionFilter
    search_fields = ["transaction_id", "customer__name", "merchant__name"]
    ordering_fields = ["created_at", "amount"]
