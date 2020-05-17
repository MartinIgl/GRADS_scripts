********************************************************************
*Script que grafica la adveccion diferencial de temperatura
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
*Defino la ruta de guardado
prompt 'Indique la ruta donde quiere guardar(si quiere guardarlo en la carpeta donde abrio la terminal (enter): '
pull path

*Abro el archivo
'open 'CTL


*defino variables constantes
'define pi=3.14159'
'define r=6371000'
maskout=1500

*si se quiere definir el area de printeo
*xlow=0.2
*xhigh=10.5
*ylow=0.8
*yhigh=7.0
*'set parea 'xlow' 'xhigh' 'ylow' 'yhigh


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
iline1=sublin(result,1)
itime1=subwrd(line1,3)
fecha=substr(itime1,1,12)
***---***
*DEFINIENDO LAS VARIABLES
say 'DEFINIENDO LAS VARIABLES ADIF DE TMP'
'define terreno=hgtsfc(lev=1000)'
'define temp500=tmpprs(lev=500)'
'define temp600=tmpprs(lev=600)'
'define temp700=tmpprs(lev=700)'
'define temp800=tmpprs(lev=800)'
'define temp900=tmpprs(lev=900)'
'define dy=r*2*pi*cdiff(lat,y)/360'
'define dx=r*2*pi*cdiff(lon,x)*cos(lat*2*pi/360)/360'
'define u500=ugrdprs(lev=500)'
'define v500=vgrdprs(lev=500)'
'define u600=ugrdprs(lev=600)'
'define v600=vgrdprs(lev=600)'
'define u700=ugrdprs(lev=700)'
'define v700=vgrdprs(lev=700)'
'define u800=ugrdprs(lev=800)'
'define v800=vgrdprs(lev=800)'
'define u900=ugrdprs(lev=900)'
'define v900=vgrdprs(lev=900)'
'define z5=hgtprs(lev=500)'
'define z4=hgtprs(lev=600)'
'define z3=hgtprs(lev=700)'
'define z2=hgtprs(lev=800)'
'define z1=hgtprs(lev=900)'


***** Adveccion hor para 500 hPa

'define dtx=cdiff(temp500,x)/dx'
'define dty=cdiff(temp500,y)/dy'
'define at5=-u500*dtx-v500*dty'
***** Adveccion hor para 600 hPa

'define dtx=cdiff(temp600,x)/dx'
'define dty=cdiff(temp600,y)/dy'
'define at4=-u600*dtx-v600*dty'
***** Adveccion hor para 700 hPa

'define dtx=cdiff(temp700,x)/dx'
'define dty=cdiff(temp700,y)/dy'
'define at3=-u700*dtx-v700*dty'
***** Adveccion hor para 800 hPa

'define dtx=cdiff(temp800,x)/dx'
'define dty=cdiff(temp800,y)/dy'
'define at2=-u800*dtx-v800*dty'
***** Adveccion hor para 900 hPa

'define dtx=cdiff(temp900,x)/dx'
'define dty=cdiff(temp900,y)/dy'
'define at1=-u900*dtx-v900*dty'

'define advdif=-((at5-at4)/(z5-z4)+(at4-at3)/(z4-z3)+(at3-at2)/(z3-z2)+(at2-at1)/(z2-z1))'

say 'variables definidas'

*GRAFICADO
'run jaecol.gs'
'set grads off'

*Se grafica la adveccion diferencial entre 900 y 500 hpa

'set gxout shaded'
'set clevs -10 -8 -6  -4  -3 -2.5 -2 -1.5 -1 0  1.5 2 2.5 3 4  6 8 10'
'set rbcols 48 47 46 45 44 43 42 41 0 0 21 22 23 24 25 26 27 28'
'd smth9(advdif*10000000)'
'run cbarn.gs'

*geopotencial en 500hpa
'set gxout contour'
'set cint 30'
'd z5'
'set grads off'

* Sombreo en gris la zona enmascarada
'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'

* titulos
'draw title 'fecha' \ Adveccion dif temperatura 500/900 (somb) y HGP (500mb,cont)'
'printim 'path'/ADT_'time'_'lev'.png png white'
'clear'
say '************'
time=time+deltat
endwhile
