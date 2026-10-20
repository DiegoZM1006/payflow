from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from transactions.choices import Category, Status

from .factories import (
    create_customer,
    create_merchant,
    create_transaction,
    local_datetime,
)


class MetricsTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        ana = create_customer(customer_id="CUS-0001", name="Ana")
        luis = create_customer(customer_id="CUS-0002", name="Luis")
        zara = create_merchant(name="Zara", category=Category.CLOTHING)
        uber = create_merchant(name="Uber", category=Category.TRANSPORT)

        # October 2025 (Bogotá time)
        create_transaction(
            ana, zara, amount=100_000, created_at=local_datetime(2025, 10, 5)
        )
        # 21:00 on Oct 31 in Bogotá is already Nov 1 in UTC: it must count as October.
        create_transaction(
            ana, zara, amount=300_000, created_at=local_datetime(2025, 10, 31, hour=21)
        )
        create_transaction(
            luis,
            uber,
            amount=50_000,
            status=Status.REJECTED,
            created_at=local_datetime(2025, 10, 10),
        )
        # November 2025
        create_transaction(
            luis, uber, amount=200_000, created_at=local_datetime(2025, 11, 15)
        )

    def test_summary_returns_kpis(self):
        response = self.client.get(reverse("metrics-summary"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {
                "approved_amount": 600_000,
                "total_transactions": 4,
                "average_ticket": 200_000,
                "approval_rate": 75.0,
                "unique_customers": 2,
            },
        )

    def test_summary_respects_date_range(self):
        response = self.client.get(
            reverse("metrics-summary"),
            {"date_from": "2025-10-01", "date_to": "2025-10-31"},
        )

        self.assertEqual(response.data["approved_amount"], 400_000)
        self.assertEqual(response.data["total_transactions"], 3)
        self.assertEqual(response.data["approval_rate"], 66.67)

    def test_monthly_groups_by_colombia_local_month(self):
        response = self.client.get(reverse("metrics-monthly"))

        self.assertEqual(
            response.data,
            [
                {
                    "month": "2025-10",
                    "approved_amount": 400_000,
                    "total_transactions": 3,
                    "approval_rate": 66.67,
                },
                {
                    "month": "2025-11",
                    "approved_amount": 200_000,
                    "total_transactions": 1,
                    "approval_rate": 100.0,
                },
            ],
        )

    def test_by_category_returns_share_of_approved_amount(self):
        response = self.client.get(reverse("metrics-by-category"))

        shares = {row["category"]: row["share"] for row in response.data}
        self.assertEqual(shares, {Category.CLOTHING: 66.67, Category.TRANSPORT: 33.33})

    def test_top_customers_are_sorted_by_approved_amount(self):
        response = self.client.get(reverse("metrics-top-customers"))

        self.assertEqual(
            [row["customer_id"] for row in response.data], ["CUS-0001", "CUS-0002"]
        )
        self.assertEqual(response.data[0]["approved_amount"], 400_000)

    def test_invalid_date_returns_400(self):
        response = self.client.get(reverse("metrics-summary"), {"date_from": "ayer"})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
