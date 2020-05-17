********************************************************************
*Script que grafica cortante de viento entr nivel superior e inferior
*v1.1 Github: SudestadaARG
********************************************************************
*Se aclara que las variables que se usan es  u v wind (deben estar incluidas en el ctl)
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


*Indico el tiempo que quiero .
prompt 'Indique el tiempo a graficar: '
pull tiempo
'set t 'tiempo

*Defino el nivel 
prompt 'Indique nivel superior e inferior  en hpa: '
pull ninf nsup
if (ninf<nsup)
prompt 'El ninf tiene que ser mayor que el nsup (hpa),vuelvalo a indicar: '
pull ninf nsup
endif

*Calculo de cortante
***********************************
*este seteado es ARG
'set lat -80 -20'
'set lon -90 -50'
'set mpdset hres'
'set poli on'
'set t 'tiempo

*DEFINIENDO LA CORTANTE 
'define ucor=(ugrdprs(lev='nsup')-ugrdprs(lev='ninf'))'
'define vcor=(vgrdprs(lev='nsup')-vgrdprs(lev='ninf'))'
 
*Grafico
'run jaecol.gs'
'set grads off'

*mag de la cortante en nudos
'set gxout contour'
'set ccolor 2'
'set clevs 10 15 20 25 30 35 40 45 50'
'd mag(ucor,vcor)*1.94'

*vector cortante en nudos
'set gxout barb'
'set ccolor 3'
'set cthick 6'
'd skip(ucor*1.94,2);vcor*1.94'

*TITULO

'q time'
aux1=subwrd(result,3)
HH=substr(aux1,1,2)
DD=substr(aux1,4,2)
MM=substr(aux1,6,3)
YY=substr(aux1,9,4)
line1=sublin(result,1)
itime1=subwrd(line1,3)
fecha=substr(itime1,1,12)



'draw title Fecha:'YY' 'MM' 'DD' 'HH'\Cortante vertical de viento entre 'ninf'/'nsup' hPa’
'printim 'path'/cortanteverticaldeviento_'fecha'.png png'
'c'








