'reset'
'set lat -65 -5'
'set lon -160 20'
'set mpdset hires'
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
say 'DEFINIENDO LAS VARIABLES GEOPOT 500'
'define terreno=hgtsfc(lev=1000)'
'define u=ugrdprs(lev=500)'
'define v=vgrdprs(lev=500)'
'define z=hgtprs(lev=500)'
'define tmp=tmpprs(lev=500)-273.15'
'define vor=hcurl(u,v)*100000'
***---***

*Vorticidad
'set gxout shaded'
'set clevs -14 -12 -10 -8 -6 -4 -2 0 2 4 6 8 10'
'set rbcols 49 48 47 46 45 43 41 0 0 61 63 65 66 68'
'set grads off'
'd smth9(vor)'
'run cbarn ' 
'set gxout contour'
'set clevs -14 -12 -10 -8 -6 -4 -2 0 2 4 6 8 10'
'set ccolor 0'
'set clab off'
'd smth9(vor)'
*Geopotencial
'set gxout contour'
'set cint 50'
'set ccolor 1'
'set clab on' 
'set clskip 3' 
'd z'
*Temperatura
'set ccolor 6'
'set cint 5'
'set cthick 6'
'd tmp'
*Terreno
'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'
* titulos
'draw title 'fecha' \ alt. geo, vort.(som) y T (C) en 500 hPa'
'printim /home/marcos/Documentos/METEOROLOGIA/GRADS/PRONOSTICO/imagenes/SYNOP/geop_500_'time'_'lev'.png png white'
'clear'
say '************'
time=time+6
endwhile
