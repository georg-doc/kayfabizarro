import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "decks.py"
spec = importlib.util.spec_from_file_location("kfb_asset_registry_decks", MODULE_PATH)
decks = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(decks)


class DeckRegistryTests(unittest.TestCase):
    def test_card_adapter_normalizes_all_observed_shapes(self):
        canonical, status = decks._normalized_cards({"cards": [{"cardNumber": 7, "cardName": "Seven"}]})
        self.assertEqual((canonical[0]["cardNumber"], canonical[0]["cardName"], status), (7, "Seven", "canonical"))
        alternate, status = decks._normalized_cards({"cards": [{"num": "3", "name": "Three"}]})
        self.assertEqual((alternate[0]["cardNumber"], alternate[0]["cardName"], status), (3, "Three", "normalized-num-name"))
        ordered, status = decks._normalized_cards({"cards": [{"name": "First"}, {"name": "Second"}]})
        self.assertEqual([card["cardNumber"] for card in ordered], [1, 2])
        self.assertEqual(status, "normalized-name-only")

    def test_pdf_page_tree_count_is_measured_without_third_party_dependency(self):
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "sample.pdf"
            path.write_bytes(b"%PDF-1.4\n1 0 obj << /Type /Pages /Count 17 >> endobj\n%%EOF")
            self.assertEqual(decks._pdf_page_count(path), 17)

    def _fixture(self, root: Path):
        deck_root = root / "media" / "kfb"
        deck_root.mkdir(parents=True)
        source = {
            "schema": "kfb-deck-registry/v2",
            "decks": [
                {"packId": "forget_utopia", "title": "Forget Utopia", "pdf": "a.pdf", "data": "a.json", "cardCount": 56},
                {"packId": "ignore_dystopia", "title": "Anatomy of a Trap", "pdf": "b.pdf", "data": "b.json", "cardCount": 56},
                {"packId": "embrace_protopia", "title": "Protopia Sketchbook", "pdf": "c.pdf", "data": "c.json", "cardCount": 56},
            ],
            "sets": [{"setId": "three_futures", "decks": ["forget_utopia", "ignore_dystopia", "embrace_protopia"]}],
            "rules": [{"title": "Rules", "pdf": "rules.pdf"}],
        }
        registry = deck_root / "kfb-index.json"
        registry.write_text(json.dumps(source), encoding="utf-8")
        tracked = {"media/kfb/kfb-index.json"}
        for name in ("a.pdf", "a.json", "b.pdf", "b.json", "c.pdf", "c.json", "rules.pdf"):
            (deck_root / name).write_text(name, encoding="utf-8")
            tracked.add(f"media/kfb/{name}")
        return tracked

    def test_three_explicit_decks_are_projected_without_inference(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            tracked = self._fixture(root)
            records, index, problems, cards, town, qa = decks.build_decks(
                root,
                registry_path="media/kfb/kfb-index.json",
                deck_root="media/kfb",
                tracked_paths=tracked,
                repo="georg-doc/kayfabizarro",
                commit="abc123",
            )
            self.assertEqual(len(records), 3)
            self.assertEqual(index["count"], 3)
            self.assertEqual(index["sourceRegistry"]["schema"], "kfb-deck-registry/v2")
            self.assertEqual(problems, [])
            self.assertEqual(index["cardCount"], 0)
            self.assertEqual(cards, [])
            self.assertEqual(town["schema"], "kfb.town-deck-library/1")
            self.assertEqual(qa["deckCount"], 3)
            for record in records:
                self.assertEqual(record["groupingStatus"], "explicit")
                self.assertEqual(len(record["representations"]["pdf"]), 1)
                self.assertEqual(len(record["representations"]["cardTextJson"]), 1)
                self.assertTrue(record["representations"]["pdf"][0]["exists"])
                self.assertTrue(record["representations"]["cardTextJson"][0]["exists"])

    def test_missing_explicit_representation_becomes_problem(self):
        with tempfile.TemporaryDirectory() as td:
            root = Path(td)
            tracked = self._fixture(root)
            tracked.remove("media/kfb/b.pdf")
            records, _, problems, _, _, _ = decks.build_decks(
                root,
                registry_path="media/kfb/kfb-index.json",
                deck_root="media/kfb",
                tracked_paths=tracked,
                repo="georg-doc/kayfabizarro",
                commit="abc123",
            )
            self.assertEqual(len(records), 3)
            self.assertEqual([problem["type"] for problem in problems], ["MISSING_DECK_PDF"])
            self.assertEqual(problems[0]["deckId"], "ignore_dystopia")


if __name__ == "__main__":
    unittest.main()
