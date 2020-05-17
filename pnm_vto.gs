********************************************************************
*Script que grafica espesor presion nivel del mar y viento en sup
*v1.1 Github: huayratoro, reversionado por SudestadaARG
********************************************************************
*Se aclara que las variables que se usan deben estar incluidas en el ctl
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
say 'DEFINIENDO LAS VARIABLES PRNM'
'define terreno=hgtsfc(lev=1000)'
'define u=ugrdprs(lev=1000)*1.94'
'define v=vgrdprs(lev=1000)*1.94'
'define p=prmslmsl/100'
***---***
*GRAFICADO
'set grads off'
'run jaecol.gs'

*viento en 1000hpa
'set gxout shaded'
'set csmooth on'
'set clevs 10 15 20 25 30 40 50'
'set rbcols 0 21 23 25 26 28 29 0'
'd mag(u,v)'
'run cbarn.gs'
*Presion
'set gxout contour'
'set cint 3'
'd p'
*Terreno
'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'

* titulos
'draw title 'fecha' \ Presion y viento [mag;knots] en superficie'
'printim 'path'/pressnm_'time'_'lev'.png png white'
'clear'
say '************'
time=time+deltat
endwhile

