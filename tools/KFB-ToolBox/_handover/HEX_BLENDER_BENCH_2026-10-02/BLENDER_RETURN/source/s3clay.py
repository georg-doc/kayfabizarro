import sys; sys.path.insert(0,'/tmp/hex/work')
exec(open('/tmp/hex/work/scen.py').read())
import recipes, copy
r=copy.deepcopy(recipes.S3); out,t,p=build(r,clay=1.0)
camera(t+p,az=30,el=38,lens=45,margin=1.0); render('/tmp/hex/work/rend/SCENELET_3CELL_clayfloor_ws1_34.png')
r=copy.deepcopy(recipes.S3); out,t,p=build(r,clay=8.66)
camera(t+p,az=30,el=38,lens=45,margin=1.0); render('/tmp/hex/work/rend/SCENELET_3CELL_clayfloor_ws8.66_34.png')
