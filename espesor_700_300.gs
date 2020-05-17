********************************************************************
*Script que grafica viento termico medio y espesor  700/300 hpa
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
'pi=3.14159'
'dtr=pi/180'
'a=6.37122e6'
'omega=7.2921e-5'
'g=9.8'
'R=287'
'define f=2*omega*sin(lat*dtr)'
'dy=cdiff(lat,y)*dtr*a'
'dx=cdiff(lon,x)*dtr*a*cos(lat*dtr)'


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
say 'DEFINIENDO LAS VARIABLES ESPESOR 700/300'
'define terreno=hgtsfc(lev=1000)'
'define hgt7=hgtprs(lev=700)'
'define hgt3=hgtprs(lev=300)'
'dhgt7x=cdiff(hgt7,x)'
'dhgt7y=cdiff(hgt7,y)'
'dhgt3x=cdiff(hgt3,x)'
'dhgt3y=cdiff(hgt3,y)'
'define espesor=hgt3-hgt7'
***---***

*viento geostrofico en 700
'define ug700=-1*(g/f)*(dhgt7y/dy)'
'define vg700=(g/f)*(dhgt7x/dx)'
*viento geostrofico en 300
'define ug300=-1*(g/f)*(dhgt3y/dy)'
'define vg300=(g/f)*(dhgt3x/dx)'
*viento termico medio en la capa 700-300
'define ut=(ug300-ug700)*1.94'
'define vt=(vg300-vg700)*1.94'

*Graficando'
'run jaecol.gs'
*divergencia
'set gxout shaded'
'set csmooth on'
'set clevs -5 -4 -3 -2.5 -2 -1.5 -1 1 1.5 2 2.5 3 4 5'
'set rbcols 49 47 46 44 43 42 41 0 21 22 23 24 25 26 29'
'd smth9(hdivg(ut,vt))*100000'
'run cbarn'
*ESPESOR
'set gxout contour'
'set ccolor 1'
'set clevs 5700 5750 5800 5850 5900 5950 6000 6050 6100 6150 6200 6250 6300 6350 6400' 
'd smth9(espesor)'
*Mascara
'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'

* titulos
'draw title 'fecha' \ Espesor 700/300mb [somb, mgp] y conv vto termico medio capa [1e-5]'
'printim 'path'/espesor_700300_'time'.png png white'
'c'
say '************'
time=time+deltat
endwhile
