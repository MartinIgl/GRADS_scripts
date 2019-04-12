'reset'
'set lat -75 -10'
'set lon -160 20'
'set mpdset hires'
'set map 79 1 5'
'set ylpos 0 l'
'set xlint 5'
'set ylint 5'
'set xlopts 1 4 0.12'
'set ylopts 1 4 0.12'
'set grads off'
'set clopts -1 4 0.09'
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
say 'DEFINIENDO LAS VARIABLES PRNM'
'define terreno=hgtsfc(lev=1000)'
'define u=ugrdprs(lev=1000)*1.94'
'define v=vgrdprs(lev=1000)*1.94'
'define p=prmslmsl/100'
***---***
'set grads off'

'set gxout shaded'
'set csmooth on'
'set clevs 10 15 20 25 30 40 50'
'set rbcols 0 21 23 25 26 28 29 0'
'd mag(u,v)'
'run cbarn.gs'
'set gxout contour'
'set cint 3'
'd p'

'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'
* titulos
'draw title 'fecha' \ Presion y viento [mag;knots] en superficie'
'printim /home/marcos/Documentos/METEOROLOGIA/GRADS/PRONOSTICO/imagenes/SYNOP/pressnm_'time'_'lev'.png png white'
'clear'
say '************'
time=time+6
endwhile

