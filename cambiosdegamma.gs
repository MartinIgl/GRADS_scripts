********************************************************************
*Script que grafica la variacion local del gradiente vertical de T y los terminos de adv dif de T, conv/div y adv vertical de gama
*v1.0.1 Github: SudestadaARG
*Se puede mejorar las paletas de colores y las visualizaciones
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

*defino variables constantes
'define pi=3.14159'
'define r=6371000'

*este seteado es ARG
'set lat -80 -20'
'set lon -90 -50'
'set mpdset hres'
'set poli on'

**********************************************
***** Termino1: Tendencia de gama 
**********************************************
*Indico el tiempo que quiero .
prompt 'Indique el tiempo a graficar: '
pull tiempo


* De aca en mas no es necesario cambiar nada mas

'set z 1'
'set t 'tiempo-1' 'tiempo+1
*Calculamos la adveccion en todos los niveles entre 900 y 500.
'define t900=smth9(tmpprs(lev=900))'
'define t500=smth9(tmpprs(lev=500))'
'define espesor=hgtprs(lev=500)-hgtprs(lev=900)'
'define gamma=-maskout((t500-t900)/espesor,1000-hgtsfc)'

'set t 'tiempo

*El cambio del gamma esta en K/(km*dia)
'define termino1=4*1000*(gamma(t=3)-gamma(t=1))'

**********************************************
***** Termino2: Adveccion diferencial de T 
**********************************************
'set lev 900 500'
'set t 'tiempo

'define us=smth9(ugrdprs)'
'define vs=smth9(vgrdprs)'

'define divergencia=hdivg(us,vs)'

'define dhx=cdiff(tmpprs,x)'
'define dhy=cdiff(tmpprs,y)'
'define dx=cdiff(lon,x)*pi*r/180.'
'define dy=cdiff(lat,y)*pi*r/180.'
'define ut=(-1)*us*dhx/(dx*cos(lat*pi/180))'
'define vt=(-1)*vs*dhy/dy'
'define adveccion=(ut+vt)*86400'

'set lev 900'
'define termino2=1000*(adveccion(lev=500)-adveccion(lev=900))/espesor'

**********************************************
***** Termino3: Termino asociado a las conv/div 
**********************************************
'set t 'tiempo-1' 'tiempo+1

'define divmedia=(divergencia(lev=900)+divergencia(lev=500))/2'
'define dwdz=-86400*divmedia'
'set lev 900'
'define termino3=(9.8-1000*gamma)*dwdz'

************************************************
***** Termino4: Termino asociado a la adv vertical de gama 
* Este termino lo obtenemos haciendo termino1-termino2-termino3
* OJO! Esto supone que el termino diabatico es despreciable
*************************************************
'set lev 900'
'define termino4=termino1-termino2-termino3'

*********************************************
* Graficado
*********************************************
'run jaecol.gs'
'set grads off'

'set z 1'
'set t 'tiempo

*Termino1 Tendencia de gama
'set gxout shaded'
*'set clevs -30 -20 -10 -5 -2.5 2.5 5 10 20 30'
'set clevs -20 -10 -5 -2 -1 1 2 5 10 20'
'set rbcols 49 47 45 43 42 0 22 23 25 27 29'
'd termino1'
'run cbarn.gs'
*gamma
'set gxout contour'
'set cint 1'
'set cstyle 1'
'set cthick 6'
'd gamma*1000'

'q time'
line1=sublin(result,1)
itime1=subwrd(line1,3)
fecha=substr(itime1,1,12)

'draw title Tendencia de gama (somb) y gamma (cont), 'fecha
'printim 'path'/Tendgamma_'fecha'.png png'
'c'
******************************************
*Termino2 Adveccion diferencial de T 
'set gxout shaded'
'set clevs -20 -10 -5 -2 -1 1 2 5 10 20'
'set rbcols 49 47 45 43 42 0 22 23 25 27 29'
'd maskout(termino2,1000-hgtsfc)'
'run cbarn.gs'

*si se quiere saber los aportes de cada nivel se descomenta
*'set gxout contour'
*'set clevs -30 -20 -10 -5 -2.5'
*'set cstyle 2'
*'set ccolor 1'
*'d maskout(advtarriba,1000-hgtsfc)'
*'set clevs  2.5 5 10 20 30'
*'set ccolor 1'
*'set cstyle 1'
*'d maskout(advtabajo,1000-hgtsfc)'

'draw title Adveccion diferencial de T (somb), 'fecha
'printim 'path'/AdvdifT _'fecha'.png png'
'c'
******************************************
** Termino3: Termino asociado a las conv/div 

'set clevs -20 -10 -5 -2 -1 1 2 5 10 20'
'set rbcols 49 47 45 43 42 0 22 23 25 27 29'
'd maskout(termino3,1000-hgtsfc)'
'run cbarn.gs'

'draw title Termino asociado a las conv/div (cont), 'fecha
'printim 'path'/Convgamma_'fecha'.png png'
'c'
******************************************
* Termino4: Termino asociado a la adv vertical de gama 
'set gxout shaded'
'set clevs -20 -10 -5 -2 -1 1 2 5 10 20'
'set rbcols 49 47 45 43 42 0 22 23 25 27 29'
'd maskout(termino4,1000-hgtsfc)'
'run cbarn.gs'

'draw title Termino asociado a la adv vertical de gama (somb), 'fecha
'printim  'path'/AdvVertgamma_'fecha'.png png'








