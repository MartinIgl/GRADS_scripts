********************************************************************
*Script que grafica la adveccion diferencial de vorticidad
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
*Defino la ruta de guardado
prompt 'Indique la ruta donde quiere guardar(si quiere guardarlo en la carpeta donde abrio la terminal (enter): '
pull path


*defino variables previamente
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
'define vort=hcurl(ugrdprs(lev=500),vgrdprs(lev=500))'
'define dy=r*2*pi*cdiff(lat,y)/360'
'define dx=r*2*pi*cdiff(lon,x)*cos(lat*2*pi/360)/360'
'define dtx=cdiff(vort,x)/dx'
'define dty=cdiff(vort,y)/dy'
'define av5=-ugrd10m*dtx-vgrd10m*dty'
***---***
******* para Adveccion hor para 900 hPa
'set lev 900'
'define vortd=hcurl(ugrdprs,vgrdprs)'
'define dy=r*2*pi*cdiff(lat,y)/360'
'define dx=r*2*pi*cdiff(lon,x)*cos(lat*2*pi/360)/360'
'define dtx=cdiff(vortd,x)/dx'
'define dty=cdiff(vortd,y)/dy'
'define av9=-ugrd10m*dtx-vgrd10m*dty'

'define advdif=-((av5-av9)/(hgtprs(lev=500)-hgtprs(lev=900)))'

say 'variables definidas'

*GRAFICADO
'run jaecol.gs'

*Se grafica la adveccion diferencial entre 900 y 500 hpa
'set gxout shaded'
'set clevs -12 -8 -6 -4 -3 -2 -1  0  1 2 3 4 6 8 12'
'set rbcols 49 48 46 44 43 42 41 0 61 62 63 65 67 68 69'
'd smth9(advdif*1000000000000)'
*geopotencial en 500hpa
'set gxout contour'
'set cint 50'
'set ccolor 1'
'd hgtprs(lev=500)'
'run cbarn.gs'
'set grads off'

*Sombreo en gris la zona enmascarada
'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(hgtsfc,hgtsfc-'maskout')'

* titulos
'draw title 'fecha' \ Adv diferencial de vorticidad (somb, 1e12) capa 900-500 mb'
'printim 'path'/adv_vort_'time'.png png white'
'clear'

