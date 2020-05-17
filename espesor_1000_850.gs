********************************************************************
*Script que grafica espesor 1000/850hpa
*v1.1 Github: huayratoro, reversionado por SudestadaARG
********************************************************************
*Se aclara que las variables que se usan es Temperature, u v wind,rh, hgt,q (deben estar incluidas en el ctl)
*aclaracion, el jaecol y cbarn deben estar en la misma carpeta del .dat o .idx, en caso de que no se corra bien puede quitar el .gs

'reinit'
'reset'
'set display color white'
'c'
*Defino la ruta del archivo
prompt 'Indique el nombre del Archivo ctl (si no esta en la misma carpeta pongalo con la ruta): '
pull CTL

*Abro el archivo
'open 'CTL
*Defino la ruta de guardado
prompt 'Indique la ruta donde quiere guardar(si quiere guardarlo en la carpeta donde abrio la terminal (enter): '
pull path


*defino variables previamente
maskout=1500
*este seteado es ARG
'set lat -80 -20'
'set lon -90 -50'
'set mpdset hires'
'set poli on'


*La cantidad de tiempos depende de cuantos archivos cada 6h tengas, se puede modificar.
*prompt 'Indique la cantidad de FCST o analisis: '
*pull timefin
*prompt 'Indique el delta de tiempo entre FCST o analsis: '
*pull deltat

deltat=6
timefin=12
time=1

while(time<timefin)
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
*GRAFICADO
'set grads off'
'run jaecol.gs'
*Espesor
'define espesor=z8-z1'
'set gxout shaded'
'set csmooth on'
'set clevs 1140 1170 1200 1215 1230 1245 1260 1275 1290 1305 1320 1335 1350 1380 1410 1440 1470 1500'
'set rbcols 59 58 57 49 47 45 43 42 41 21 22 23 24 25 26 27 28 29'
'd espesor'
'run cbarn.gs'

*campo de presion en superficie
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
'printim 'path'/espesor_1000_850_'time'.png png white'
'clear'
say '************'
time=time+deltat
endwhile
