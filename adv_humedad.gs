********************************************************************
*Script que grafica la  Adveccion de humedad especifica
*v1.1 Github: huayratoro, reversionado por SudestadaARG
********************************************************************
*Se aclara que las variables que se usan es Temperature, u v wind, hgt,rh (deben estar incluidas en el ctl)
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
*Defino el nivel 
prompt 'Indique nivel en hpa: '
pull niv
'set lev 'niv


*La cantidad de tiempos depende de cuantos archivos cada 6h tengas, se puede modificar.
*prompt 'Indique la cantidad de FCST o analisis: '
*pull timefin
*prompt 'Indique el delta de tiempo entre FCST o analsis: '
*pull deltat

deltat=6
timefin=12
time=1

while(time<timefin)
'set grads off'

'set t 'time
***---***
*Para la fecha correspondiente
'q time' 
line1=sublin(result,1)
itime1=subwrd(line1,3)
fecha=substr(itime1,1,12)
***---***
*DEFINIENDO LAS VARIABLES
say 'DEFINIENDO VARIABLES DE A(HUM)'
'define terreno=hgtsfc(lev=1000)'
'define tmp=tmpprs(lev='niv')'
'define et=(-2937.4/(tmp))-(4.9283*log10(tmp))+22.5518'
'define es=pow(10,et)*10'
'define e=es*0.01*rhprs'
'define q=0.622*e/(lev-e)'
'define u=ugrdprs(lev='niv')'
'define v=vgrdprs(lev='niv')'
***---***
'dtx = cdiff(q,x)'
'dty = cdiff(q,y)'
'dx = cdiff(lon,x)*pi/180'
'dy = cdiff(lat,y)*pi/180'


*Se grafica la adveccion de humedad en un nivel
'run jaecol.gs'

'set gxout shaded'
'set clevs -2 -1.5 -1.4 -1.3 -1.2 -1 -0.9 -0.8 -0.7 -0.6 -0.5 -0.4 -0.3 0 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1 1.2 1.3 1.4 1.5 2'
'set rbcols 87 86 85 84 83 29 28 27 26 25 24 23 0 33 34 35 41 42 43 44 45 46 47 48 49'

'd smth9(3600*(-1*((u*dtx)/(cos(lat*pi/180)*dx) + v*dty/dy)/6.37e6))*1000'

'run cbarn.gs'

* Grafico las barbas de viento en nudos(inicialmente en m.s-1)
'set gxout barb'
'd skip(u*1.94,9);skip(v*1.94,9)'

* Sombreo en gris la zona enmascarada
'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'


* titulos
'draw title 'fecha' \ Adveccion de humedad especifica (g/kg) y viento (knots) en 'niv' hpa'
'printim 'path'/adv_q_'time'.png png white'
'c'
say '************'
time=time+deltat
endwhile
