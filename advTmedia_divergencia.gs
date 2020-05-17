********************************************************************
*Script que grafica la divergencia y adveccion de tem media entre 900 y 500 hpa
*v1.1 Github: SudestadaARG
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


*defino variables constantes
'define pi=3.14159'
'define r=6371000'

*este seteado es ARG
'set lat -80 -20'
'set lon -90 -50'
'set mpdset hres'
'set poli on'


*Indico el tiempo que quiero .
prompt 'Indique el tiempo a graficar: '
pull tiempo
'set t 'tiempo

'set lev 900 500'
*DEFINIENDO LAS VARIABLES
'define us=smth9(UGRDprs)'
'define vs=smth9(VGRDprs)'
'define divergencia=hdivg(us,vs)'

'define dhx=cdiff(TMPprs,x)'
'define dhy=cdiff(TMPprs,y)'
'define dx=cdiff(lon,x)*pi*r/180.'
'define dy=cdiff(lat,y)*pi*r/180.'
*adveccion de temperatura
'define ut=(-1)*us*dhx/(dx*cos(lat*pi/180))'
'define vt=(-1)*vs*dhy/dy'

'define adveccion=(ut+vt)*86400'

*Calculamos la adveccion en todos los niveles entre 900 y 500.
'set z 1'
*Tomo un promedio de las capas para tener la adveccion de la capa
'advtabajo=(1/3)*(adveccion(lev=900)+adveccion(lev=850)+adveccion(lev=800))'
'advtarriba=(1/3)*(adveccion(lev=600)+adveccion(lev=650)+adveccion(lev=500))'

* Graficado
'run jaecol.gs'
'set grads off'

'set gxout shaded'
'set clevs -30 -20 -10 -5 -2.5 2.5 5 10 20 30'
'set rbcols 49 47 45 43 42 0 22 23 25 27 29'
'd maskout(advtabajo,1000-HGTsfc)'

'set gxout contour'
'set clevs -30 -20 -10 -5 -2.5'
'set cstyle 2'
'set ccolor 1'
'd maskout(advtarriba,1000-HGTsfc)'

'set clevs  2.5 5 10 20 30'
'set ccolor 1'
'set cstyle 1'
'd maskout(advtarriba,1000-HGTsfc)'

'run cbarn.gs'

'draw title Adveccion termica cercana a 900 hPa (sombreado) \ adveccion termica cercana a 500 hPa (contornos)'

*Guardamos la fecha en una variable (para usarla en el nombre de la figura).

'q time'
line1=sublin(result,1)
itime1=subwrd(line1,3)
fecha=substr(itime1,1,12)

'printim 'path'/adveccion_diferencial_t_'fecha'.png png'

*********************************************************
'c'
*Defino el nivel 
prompt 'Indique nivel en hpa para la divergencia: '
pull niv
'set lev 'niv

*Grafico la divergencia del viento
'define divergencia=hdivg(us(lev='niv'),vs(lev='niv'))*1000'

* Graficado
'run jaecol.gs'

'set gxout shaded'
'set clevs -30 -20 -10 -5 -2.5 2.5 5 10 20 30'
'set rbcols 49 47 45 43 42 0 22 23 25 27 29'
'd divergencia'

'set gxout contour'
'set ccolor 1'
'set cstyle 1'
'd maskout(advtarriba,1000-HGTsfc)'
'd HGTsfc(lev='niv')'

'draw title divergencia del vieto(*10^4) y geopotencial 'niv' Hpa'

*Guardamos la fecha en una variable (para usarla en el nombre de la figura).

'q time'
line1=sublin(result,1)
itime1=subwrd(line1,3)
fecha=substr(itime1,1,12)

'printim 'path'/adveccion_diferencial_t_'fecha'.png png'












