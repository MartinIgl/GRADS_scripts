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
say 'DEFINIENDO LAS VARIABLES ESPESOR 1000/850'
'define terreno=hgtsfc(lev=1000)'
'define z8=hgtprs(lev=850)'
'define z1=hgtprs(lev=1000)'
'define p=prmslmsl(lev=1000)/100'
'define u=ugrdprs(lev=1000)'
'define v=vgrdprs(lev=1000)'
***---***
'define espesor=z8-z1'
'set gxout shaded'
'set csmooth on'
'set clevs 1140 1170 1200 1215 1230 1245 1260 1275 1290 1305 1320 1335 1350 1380 1410 1440 1470 1500'
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
'set cmax 1290'
'set cmin 1290'
'set ccolor 6'
'd espesor'
*'set cmax 5700'
*'set cmin 5700'
*'set ccolor 7'
*'d espesor'

'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'

* titulos
'draw title 'fecha' \ Espesor 1000/850 (somb,mgp), prnm(MB)'
'printim /home/marcos/Documentos/METEOROLOGIA/GRADS/PRONOSTICO/imagenes/SYNOP/espesor_1000_850_'time'.png png white'
'clear'
say '************'
time=time+6
endwhile
