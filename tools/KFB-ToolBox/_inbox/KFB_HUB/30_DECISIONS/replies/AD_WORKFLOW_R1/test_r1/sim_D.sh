# Webchat-Simulation Familie D (Weg bundle) mit dem Skript aus dem Upload-Ordner. Aufruf aus AD_WORKFLOW_R1/.
set -u
export KFB_AD_DIR=$PWD/test_r1/_privat/kfb_ad
U=test_r1/_privat/kfb_ad/aqua10-ad-test-r1_r1_D_l1; W=test_r1/_privat/webchat_D; S=$U/ad_return.py
H=$(python3 -c "import json;print(json.load(open('$KFB_AD_DIR/pakete.json'))['aqua10-ad-test-r1']['r1']['hash'][:12])")
python3 -c "from PIL import Image; Image.new('RGB',(1000,1000)).save('test_r1/_privat/quadrat.png'); Image.open('$U/S16_hai_angriff__trouble_desktop__aufprall__edit.png').resize((1536,1024)).save('test_r1/_privat/modell_aufprall_1536.png')"
B='{"echtzeit_threejs":true,"ein_licht_rig":true,"keine_glanzpunkte":true,"kein_neuer_text":true,"figuren_unveraendert":true,"komposition_gleich":true,"seitenverhaeltnis_gleich":true,"hud_aus_kit":null,"neue_assets":[],"hinweis":"SIMULIERT"}'
r(){ python3 $S "$@" --arbeit $W; }
rm -rf $W
r start --paket $U/package.json --familie D --erwarte 000000000000 --simuliert; echo "exit $? (erwartet: Prüfsumme falsch)"
python3 test_r1/_privat/kfb_ad/aqua10-ad-test-r1_r1_A_l1/ad_return.py start --paket test_r1/_privat/kfb_ad/aqua10-ad-test-r1_r1_A_l1/package.json --familie D --arbeit $W --simuliert; echo "exit $? (erwartet: Upload passt nicht zu Familie D)"
r start --paket $U/package.json --familie D --lauf 1 --erwarte "#$H" --modell "SIMULIERT (kein Bildmodell)" --simuliert
r start --paket $U/package.json --familie D --simuliert; echo "exit $? (erwartet: Entwurf existiert)"
r ziel --finding F04 --rolle naehe --bild test_r1/_privat/quadrat.png; echo "exit $? (erwartet: Format)"
r ziel --finding F04 --rolle aufprall --bild $U/S16_hai_angriff__trouble_desktop__naehe__edit.png; echo "exit $? (erwartet: Rolle nicht verlangt)"
r texte --finding F03 --referenzen gta-ton-interface; echo "exit $? (erwartet: Referenz gehört nicht zum Befund)"
r texte --finding F03 --aeste 1; echo "exit $? (erwartet: Äste fest)"
r ziel --finding F03 --rolle ausholung --bild $U/S16_hai_angriff__trouble_desktop__ausholung__edit.png
r ziel --finding F03 --rolle aufprall --bild $U/S16_hai_angriff__trouble_desktop__aufprall__edit.png
r ziel --finding F04 --rolle naehe --bild test_r1/_privat/paket/media/stills/S16_hai_angriff__trouble_desktop__naehe.png
r texte --finding F03 --aenderung "SIMULIERT: Biss ohne Schwarzbild; Zuschnappen mit Wasser-Schockring und Blasenstoß in Bissrichtung." --bleibt "Hai-Modell, KFB-Augen, Kamera, Kinobalken." --warum "Befund F03: Schwarzbild wirkt wie Ladefehler, Treffer ohne Ursache/Richtung." --referenzen looney-tunes,claybound --baubarkeit "$(echo "$B" | sed 's/SIMULIERT/SIMULIERT: Schockring als Partikel-Ring am Kiefer/')"
r texte --finding F04 --aenderung "SIMULIERT: Welt-Monitor aus dem linken Bildrand entfernt." --bleibt "Hai, Fisch, Licht, Kinobalken." --warum "Befund F04: Monitor im Kameraweg." --referenzen claybound --baubarkeit "$B"
r freigabe --target F03_ausholung_v1 --status PASS --wortlaut "SIMULIERT: passt"
r freigabe --target F03_aufprall_v1 --status TUNE --wortlaut "SIMULIERT: Ring kleiner"
r abschluss --weg bundle; echo "exit $? (erwartet: TUNE offen)"
r ziel --finding F03 --rolle aufprall --bild test_r1/_privat/modell_aufprall_1536.png
r freigabe --target F03_aufprall_v1 --status PASS; echo "exit $? (erwartet: nicht neueste Fassung)"
r freigabe --target F03_aufprall_v2 --status PASS --wortlaut "SIMULIERT: jetzt gut"
r freigabe --target F04_naehe_v1 --status PASS --wortlaut "SIMULIERT: ok"
r status
r uebersicht
r abschluss --weg bundle
