'reset'
time = 1
maskout=1500
'set lat -65 -5'
'set lon 250 330'
'set grads off'
'run jaecol.gs'
'set parea 0.5 10.0 0.5 7.5'
'set mpdset hires'
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
say 'DEFINIENDO LAS VARIABLES DIV VTO 250'
'define u=ugrdprs(lev=250)*1.94'
'define v=vgrdprs(lev=250)*1.94'
'define terreno=hgtsfc(lev=1000)'
***---***

'set gxout shaded'
'set clevs -9 -8 -7 -6 -5 -4 -3 -2 -1 1 2 3 4 5 6 7 8 9'
'set rbcols 59 58 57 56 55 54 53 52 51 0 21 22 23 24 25 26 27 28 29'
'd smth9(hdivg(u,v))*100000'
'run cbarn.gs'

'set gxout contour'
'set clevs 100 120 140 160 180 200'
'set cthick 9'
'set ccolor 2'
'd mag(u,v)'

'set gxout stream'
'set cthick 1'
'set ccolor 1'
'set strmden 1'
'd u;v'

'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'

* titulos
'draw title 'fecha' \alt. Divergencia [250mb,somb] y magnitud viento (cont, kts)'
'printim /home/marcos/Documentos/METEOROLOGIA/GRADS/PRONOSTICO/imagenes/SYNOP/w_div'time'_250.png png white'
'clear'
say '************'
time=time+6
endwhile
