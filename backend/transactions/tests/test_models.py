from datetime import UTC, datetime

from django.test import SimpleTestCase

from transactions.choices import AmountRange
from transactions.models import Transaction


class AmountRangeTests(SimpleTestCase):
    def test_amount_range_boundaries(self):
        cases = [
            (99_999, AmountRange.LOW),
            (100_000, AmountRange.MEDIUM),
            (1_000_000, AmountRange.MEDIUM),
            (1_000_001, AmountRange.HIGH),
        ]
        for amount, expected in cases:
            with self.subTest(amount=amount):
                self.assertEqual(Transaction(amount=amount).amount_range, expected)


class WeekdayTests(SimpleTestCase):
    def test_weekday_uses_colombia_local_time(self):
        # Monday 02:00 UTC is still Sunday 21:00 in Bogotá.
        monday_utc = datetime(2025, 10, 6, 2, 0, tzinfo=UTC)

        self.assertEqual(Transaction(created_at=monday_utc).weekday, "Domingo")
