from django.urls import reverse, reverse_lazy
from rest_framework import status
from rest_framework.test import APITestCase

from transactions.choices import Category, Channel, City, Status

from .factories import create_customer, create_merchant, create_transaction

LIST_URL = reverse_lazy("transaction-list")


class TransactionListTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.bogota_customer = create_customer(city=City.BOGOTA)
        cls.cali_customer = create_customer(city=City.CALI)
        cls.uber = create_merchant(name="Uber", category=Category.TRANSPORT)
        cls.zara = create_merchant(name="Zara", category=Category.CLOTHING)

        # 26 transactions in total
        for _ in range(20):
            create_transaction(cls.bogota_customer, cls.uber)
        for _ in range(3):
            create_transaction(
                cls.cali_customer,
                cls.zara,
                channel=Channel.CREDIT_CARD,
                amount=200_000,
            )
        for _ in range(2):
            create_transaction(cls.cali_customer, cls.zara, status=Status.REJECTED)
        create_transaction(cls.cali_customer, cls.uber)

    def test_list_is_paginated_with_default_page_size(self):
        response = self.client.get(LIST_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 26)
        self.assertEqual(response.data["total_pages"], 2)
        self.assertEqual(len(response.data["results"]), 20)
        self.assertIsNotNone(response.data["next"])
        self.assertIsNone(response.data["previous"])

    def test_page_size_param_returns_requested_page(self):
        response = self.client.get(LIST_URL, {"page_size": 10, "page": 3})

        self.assertEqual(response.data["total_pages"], 3)
        self.assertEqual(len(response.data["results"]), 6)
        self.assertIsNone(response.data["next"])

    def test_page_size_is_capped_at_100(self):
        for _ in range(100):
            create_transaction(self.bogota_customer, self.uber)

        response = self.client.get(LIST_URL, {"page_size": 500})

        self.assertEqual(response.data["count"], 126)
        self.assertEqual(len(response.data["results"]), 100)

    def test_combined_filters_update_count_and_total_pages(self):
        params = {
            "status": Status.APPROVED,
            "city": City.CALI,
            "category": Category.CLOTHING,
            "page_size": 2,
        }

        response = self.client.get(LIST_URL, params)

        self.assertEqual(response.data["count"], 3)
        self.assertEqual(response.data["total_pages"], 2)
        for row in response.data["results"]:
            self.assertEqual(row["status"], Status.APPROVED)
            self.assertEqual(row["city"], City.CALI)
            self.assertEqual(row["category"], Category.CLOTHING)

    def test_invalid_filter_value_returns_400(self):
        response = self.client.get(LIST_URL, {"status": "Inventado"})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("status", response.data)

    def test_list_avoids_n_plus_one_queries(self):
        # One query for the count and one for the page, whatever the page size.
        with self.assertNumQueries(2):
            self.client.get(LIST_URL, {"page_size": 26})

    def test_detail_returns_transaction_with_derived_fields(self):
        transaction = create_transaction(
            self.cali_customer,
            self.zara,
            channel=Channel.CREDIT_CARD,
            amount=1_500_000,
        )

        response = self.client.get(
            reverse("transaction-detail", args=[transaction.transaction_id])
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["transaction_id"], transaction.transaction_id)
        self.assertEqual(response.data["category"], Category.CLOTHING)
        self.assertEqual(response.data["amount_range"], "Alto")
        self.assertEqual(response.data["weekday"], "Miércoles")
