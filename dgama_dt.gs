********************************************************************
*Script que grafica la variacion media del gradiente de temperatura
*v1.0.1 Github: SudestadaARG
*Falta pulir los graficos en cuanto a las barras de colores deseadas y si se quiere hacer para varios tiempos pensar un while para mover los t con un delta
********************************************************************
*Se aclara que las variables que se usan es temperatura, u v wind ,HGT (deben estar incluidas en el ctl).
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

*este seteado es ARG
'set lat -80 -20'
'set lon -90 -50'
'set mpdset hres'
'set poli on'

*Indico el tiempo que quiero .
prompt 'Indique el tiempo a graficar: '
pull tiempo


'set z 1'
'set t 'tiempo-1' 'tiempo+1
*Calculamos la adveccion en todos los niveles entre 900 y 500.
't900=smth9(TMPprs(lev=900))'
't500=smth9(TMPprs(lev=500))'
'espesor=HGTprs(lev=500)-HGTprs(lev=900)'
'define gamma=-maskout((t500-t900)/espesor,1000-HGTsfc)'

'set t 'tiempo

*El cambio del gamma esta en K/(km*dia)
'dgammadt=4*1000*(gamma(t=2)-gamma(t=1))'

'set z 1'


*Graficamos los resultados.
*variacion de gamma con el tiempo
'run jaecol.gs'
'set gxout shaded'
'set clevs -3.5 -2 -1 -0.5 -0.25 0.25 0.5 1 2 3.5'
'set rbcols 49 47 45 43 42 0 22 23 25 27 29'
'd dgammadt'
'run cbarn'

*Gamma
'set gxout contour'
'set cint 1'
'set cstyle 1'
'set cthick 6'
'd gamma*1000'


'draw title dgamma/dt (somb) (K/(km*dia)), gamma (cont) (K/km)'

*Guardamos la fecha en una variable (para usarla en el nombre de la figura).
'q time'
line1=sublin(result,1)
itime1=subwrd(line1,3)
fecha=substr(itime1,1,12)

'printim 'path'/dgamma_dt_'fecha'.png png'










