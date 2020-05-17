********************************************************************
*Script que grafica Hr y movimientos verticales 700hpa
*v1.1 Github: huayratoro, reversionado por SudestadaARG
********************************************************************
*Se aclara que las variables que se usan w wind,rh, hgt,q (deben estar incluidas en el ctl)
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
maskout=3000
*este seteado es ARG
'set lat -80 -20'
'set lon -90 -50'
'set mpdset hires'
'set poli on'
'set map 79 1 5'


'set ylpos 0 l'
'set xlint 5'
'set ylint 5'
'set xlopts 1 4 0.12'
'set ylopts 1 4 0.12'
'set clopts -1 4 0.09'

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
say 'DEFINIENDO LAS VARIABLES NIVEL 700'
'define terreno=hgtsfc(lev=1000)'
'define hr=rhprs(lev=700)'
'define asc=vvelprs(lev=700)'
***---***
'set grads off'
'run jaecol.gs'

* HR
'set gxout shaded'
'set clevs  30 50 70 80 90 '
'set rbcols 0 13 5 11 4'
'd smth9(hr)'
'run cbarn.gs'

* Ascensos
'set clopts -1 4 0.09'
'set ccolor 2'
'set gxout contour'
'set clevs -9 -7 -5 -3 -2.5 -2 -1.5 -1 -0.9 -0.8 -0.7 -0.6 -0.5'
'set clab on'
'set clab masked'
'set cthick 4'
'd smth9(asc)'

* Descensos
'set ccolor 1'
'set gxout contour'
'set clevs  0.5 0.6 0.7 0.8 0.9 1 1.5 2 2.5 3 5 7 9'
'set clab on'
'set cthick 4'
'd smth9(asc)'

* Terreno
'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'

'draw title 'fecha' \ 700mb: HR(%,somb), ascensos(rojo), descensos(negro)'
'printim 'path'/hr_700'time'.png png white'
'c'
say '************'
time=time+deltat
endwhile

