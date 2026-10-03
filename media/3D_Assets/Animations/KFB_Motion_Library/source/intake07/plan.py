# intake 07 (Georg 03.10): locomotion basics for the gait ladder. 41 single FBX from Dropbox BLENDER MCP/_inbox.
import json
SKIP = {'Standard Run': ('kfb_locomotion_standard_run_a', 3.6), 'Running (5)': ('kfb_locomotion_running_d', 2.4), 'Run Forward (3)': ('kfb_locomotion_run_forward_b', 4.3),
 'Standing Sprint Forward': ('kfb_locomotion_magic_sprint_forward_a', 2.3), 'Stop Walking': ('kfb_locomotion_stop_walking_a', 0.0), 'Stop Walking (1)': ('kfb_locomotion_stop_walking_a', 2.0),
 'Female Stop And Start Walking (1)': ('Female Stop And Start Walking.fbx (same intake)', 2.1), 'Left Strafe Walking (1)': ('kfb_locomotion_left_strafe_walking_b', 0.5),
 'Right Strafe Walking (1)': ('kfb_locomotion_right_strafe_walking_b', 0.4), 'Right Strafe Walk': ('kfb_locomotion_female_right_strafe_walk_a', 3.0),
 'Walking (13)': ('kfb_locomotion_walking_j', 0.0), 'Walking (14)': ('kfb_locomotion_walking_i', 3.9), 'Walking (15)': ('kfb_locomotion_walking_a', 2.7),
 'Running Jump (1)': ('kfb_locomotion_running_jump_a', 0.0), 'Jog In Circle (1)': ('kfb_locomotion_jog_in_circle_a', 4.4), 'Run Backward (1)': ('Running Backward.fbx (same intake)', 6.6)}
P = [
 ('Jogging','jogging','Joggen'), ('Jog Forward','jog_forward','Vorwärts joggen'), ('Jog Forward Diagonal','jog_forward_diagonal','Diagonal vorwärts joggen'),
 ('Slow Run','slow_run','Langsam rennen'), ('Medium Run','medium_run','Mittel schnell rennen'), ('Standard Run','standard_run','Normal rennen'),
 ('Running (3)','running','Rennen'), ('Running (4)','running','Rennen'), ('Running (5)','running','Rennen'),
 ('Run Forward (2)','run_forward','Vorwärts rennen'), ('Run Forward (3)','run_forward','Vorwärts rennen'), ('Fast Run','fast_run','Schnell rennen'),
 ('Sprint','sprint','Sprinten'), ('Standing Sprint Forward','standing_sprint_forward','Aus dem Stand lossprinten'), ('Idle To Sprint','idle_to_sprint','Aus dem Stand in den Sprint'),
 ('Sprint Turn','sprint_turn','Sprint mit Wende'), ('Start Walking','start_walking','Losgehen'), ('Stop Walking','stop_walking','Anhalten'), ('Stop Walking (1)','stop_walking','Anhalten'),
 ('Female Start Walking','female_start_walking','Losgehen (weiblich)'), ('Female Stop Walking','female_stop_walking','Anhalten (weiblich)'),
 ('Female Stop And Start Walking','female_stop_and_start_walking','Anhalten und weitergehen (weiblich)'), ('Female Stop And Start Walking (1)','female_stop_and_start_walking','Anhalten und weitergehen (weiblich)'),
 ('Walking Backwards','walking_backwards','Rückwärts gehen'), ('Slow Jog Backwards','slow_jog_backwards','Langsam rückwärts joggen'),
 ('Running Backward','running_backward','Rückwärts rennen'), ('Run Backward (1)','run_backward','Rückwärts rennen'),
 ('Strafe','strafe','Seitwärts laufen'), ('Left Strafe Walking (1)','left_strafe_walking','Seitwärts nach links gehen'), ('Right Strafe Walking (1)','right_strafe_walking','Seitwärts nach rechts gehen'),
 ('Right Strafe Walk','right_strafe_walk','Seitwärts nach rechts gehen'), ('Change Direction','change_direction','Richtung wechseln'), ('Running Right Turn','running_right_turn','Rechtskurve im Lauf'),
 ('Walking (13)','walking','Gehen'), ('Walking (14)','walking','Gehen'), ('Walking (15)','walking','Gehen'), ('Walking (16)','walking','Gehen'),
 ('Jump','jump','Springen'), ('Jumping','jumping','Springen'), ('Running Jump (1)','running_jump','Sprung aus dem Lauf'), ('Jog In Circle (1)','jog_in_circle','Im Kreis joggen'),
]
def ids(existing):
    used = set(existing); out = []
    for fn, n, de in P:
        if fn in SKIP: continue
        k = 0
        while f'kfb_locomotion_{n}_{"abcdefghijklmnopqrstuvwxyz"[k]}' in used: k += 1
        cid = f'kfb_locomotion_{n}_{"abcdefghijklmnopqrstuvwxyz"[k]}'; used.add(cid)
        out.append({'file': fn, 'group': 'locomotion', 'id': cid, 'label_de': de})
    return out
if __name__ == '__main__':
    c = json.load(open('/tmp/loco/src/catalog.json'))
    I = ids([x['id'] for x in c['clips']]); json.dump(I, open('/tmp/ml7/ids.json', 'w'), indent=1)
    print(len(I)); print([x['id'] for x in I])
