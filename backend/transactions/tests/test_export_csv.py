import csv
import io

from django.urls import reverse_lazy
from rest_framework import status
from rest_framework.test import APITestCase

from transactions.choices import City, Status

from .factories import create_customer, create_merchant, create_transaction

EXPORT_URL = reverse_lazy("transaction-export")


class TransactionExportTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cali_customer = create_customer(city=City.CALI)
        bogota_customer = create_customer(city=City.BOGOTA)
        merchant = create_merchant()
        for _ in range(25):
            create_transaction(cali_customer, merchant)
        create_transaction(cali_customer, merchant, status=Status.REJECTED)
        create_transaction(bogota_customer, merchant)

    def read_csv(self, response):
        content = b"".join(response.streaming_content).decode("utf-8-sig")
        return list(csv.DictReader(io.StringIO(content)))

    def test_export_returns_all_filtered_rows_without_pagination(self):
        response = self.client.get(
            EXPORT_URL, {"status": Status.APPROVED, "city": City.CALI}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response["Content-Type"], "text/csv; charset=utf-8")
        self.assertIn("attachment;", response["Content-Disposition"])
        rows = self.read_csv(response)
        self.assertEqual(len(rows), 25)
        self.assertTrue(all(row["city"] == City.CALI for row in rows))
        self.assertIn("amount_range", rows[0])
