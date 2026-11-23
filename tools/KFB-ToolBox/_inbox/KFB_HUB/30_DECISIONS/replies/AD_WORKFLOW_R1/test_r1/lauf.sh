# Ganzer Probelauf test_r1 (aus AD_WORKFLOW_R1/): bash test_r1/lauf.sh
# Quelle: test_r1/_privat_quelle (Schnappschuss der Erfassung, festgenagelt in auswahl_r1.json). Nichts geht nach außen.
set -e
export KFB_AD_DIR=$PWD/test_r1/_privat/kfb_ad
rm -rf test_r1/_privat test_r1/ingest_A test_r1/ingest_D; mkdir -p test_r1/_privat
echo "== Paket ohne Ausnahme (erwartet: Zeitfenster-Fehler)"; python3 tools/ad_package.py build test_r1/auswahl_r1.json test_r1/_privat/probe || true; rm -rf test_r1/_privat/probe
echo "== Paket in öffentlichen Ordner (erwartet: Ablehnung)"; python3 tools/ad_package.py build test_r1/auswahl_r1.json test_r1/oeffentlich --erlaube-zeit-unsicher || true; rm -rf test_r1/oeffentlich
echo "== Paket"; python3 tools/ad_package.py build test_r1/auswahl_r1.json test_r1/_privat/paket --erlaube-zeit-unsicher
python3 tools/ad_package.py validate test_r1/_privat/paket
python3 tools/ad_package.py publish test_r1/_privat/paket
python3 tools/ad_package.py stage test_r1/_privat/paket D; python3 tools/ad_package.py stage test_r1/_privat/paket A
echo "== Webchat D (bundle)"; bash test_r1/sim_D.sh
echo "== Ingest D"; python3 tools/ad_ingest.py ingest test_r1/_privat/webchat_D/kfb-ad-return_*.json --aus test_r1/ingest_D --erlaube-simuliert --state test_r1/_privat/ingest_state.json
python3 tools/ad_package.py publish test_r1/ingest_D/_privat --run aqua10-ad-test-r1 --unter rueckgabe/D_l1
echo "== Webchat A (einzeln) + Ingest A"; bash test_r1/sim_A.sh
echo "== Vergleich (Kritiker-Ausgabe simuliert)"
python3 -c "import json; json.dump({'verdict':'FAIL','scores':{'A':7,'B':6,'C':8,'D':6,'E':8,'F':'n/a','G':7,'H':8},'findings':[{'axis':a,'file':'neu.mp4'} for a in 'ACEGH']},open('test_r1/_privat/kritik_r1.json','w'))"
python3 -c "import json; json.dump({'verdict':'PASS','scores':{'A':8,'B':8,'C':9,'D':8,'E':8,'F':'n/a','G':8,'H':9},'findings':[{'axis':a,'file':'neu.mp4'} for a in 'ABCDEGH']},open('test_r1/_privat/kritik_r2.json','w'))"
cp test_r1/ingest_D/vergleich/F03.json test_r1/_privat/F03_vergleich.json; mkdir -p test_r1/_privat/vergleich_F03_r1 test_r1/oeffentlich_erfassung
python3 tools/ad_vergleich.py runde test_r1/_privat/F03_vergleich.json test_r1/_privat/kritik_r1.json --erfassung test_r1/oeffentlich_erfassung --gates-gruen || true; rm -rf test_r1/oeffentlich_erfassung
python3 tools/ad_vergleich.py runde test_r1/_privat/F03_vergleich.json test_r1/_privat/kritik_r1.json --erfassung test_r1/_privat/vergleich_F03_r1 --gates-gruen || true
python3 tools/ad_vergleich.py runde test_r1/_privat/F03_vergleich.json test_r1/_privat/kritik_r2.json --erfassung test_r1/_privat/vergleich_F03_r1 --gates-gruen || true
echo "== Lauf 2 Familie D (nur F04, mit Anker)"
python3 tools/ad_package.py stage test_r1/_privat/paket D --lauf 2 --nur F04 || true
python3 tools/ad_package.py stage test_r1/_privat/paket D --lauf 2 --nur F04 --anker test_r1/ingest_D/_privat/ziele/F03_ausholung_v1.png
U2=test_r1/_privat/kfb_ad/aqua10-ad-test-r1_r1_D_l2; python3 $U2/ad_return.py start --paket $U2/package.json --familie D --lauf 2 --nur F04 --arbeit test_r1/_privat/webchat_D2 --simuliert | head -3
echo "== Tests"; python3 -W ignore tools/test_ad.py 2>&1 | tail -3
