'reset'
'set lat -75 -5'
'set lon -160 20'
'set mpdset hires'
'pi=3.14159'
'dtr=pi/180'
'a=6.37122e6'
'omega=7.2921e-5'
'g=9.8'
'R=287'
'define f=2*omega*sin(lat*dtr)'
'dy=cdiff(lat,y)*dtr*a'
'dx=cdiff(lon,x)*dtr*a*cos(lat*dtr)'
time = 1
maskout=1500
'run jaecol.gs'
'set poli on'
while(time<121)
'set t 'time
***---***
*Para la fecha correspondiente
'q time'
line1=sublin(result,1)
itime1=subwrd(line1,3)
fecha=substr(itime1,1,12)
***---***
*DEFINIENDO LAS VARIABLES
say 'DEFINIENDO LAS VARIABLES ESPESOR 700/300'
'define terreno=hgtsfc(lev=1000)'
'define hgt7=hgtprs(lev=700)'
'define hgt3=hgtprs(lev=300)'
'dhgt7x=cdiff(hgt7,x)'
'dhgt7y=cdiff(hgt7,y)'
'dhgt3x=cdiff(hgt3,x)'
'dhgt3y=cdiff(hgt3,y)'
'define espesor=hgt3-hgt7'
***---***

*viento geostrofico en 700
'define ug700=-1*(g/f)*(dhgt7y/dy)'
'define vg700=(g/f)*(dhgt7x/dx)'
*viento geostrofico en 300
'define ug300=-1*(g/f)*(dhgt3y/dy)'
'define vg300=(g/f)*(dhgt3x/dx)'
*viento termico medio en la capa 700-300
'define ut=(ug300-ug700)*1.94'
'define vt=(vg300-vg700)*1.94'
say 'Graficando'
'set gxout shaded'
'set csmooth on'
'set clevs -5 -4 -3 -2.5 -2 -1.5 -1 1 1.5 2 2.5 3 4 5'
'set rbcols 49 47 46 44 43 42 41 0 21 22 23 24 25 26 29'
'd smth9(hdivg(ut,vt))*100000'
'run cbarn'
'set gxout contour'
'set ccolor 1'
'set clevs 5700 5750 5800 5850 5900 5950 6000 6050 6100 6150 6200 6250 6300 6350 6400' 
'd smth9(espesor)'

'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'
* titulos
'draw title 'fecha' \ Espesor 700/300mb [somb, mgp] y conv vto termico medio capa [1e-5]'
'printim /home/marcos/Documentos/METEOROLOGIA/GRADS/PRONOSTICO/imagenes/SYNOP/espesor_700300_'time'.png png white'
'c'
say '************'
time=time+6
endwhile
