# Webchat-Simulation Familie A (Weg einzeln: Bilder nicht als Datei in der Sandbox). Aufruf aus AD_WORKFLOW_R1/.
set -u
export KFB_AD_DIR=$PWD/test_r1/_privat/kfb_ad
U=test_r1/_privat/kfb_ad/aqua10-ad-test-r1_r1_A_l1; W=test_r1/_privat/webchat_A; DL=test_r1/_privat/downloads_A; S=chatgpt-skill/kfb-art-direction/scripts/ad_return.py
H=$(python3 -c "import json;print(json.load(open('$KFB_AD_DIR/pakete.json'))['aqua10-ad-test-r1']['r1']['hash'][:12])")
B='{"echtzeit_threejs":true,"ein_licht_rig":true,"keine_glanzpunkte":true,"kein_neuer_text":true,"figuren_unveraendert":true,"komposition_gleich":true,"seitenverhaeltnis_gleich":true,"hud_aus_kit":true,"neue_assets":[],"hinweis":"SIMULIERT"}'
r(){ python3 $S "$@" --arbeit $W; }
rm -rf $W $DL; mkdir -p $DL
python3 -c "from PIL import Image; import os; Image.new('RGB',(1280,720)).save('$DL/alt_vorher.png'); os.utime('$DL/alt_vorher.png',(0,0))"
r start --paket $U/package.json --familie A --erwarte "$H" --modell "SIMULIERT (kein Bildmodell)" --simuliert >/dev/null
r ziel --finding F01 --rolle still --ohne-datei
r ziel --finding F02 --rolle still --ohne-datei
r texte --finding F01 --aenderung "SIMULIERT: Hintergrund hinter dem Becken abgedunkelt und weich; dunkle Fläche unter dem Spruch." --bleibt "Logo, Becken, Radio, Knopf, alle Texte wörtlich." --warum "Befund F01: Hintergrund konkurriert mit dem Becken." --referenzen claybound,gta-ton-interface --baubarkeit "$B"
r texte --finding F02 --aenderung "SIMULIERT: Figurenblatt im Kit-Rahmen Petrol/Messing wie die Fisch-Karte." --bleibt "Inhalt, Texte wörtlich, Position." --warum "Befund F02: zwei Rahmensprachen." --referenzen claybound --baubarkeit "$(echo "$B" | sed 's/"neue_assets":\[\]/"neue_assets":["großer Kit-Rahmen fürs Figurenblatt (fehlt im Kit)"]/')"
r freigabe --target F01_still_v1 --status PASS --wortlaut "SIMULIERT: ja"
r freigabe --target F02_still_v1 --status PASS --wortlaut "SIMULIERT: ja, Rahmen so"
r uebersicht; echo "exit $? (erwartet: keine Dateien → Kopfzeilen)"
r abschluss --weg einzeln
# Georg lädt beim PASS: Figurenblatt zuerst, Startbild doppelt (Doppelklick), Modellformat 1536×1024; Rückgabedatei zuletzt
sleep 1; python3 -c "from PIL import Image; Image.open('$U/S05_figurenblatt__trouble_desktop__still__edit.png').resize((1536,1024)).save('$DL/ChatGPT Image 1.png')"
sleep 1; python3 -c "from PIL import Image; Image.open('$U/S02_startbild__trouble_desktop__still__edit.png').resize((1536,1024)).save('$DL/ChatGPT Image 2.png')"
cp "$DL/ChatGPT Image 2.png" "$DL/ChatGPT Image 2 (1).png"
sleep 1; cp $W/kfb-ad-return_*.json $DL/
python3 tools/ad_ingest.py scan --inbox $DL --state test_r1/_privat/ingest_state.json
R=$(ls $DL/kfb-ad-return_*.json)
rm -rf test_r1/ingest_A; python3 tools/ad_ingest.py ingest "$R" --aus test_r1/ingest_A --bilder $DL --erlaube-simuliert --state test_r1/_privat/ingest_state.json
cat test_r1/ingest_A/INGEST_BERICHT.md
