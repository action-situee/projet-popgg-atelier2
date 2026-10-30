"""Regression checks for complete source identifiers and VTT associations."""
import importlib.util
from pathlib import Path
import unittest
import pandas as pd

spec = importlib.util.spec_from_file_location('sync', Path(__file__).resolve().parents[1] / 'scripts/sync_catalogue.py')
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)

class CatalogueImportTest(unittest.TestCase):
    def test_all_secondary_links_and_unknown_labels_survive(self):
        links = sync.vtt_links('1.1 Préservation', '1.1 Préservation, 1.2 Reconnexion; 2.3 Circularité\n3. Coopération, 1.2 Reconnexion')
        self.assertEqual(links, ['1.1 Préservation', '1.2 Reconnexion', '2.3 Circularité', '3. Coopération'])

    def test_dotted_policy_identifiers_are_not_truncated(self):
        row = pd.Series({'ID-Politique1': 'OB-PACTE-1.1.1', 'ID-Politique2': 'OB-VTT-2', 'ID-Politique3': 'OB-PACTE-1.1.1'})
        self.assertEqual(sync.reference_ids(row, 'ID-Politique'), ['OB-PACTE-1.1.1', 'OB-VTT-2'])

    def test_empty_vtt_remains_missing(self):
        self.assertEqual(sync.vtt_links('', None), [])
        self.assertEqual(sync.vtt_links('0', '0'), [])

if __name__ == '__main__':
    unittest.main()
