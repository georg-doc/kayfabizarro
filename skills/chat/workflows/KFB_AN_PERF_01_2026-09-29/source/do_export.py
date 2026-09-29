exec(open('/tmp/an1/perf.py').read())
for a in list(bpy.data.actions):
    if '_hop_a__' in a.name: bpy.data.actions.remove(a)
print(sorted(a.name for a in bpy.data.actions if a.name.endswith('__N')))
export(['kfb_interaction_gift_give_a','kfb_interaction_gift_receive_a','kfb_locomotion_nutcracker_march_a'])
