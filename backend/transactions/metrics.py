"""Aggregations for the dashboard. Each function receives an already filtered queryset."""

from django.db.models import Avg, Count, F, Max, Q, Sum
from django.db.models.functions import Coalesce, TruncMonth
from django.utils import timezone

from .choices import Status

APPROVED = Q(status=Status.APPROVED)


def percentage(part, total):
    return round(part * 100 / total, 2) if total else 0.0


def get_summary(queryset):
    totals = queryset.aggregate(
        total_transactions=Count("id"),
        approved_transactions=Count("id", filter=APPROVED),
        approved_amount=Coalesce(Sum("amount", filter=APPROVED), 0),
        average_ticket=Avg("amount", filter=APPROVED),
        unique_customers=Count("customer", distinct=True),
    )
    return {
        "approved_amount": totals["approved_amount"],
        "total_transactions": totals["total_transactions"],
        "average_ticket": round(totals["average_ticket"] or 0),
        "approval_rate": percentage(
            totals["approved_transactions"], totals["total_transactions"]
        ),
        "unique_customers": totals["unique_customers"],
    }


def get_monthly(queryset):
    rows = (
        queryset.annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(
            total_transactions=Count("id"),
            approved_transactions=Count("id", filter=APPROVED),
            approved_amount=Coalesce(Sum("amount", filter=APPROVED), 0),
        )
        .order_by("month")
    )
    return [
        {
            "month": row["month"].strftime("%Y-%m"),
            "approved_amount": row["approved_amount"],
            "total_transactions": row["total_transactions"],
            "approval_rate": percentage(
                row["approved_transactions"], row["total_transactions"]
            ),
        }
        for row in rows
    ]


def get_by_category(queryset):
    rows = list(
        queryset.values(category=F("merchant__category"))
        .annotate(
            total_transactions=Count("id"),
            approved_amount=Coalesce(Sum("amount", filter=APPROVED), 0),
        )
        .order_by("-approved_amount")
    )
    grand_total = sum(row["approved_amount"] for row in rows)
    return [
        {**row, "share": percentage(row["approved_amount"], grand_total)}
        for row in rows
    ]


def get_by_channel(queryset):
    status_counts = {
        status.name.lower(): Count("id", filter=Q(status=status)) for status in Status
    }
    rows = (
        queryset.values("channel")
        .annotate(total_transactions=Count("id"), **status_counts)
        .order_by("-total_transactions")
    )
    return [
        {
            "channel": row["channel"],
            "total_transactions": row["total_transactions"],
            "by_status": {status.value: row[status.name.lower()] for status in Status},
        }
        for row in rows
    ]


def get_top_customers(queryset):
    rows = (
        queryset.values("customer__customer_id", "customer__name")
        .annotate(
            approved_amount=Coalesce(Sum("amount", filter=APPROVED), 0),
            total_transactions=Count("id"),
            last_purchase_at=Max("created_at", filter=APPROVED),
        )
        .order_by("-approved_amount", "customer__customer_id")
    )
    return [
        {
            "customer_id": row["customer__customer_id"],
            "customer_name": row["customer__name"],
            "approved_amount": row["approved_amount"],
            "total_transactions": row["total_transactions"],
            "last_purchase_at": (
                timezone.localtime(row["last_purchase_at"]).isoformat()
                if row["last_purchase_at"]
                else None
            ),
        }
        for row in rows
    ]
