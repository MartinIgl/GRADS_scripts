'reset'
'set lat -75 -5'
'set lon -160 20'
'set mpdset hires'
'run jaecol.gs'
'set grads off'
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
say 'DEFINIENDO LAS VARIABLES ESPESOR 1000/500'
'define terreno=hgtsfc(lev=1000)'
'define z5=hgtprs(lev=500)'
'define z1=hgtprs(lev=1000)'
'define p=prmslmsl(lev=1000)/100'
'define u=ugrdprs(lev=1000)'
'define v=vgrdprs(lev=1000)'
***---***
'define espesor=z5-z1'
'set gxout shaded'
'set csmooth on'
'set clevs 5000 5050 5100 5150 5200 5250 5300 5350 5400 5450 5500 5550 5600 5650 5700 5750 5800 5850'
'set rbcols 59 58 57 49 47 45 43 42 41 21 22 23 24 25 26 27 28 29'
'd espesor'
'run cbarn'

*campo de presion

'set gxout contour'
'set cthick 7'
'set clab on'
'set clskip 2'
'set cint 3'
'set ccolor 1'
'd p'

*para las isohipsas

'set clskip 1'
'set cthick 10'
'set cmax 5200'
'set cmin 5200'
'set ccolor 6'
'd espesor'
'set cmax 5700'
'set cmin 5700'
'set ccolor 7'
'd espesor'

'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'

* titulos
'draw title 'fecha' \ Espesor 1000/500 (somb,mgp), prnm(MB)'
'printim /home/marcos/Documentos/METEOROLOGIA/GRADS/PRONOSTICO/imagenes/SYNOP/espesor_1000_500_'time'.png png white'
'clear'
say '************'
time=time+6
endwhile
