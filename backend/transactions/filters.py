from datetime import datetime, time, timedelta

import django_filters
from django.utils import timezone
from rest_framework.filters import OrderingFilter

from .choices import Category, Channel, City, Status
from .models import Transaction


def start_of_day(date):
    return timezone.make_aware(datetime.combine(date, time.min))


class DateRangeFilter(django_filters.FilterSet):
    """Reusable date range filter, applied in Colombia's local time."""

    date_from = django_filters.DateFilter(method="filter_date_from")
    date_to = django_filters.DateFilter(method="filter_date_to")

    def filter_date_from(self, queryset, name, value):
        return queryset.filter(created_at__gte=start_of_day(value))

    def filter_date_to(self, queryset, name, value):
        return queryset.filter(created_at__lt=start_of_day(value + timedelta(days=1)))


class TransactionFilter(DateRangeFilter):
    status = django_filters.ChoiceFilter(choices=Status.choices)
    channel = django_filters.ChoiceFilter(choices=Channel.choices)
    category = django_filters.ChoiceFilter(
        field_name="merchant__category", choices=Category.choices
    )
    city = django_filters.ChoiceFilter(
        field_name="customer__city", choices=City.choices
    )
    amount_min = django_filters.NumberFilter(field_name="amount", lookup_expr="gte")
    amount_max = django_filters.NumberFilter(field_name="amount", lookup_expr="lte")

    class Meta:
        model = Transaction
        fields = []


class StableOrderingFilter(OrderingFilter):
    """Always append the primary key so pagination stays deterministic."""

    def get_ordering(self, request, queryset, view):
        ordering = super().get_ordering(request, queryset, view)
        return [*ordering, "-id"] if ordering else ordering
