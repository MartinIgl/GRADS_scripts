'reset'
'set lat -60 -20'
'set lon -80 -50'
'set mpdset hires'
time = 2
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
say 'DEFINIENDO LAS VARIABLES LLUVIA'
'define terreno=hgtsfc(lev=1000)'
'define lluvia=apcpsfc(lev=1000)'
'define u=ugrdprs(lev=1000)*1.94'
'define v=vgrdprs(lev=1000)*1.94'
***---***
* PP
'set gxout shaded'
'set clevs 1 2.5 5 7.5 10 15 20 30 40 50 60 70 80 90 100 120'
'set rbcols 0 31 32 33 21 22 23 24 25 26 27 28 29 55 56 57 58 59'
'set rbrange 2 60'
'set grads off'
'd lluvia'
'run cbarn.gs'

* Viento
'set gxout vector'
'set ccolor 49'
'set arrscl 0.2 10'
'set arrowhead -.2'
'set digsize 0.07'
'set cthick 5'
'set arrowhead 0.1'
'set gxout barb'
'd skip(u,8);skip(v,8)'
'set strsiz 0.14'

* terreno
'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'

* titulos
'draw title 'fecha' \ Lluvia y viento (knt, azul) en superficie'
'printim /home/marcos/Documentos/METEOROLOGIA/GRADS/PRONOSTICO/imagenes/SYNOP/lluvia_tmp_'time'.png png white'
'clear'
say '************'
time=time+6
endwhile
