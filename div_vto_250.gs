********************************************************************
*Script que grafica q y vto a 900hpa
*v1.1 Github: huayratoro, reversionado por SudestadaARG
********************************************************************
*Se aclara que las variables que se usan es u v wind, hgt (deben estar incluidas en el ctl)
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

'set parea 0.5 10.0 0.5 7.5'

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
say 'DEFINIENDO LAS VARIABLES DIV VTO 250'
'define u=ugrdprs(lev=250)*1.94'
'define v=vgrdprs(lev=250)*1.94'
'define terreno=hgtsfc(lev=1000)'

***---***
*GRAFICADO
'set grads off'
'run jaecol.gs'

*Divergencia viento 250hpa
'set gxout shaded'
'set clevs -9 -8 -7 -6 -5 -4 -3 -2 -1 1 2 3 4 5 6 7 8 9'
'set rbcols 59 58 57 56 55 54 53 52 51 0 21 22 23 24 25 26 27 28 29'
'd smth9(hdivg(u,v))*100000'
'run cbarn.gs'
*Magnitud viento maximo
'set gxout contour'
'set clevs 100 120 140 160 180 200'
'set cthick 9'
'set ccolor 2'
'd mag(u,v)'
*lineas de corientes del viento en 250hpa
'set gxout stream'
'set cthick 1'
'set ccolor 1'
'set strmden 1'
'd u;v'
* terreno
'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'

* titulos
'draw title 'fecha' \alt. Divergencia [250mb,somb] y magnitud viento (cont, kts)'
'printim 'path'/vto_div'time'_250.png png white'
'clear'
say '************'
time=time+deltat
endwhile
