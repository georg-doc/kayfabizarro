#!/usr/bin/env python3
"""Build the NotebookLM upload folder from the lab's SSOT docs (no second copy to maintain).

python3 tools/build-notebooklm.py  →  deliveries/NOTEBOOKLM_UPLOAD/: one flat folder, one Markdown file per
SSOT source (numbered by topic) plus the reference images as JPG. Rerun after any doc change.
"""
import json, re, shutil, subprocess, sys
from pathlib import Path

LAB = Path(__file__).resolve().parent.parent
DOCS, DONOR = LAB / 'docs', LAB / 'donors/kfb-island-kit-r2-2026-10-08'
OUT = LAB / 'deliveries/NOTEBOOKLM_UPLOAD'

SOURCES = {
    '01_KFB_Kontext_und_Masterplan.md': ('Kontext und Masterplan', [
        DOCS / 'KFB_PROJEKTKONTEXT.md',
        DOCS / 'KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md', DOCS / 'KFB_GLOSSAR.md']),
    '02_KFB_Regeln_und_Vertraege.md': ('Regeln und Verträge', [
        DOCS / 'QA_RULEBOOK_ENVIRONMENT_R1.md', DOCS / 'QA_RULEBOOK_TRANSITIONS_R1.md',
        DOCS / 'SPEC_EDGE_RUBBLE_GRAMMAR_R1.md', DOCS / 'ETHERINGTON_REGELN_IN_ZAHLEN_R1.md',
        DOCS / 'SCALE_CONTRACT_K2.md', DOCS / 'SCALE_AUDIT_R1.md', DOCS / 'SPEC_PLACEMENT_GRAMMAR_R1.md',
        DOCS / 'ISLAND_ANATOMY_RULES.md', DOCS / 'QA_CRITIC_PROTOCOL_R1.md']),
    '03_KFB_Bauanleitungen_und_Technik.md': ('Bauanleitungen und Technik', [
        DOCS / 'KFB_TECHNIK_UND_SCHNITTSTELLEN_R1.md', DOCS / 'STAGE1_R2D_PORT_PLAN.md', DONOR / 'BAUANLEITUNG.md',
        DONOR / 'KFB_R2D_v0/KONZEPT_SCHOLLE_v7.md', DONOR / 'KFB_R2D_v0/WATER_CONCEPT.md',
        DONOR / 'KFB_Island_Kit_R1/KONZEPT_R2.md', DONOR / 'KFB_R2D_v0/RETURN.md',
        DOCS / 'SPEC_ENVIRONMENT_KIT_R1.md', DOCS / 'ENV_ERZAEHLRASTER_R1.md']),
    '04_KFB_Story_und_Decks.md': ('Story und Decks', [
        DOCS / 'story/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md',
        ('deck', 'Dystopia', DOCS / 'decks/ignore_dystopia.json'),
        ('deck', 'Utopia', DOCS / 'decks/forget_utopia.json'),
        ('deck', 'Protopia', DOCS / 'decks/embrace_protopia.json')]),
    '05_KFB_Briefings_und_Projektstand.md': ('Briefings und Projektstand', [
        LAB / 'deliveries/BRIEF_CLAUDE_DESIGN_HUD_FLIGHT_R1.md', LAB / 'deliveries/BRIEF_CLAUDE_DESIGN_CURTAIN_CLAY_R1.md',
        DOCS / 'PROJECT_STATE.md']),
    '06_KFB_Probleme_und_Recherche_Prompts.md': ('Probleme und Recherche-Prompts', [
        DOCS / 'KFB_PAINPOINTS_UND_BLINDSPOTS_R1.md', DOCS / 'notebooklm/KFB_DEEP_RESEARCH_PROMPTS_R1.md']),
}

# image number → (source file, caption); numbering matches docs/notebooklm/BILDERLISTE.md and the prompts
IMAGES = [
    ('01', DOCS / 'style-references/r2d_v0_sprenkel_referenz_burg.jpg', 'R2D-v0-Insel (Burg), Draufsicht, Sand ↔ Gras am Bach. Kandidat für die Sprenkel-Referenz; Georg prüft noch, ob er dieses oder ein anderes Beispiel meint.'),
    ('02', DOCS / 'feedback/rkit_bauweise_v4_kfbblend_crop.png', 'kfbBlend stark vergrößert (Bauweise-Blatt v4). FAIL-Beispiel: ausgefranste, verschwimmende Flächen, Geisterkonturen.'),
    ('03', DOCS / 'feedback/rkit_bauweise_v5_knetflecken_fahrhoehe.jpg', 'Sandbankett an einer Straße aus Fahrhöhe (v5). Liest sich annähernd als Sprenkel.'),
    ('04', DOCS / 'feedback/rkit_bauweise_v5_knetflecken_laufhoehe.jpg', 'Dasselbe aus Laufhöhe. Problem: verschmilzt zu Flächen, gebackene Textur zu grob.'),
    ('05', DOCS / 'feedback/rkit_bauweise_v5_wegende_frei.jpg', 'Freies Gehweg-Ende, gestaffelte Platten, Rubbel (Blender-Render v5). TUNE: Sandbett mit harter Kante, Rubbel wie abgeladene Häufchen.'),
    ('06', DOCS / 'feedback/rkit_bauweise_v5_rampenfuss.jpg', 'Übergang Joyride-Bande → Stadtbord mit Profilschnitt (v5). TUNE: Bandenende spitz wie eine Wurst, Fahrbahn-Ausbuchtung.'),
    ('07', DOCS / 'style-references/georg_2026-10-08_schneekuppen_zacken.png', 'Georgs Referenz für Schnee-Zackenkappen (Übergangsart „Zacken“).'),
    *[(f'08.{i}', next((DOCS / 'feedback').glob(f'georg_2026-10-08_probe2_fail_{i}.*')), 'Georgs Screenshot zur Environment-Probe v2. FAIL: Fels liegt auf, Verläufe, dunkle Ringe, Band als Ring.') for i in range(1, 6)],
    ('09', DOCS / 'biome-sheets/Bauweise_Erdung.jpg', 'Environment-Blatt „Wie liegt was in der Landschaft“. PASS (Georg): Erdung nach Objektart und Geschichte.'),
    ('10', DOCS / 'biome-sheets/R2_farbgrammatik.jpg', 'Farb-Grammatik: Farben nach Material-Rollen je Insel. Von Georg positiv bewertet.'),
    ('11', DOCS / 'biome-sheets/R2_etherington.jpg', 'Erste Etherington-Probe (Baum, Busch, Fels, ohne/mit). FAIL: Konzept falsch, Felsen zu flach eingesetzt.'),
    ('12', DOCS / 'biome-sheets/Erzaehlraster.jpg', 'Älteres Erzählraster. Überholt: zu wenig eigene Geschichte; neue Richtung aus Decks + Demo-Szenen.'),
    ('13', Path.home() / 'Dropbox/CLAUDE/KFB Claymation Reference/FLOATING ISLANDS DESIGN.webp', 'Illustrierte Karte schwebender Inseln mit Stationen. Stimmungs- und Kompositionsreferenz.'),
    ('14', next((Path.home() / 'Dropbox/CLAUDE/KFB Claymation Reference').glob('DioramaScenes - overview*')), 'Übersicht Diorama-Szenen. Referenz für sparsame Diorama-Komposition.'),
]


def deck_md(island, path):
    d = json.loads(path.read_text())
    out = [f"# Deck {island}: {d['deckTitle']}\n", f"Insel: **{island}** · {len(d['cards'])} Karten\n", f"> {d.get('blurb', '')}\n"]
    for c in d['cards']:
        out.append(f"## {island} {c['cardNumber']:02d} · {c['cardName']}\n\n- **Power:** {c.get('power', '')}\n- **Lore:** {c.get('lore', '')}\n- **Bildidee:** {c.get('artworkPrompt', '')}\n")
    return '\n'.join(out)


def build_md_files():
    """one Markdown file per SSOT source, flat, numbered by topic (NotebookLM wants single files, no bundles)"""
    n = 0
    for _, items in SOURCES.values():
        for it in items:
            n += 1
            if isinstance(it, tuple):
                (OUT / f'{n:02d}_DECK_{it[1].upper()}.md').write_text(deck_md(it[1], it[2]))
            else:
                name = it.name if it.parent.name != 'KFB_R2D_v0' and it.parent.name != 'KFB_Island_Kit_R1' else f'R2D_{it.name}'
                if it.name == 'BAUANLEITUNG.md':
                    name = 'R2D_ISLAND_KIT_R2_BAUANLEITUNG.md'
                shutil.copyfile(it, OUT / f'{n:02d}_{name}')


def build_images():
    for num, src, cap in IMAGES:
        slug = re.sub(r'[^A-Za-z0-9]+', '_', cap.split('.')[0].replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue').replace('ß', 'ss').replace('Ä', 'Ae').replace('Ü', 'Ue').replace('Ö', 'Oe'))[:60].strip('_')
        subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '85', '-Z', '1800', str(src), '--out', str(OUT / f'Bild_{num}_{slug}.jpg')], check=True, capture_output=True)


if __name__ == '__main__':
    if OUT.exists():
        shutil.rmtree(OUT)  # generated folder only; the SSOT files above are never touched
    OUT.mkdir(parents=True)
    for name, (title, items) in SOURCES.items():
        missing = [str(i if not isinstance(i, tuple) else i[2]) for i in items if not (i[2] if isinstance(i, tuple) else i).exists()]
        if missing:
            sys.exit(f'missing source: {missing}')
    build_md_files()
    build_images()
    for f in sorted(OUT.iterdir()):
        print(f'{f.stat().st_size:>9}  {f.name}')
