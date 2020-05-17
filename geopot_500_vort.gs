********************************************************************
*Script que grafica geopot y vort a 500hpa
*v1.1 Github: huayratoro, reversionado por SudestadaARG
********************************************************************
*Se aclara que las variables que se usan es Temperature, u v wind, hgt (deben estar incluidas en el ctl)
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
say 'DEFINIENDO LAS VARIABLES GEOPOT 500'
'define terreno=hgtsfc(lev=1000)'
'define u=ugrdprs(lev=500)'
'define v=vgrdprs(lev=500)'
'define z=hgtprs(lev=500)'
'define tmp=tmpprs(lev=500)-273.15'
'define vor=hcurl(u,v)*100000'
***---***
*GRAFICO
'run jaecol.gs'
'set grads off'

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
'printim 'path'/geop_500_'time'_'lev'.png png white'
'clear'
say '************'
time=time+deltat
endwhile
