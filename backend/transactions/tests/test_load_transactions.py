import tempfile
from io import StringIO
from pathlib import Path

from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase

from transactions.models import Customer, Merchant, Transaction

CSV_CONTENT = """\
transaction_id,created_at,customer_id,customer_name,customer_type,city,merchant,category,channel,amount,currency,installments,status
TXN-000001,2025-10-01T01:47:18-05:00,CUS-0021,David López,Persona natural,Barranquilla,Cruz Verde,Salud,Billetera digital,137000,COP,1,Aprobada
TXN-000002,2025-10-01T07:53:02-05:00,CUS-0397,Ana García,Persona natural,Cúcuta,Uber,Transporte,Tarjeta débito,97500,COP,1,Aprobada
TXN-000003,2025-10-02T08:08:31-05:00,CUS-0021,David López,Persona natural,Barranquilla,Uber,Transporte,Tarjeta crédito,2309400,COP,3,Rechazada
"""


class LoadTransactionsCommandTests(TestCase):
    def setUp(self):
        tmp_dir = Path(self.enterContext(tempfile.TemporaryDirectory()))
        self.csv_path = tmp_dir / "transactions.csv"
        self.csv_path.write_text(CSV_CONTENT, encoding="utf-8")

    def load(self, path):
        call_command("load_transactions", str(path), stdout=StringIO())

    def test_loads_customers_merchants_and_transactions(self):
        self.load(self.csv_path)

        self.assertEqual(Transaction.objects.count(), 3)
        self.assertEqual(Customer.objects.count(), 2)
        self.assertEqual(Merchant.objects.count(), 2)

    def test_running_twice_does_not_duplicate_rows(self):
        self.load(self.csv_path)
        self.load(self.csv_path)

        self.assertEqual(Transaction.objects.count(), 3)
        self.assertEqual(Customer.objects.count(), 2)
        self.assertEqual(Merchant.objects.count(), 2)

    def test_missing_file_raises_command_error(self):
        with self.assertRaises(CommandError):
            self.load(self.csv_path.parent / "missing.csv")
