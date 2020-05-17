********************************************************************
*Script que grafica la adveccion diferencial de temperatura pot equiv
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

*Defino el nivel 
prompt 'Indique nivel en hpa: '
pull niv
'set lev 'niv

*DEFINIENDO LAS VARIABLES
say 'DEFINIENDO LAS VARIABLES TEMP POT EQIV'
'define rh=rhprs(lev='niv')'
'define tmp=tmpprs(lev='niv')'
'define et=(-2937.4/(tmp))-(4.9283*log10(tmp))+22.5518'
'define es=pow(10,et)*10'
'define e=es*0.01*rh'
'define q=0.622*e/('niv'-e)'
'define aux=3.5 *log(tmp)-log(e)-4.805'
'define tl=2840./aux + 55.'
'define aux=3.376/tl - 0.00254'
'define aux1=q*1000*(1.+0.81*q)'
'define aux2=0.2854*(1.-0.28*q)'
'define aux3=(1000/850)'
'define te=((tmp)*pow(aux3,aux2)*exp(aux*aux1))'

*Calculamos el modulo del gradiente de la TPE.
'te = smth9(smth9(smth9(te)))'
'define dy=r*2*pi*cdiff(lat,y)/360'
'define dx=r*2*pi*cdiff(lon,x)*cos(lat*2*pi/360)/360'
'define dtex=cdiff(te,x)/dx'
'define dtey=cdiff(te,y)/dy'

'gradte=mag(dtex,dtey)'

* Graficado
'run jaecol.gs'
*Los contornos de temp pot equiv
'auxiliar=te-te+1'
'd maskout(auxiliar,1.5e-5-gradte)'
'set gxout contour'
'd te'

*Se grafica las vectores de viento en el nivel deseado
'set gxout vector'
'set ccolor 1'
'd skip(UGRDprs(lev='niv'),6);VGRDprs(lev='niv')'


*guardo el grafico compuesto

'q time'
line1=sublin(result,1)
itime1=subwrd(line1,3)
fecha=substr(itime1,1,12)

'printim 'path'/masa_de_aire_'fecha'.png png white'
'c'

*******************************************************
*Grafico la humedad relativa

'd maskout(auxiliar,1.5e-5-gradte)'
'set gxout shaded'
'd q'
'run cbarn.gs'


*Se grafica las vectores de viento en el nivel deseado
'set gxout vector'
'set ccolor 1'
'd skip(UGRDprs(lev='niv'),6);VGRDprs(lev='niv')'

'printim 'path'/masa_de_aire_q_'fecha'.png png'
'c'
*******************************************************
*Grafico la temperatura

'd maskout(auxiliar,1.5e-5-gradte)'
'set gxout shaded'
'd tmp'
'run cbarn.gs'

*Se grafica las vectores de viento en el nivel deseado
'set gxout vector'
'set ccolor 1'
'd skip(UGRDprs(lev='niv'),6);VGRDprs(lev='niv')'

'printim 'path'/masa_de_aire_t_'fecha'.png png'








