********************************************************************
*Script que grafica la divergencia media entre 900 y 500 hpa
*v1.0.1 Github: SudestadaARG
*Falta pulir los graficos en cuanto a las barras de colores deseadas
********************************************************************
*Se aclara que las variables que se usan es Temperature potencial equivalente  (deben estar incluidas en el ctl), q, rh, temperatura, u v wind
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
'set t 'tiempo

'set lev 900 500'
*DEFINIENDO LAS VARIABLES
say 'DEFINIENDO Divergencia'
'define u=smth9(UGRDprs)'
'define v=smth9(VGRDprs)'
'define divergencia=hdivg(u,v)'
'set z 1'
'divergenciam=mean(divergencia,z=5,z=13)'


* Graficado
'run jaecol.gs'
'set grads off'

*Divergencia
'set gxout shaded'
'set clevs -3 -2 -1 -0.5 -0.25 0.25 0.5 1 2 3'
'set rbcols 49 47 45 43 42 0 22 23 25 27 29'
'd maskout(divergenciam*1e5,1000-HGTsfc)'
'run cbarn.gs'

*ploteo la presion o el geo potencial
'set gxout contour'
'set cint 4'
'd PRMSLmsl/100'
*'d HGTprs'

'draw title Divergencia media*1e-5 (somb) SLP (cont)'
*Guardamos la fecha en una variable (para usarla en el nombre de la figura).

'q time'
line1=sublin(result,1)
itime1=subwrd(line1,3)
fecha=substr(itime1,1,12)

'printim 'path'/divergencia_media_'fecha'.png png'
'c'










