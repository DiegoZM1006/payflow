import csv
from datetime import datetime
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction as db_transaction

from transactions.models import Customer, Merchant, Transaction


class Command(BaseCommand):
    help = "Load transactions from a CSV file. Safe to run multiple times (idempotent)."

    def add_arguments(self, parser):
        parser.add_argument(
            "csv_path", type=Path, help="Path to the transactions CSV file"
        )

    def handle(self, *args, **options):
        csv_path = options["csv_path"]
        if not csv_path.is_file():
            raise CommandError(f"File not found: {csv_path}")

        with csv_path.open(encoding="utf-8", newline="") as csv_file:
            rows = list(csv.DictReader(csv_file))

        with db_transaction.atomic():
            customers = self._upsert_customers(rows)
            merchants = self._upsert_merchants(rows)
            loaded = self._upsert_transactions(rows, customers, merchants)

        self.stdout.write(
            self.style.SUCCESS(
                f"Loaded {loaded} transactions, {len(customers)} customers "
                f"and {len(merchants)} merchants."
            )
        )

    def _upsert_customers(self, rows):
        customers = {
            row["customer_id"]: Customer(
                customer_id=row["customer_id"],
                name=row["customer_name"],
                customer_type=row["customer_type"],
                city=row["city"],
            )
            for row in rows
        }
        Customer.objects.bulk_create(
            customers.values(),
            update_conflicts=True,
            unique_fields=["customer_id"],
            update_fields=["name", "customer_type", "city"],
        )
        return {customer.customer_id: customer for customer in Customer.objects.all()}

    def _upsert_merchants(self, rows):
        merchants = {
            row["merchant"]: Merchant(name=row["merchant"], category=row["category"])
            for row in rows
        }
        Merchant.objects.bulk_create(
            merchants.values(),
            update_conflicts=True,
            unique_fields=["name"],
            update_fields=["category"],
        )
        return {merchant.name: merchant for merchant in Merchant.objects.all()}

    def _upsert_transactions(self, rows, customers, merchants):
        transactions = [
            Transaction(
                transaction_id=row["transaction_id"],
                created_at=datetime.fromisoformat(row["created_at"]),
                customer=customers[row["customer_id"]],
                merchant=merchants[row["merchant"]],
                channel=row["channel"],
                amount=int(row["amount"]),
                currency=row["currency"],
                installments=int(row["installments"]),
                status=row["status"],
            )
            for row in rows
        ]
        Transaction.objects.bulk_create(
            transactions,
            update_conflicts=True,
            unique_fields=["transaction_id"],
            update_fields=[
                "created_at",
                "customer",
                "merchant",
                "channel",
                "amount",
                "currency",
                "installments",
                "status",
            ],
            batch_size=1000,
        )
        return len(transactions)
