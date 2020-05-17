********************************************************************
*Script que grafica el perfil vertical del CAPE de la parcela promediando el dominio de estudio.
*Esta pensado para ejemplos teoricos, falta modifcarlo para casos reales
*v1.0 Github:SudestadaARG
********************************************************************
*Se aclara que las variables que se usan es Temperature como Tk, Water vapor mixing ratio como w=qvapor (deben estar incluidas en el ctl
*Si se tiene las variables rh o q se puede encontrar
*para mas informacion https://www.e-education.psu.edu/meteo300/node/519

'reinit'
'reset'
'set display color white'
'c'
'set vpage off'
'set parea off'

*Defino nombres y la ruta del archivo

prompt 'Defina el nombre del grafico: '
pull nombre_grafico
prompt 'Defina el tiempo que quiere graficar: '
pull TIEMPO
prompt 'Indique el nombre del Archivo ctl (si no esta en la misma carpeta pongalo con la ruta): '
pull CTL


*********************************************************************
*Abro el archivo
'open 'CTL
*estos valores debe cambiarlos si quiere achicar el dominio
'set x 1 121'
'set y 1 121'
'set z 1 27'
'set t 'TIEMPO
*Defino temperatura virtual
'tvir=tk*(1+(0.607717042*qvapor))'
*Defino temperatura media en el dominio
'tm=aave(tvir,x=1,x=121,y=1,y=121)'
*Defino temperatura del entorno, es igual a tm
'tent=aave(tvir,x=1,x=121,y=1,y=121)'


*defino un punto para hacer el perfil vertical, seteo x y variando z
'set x 60 '
'set y 60'
'set grads off '
'set mpdset hires '

*defino la diferencia entre la temperatura virtual y la media del entorno
'tprima=(tvir-tm)'
*defino el CAPE promedio para todos los niveles
'CAPEPar=(287*(tprima/tent))*(1*750)'
*grafico el cape
'set grads off'
'd CAPEPar' 

*Nombro los ejes y titulo
'draw title CAPE (Por Metodo de la Parcela)'
'draw xlab CAPE(J/Kg)'  
'draw ylab Altura (km)'  


*Guardo la imagen
'printim 'nombre_grafico'_tiempo='TIEMPO'.png png white'



