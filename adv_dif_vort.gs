'reset'
time = 1
maskout=1500
'run jaecol.gs'
'set lat -65 -5'
'set lon 230 350'
'set mpdset mres'
while(time<12)
'set t 'time
***---***
'define vort=hcurl(ugrdprs(lev=500),vgrdprs(lev=500))'
'define pi=3.14159'
'define r=6371000'
'define dy=r*2*pi*cdiff(lat,y)/360'
'define dx=r*2*pi*cdiff(lon,x)*cos(lat*2*pi/360)/360'
'define dtx=cdiff(vort,x)/dx'
'define dty=cdiff(vort,y)/dy'
'define av5=-ugrd10m*dtx-vgrd10m*dty'
***---***
******* para Adveccion hor para 900 hPa
'set lev 900'
'define vortd=hcurl(ugrdprs,vgrdprs)'
'define pi=3.14159'
'define r=6371000'
'define dy=r*2*pi*cdiff(lat,y)/360'
'define dx=r*2*pi*cdiff(lon,x)*cos(lat*2*pi/360)/360'
'define dtx=cdiff(vortd,x)/dx'
'define dty=cdiff(vortd,y)/dy'
'define av9=-ugrd10m*dtx-vgrd10m*dty'

'define advdif=-((av5-av9)/(hgtprs(lev=500)-hgtprs(lev=900)))'

'set gxout shaded'
'set clevs -12 -8 -6 -4 -3 -2 -1  0  1 2 3 4 6 8 12'
'set rbcols 49 48 46 44 43 42 41 0 61 62 63 65 67 68 69'
'd smth9(advdif*1000000000000)'
'set gxout contour'
'set cint 50'
'set ccolor 1'
'd hgtprs(lev=500)'
'run cbarn'
'set grads off'

maskout=1500
'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(hgtsfc,hgtsfc-'maskout')'

* titulos
'draw title 'fecha' \ Adv diferencial de vorticidad (somb, 1e12) capa 900-500 mb'
'printim /home/marcos/Documentos/METEOROLOGIA/GRADS/PRONOSTICO/imagenes/adv_vort_'time'.png png white'
'clear'

