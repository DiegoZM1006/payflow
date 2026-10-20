from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import SearchFilter
from rest_framework.response import Response

from . import metrics
from .filters import DateRangeFilter, StableOrderingFilter, TransactionFilter
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


class MetricsViewSet(viewsets.ViewSet):
    """Dashboard metrics. Every endpoint accepts `date_from` and `date_to`."""

    def get_queryset(self):
        filterset = DateRangeFilter(
            self.request.query_params, queryset=Transaction.objects.all()
        )
        if not filterset.is_valid():
            raise ValidationError(filterset.errors)
        return filterset.qs

    @action(detail=False)
    def summary(self, request):
        return Response(metrics.get_summary(self.get_queryset()))

    @action(detail=False)
    def monthly(self, request):
        return Response(metrics.get_monthly(self.get_queryset()))

    @action(detail=False, url_path="by-category")
    def by_category(self, request):
        return Response(metrics.get_by_category(self.get_queryset()))

    @action(detail=False, url_path="by-channel")
    def by_channel(self, request):
        return Response(metrics.get_by_channel(self.get_queryset()))

    @action(detail=False, url_path="top-customers")
    def top_customers(self, request):
        return Response(metrics.get_top_customers(self.get_queryset()))
