*******************************************************************
*Script que grafica la  Adveccion de temperatura
*v1.1 Github: huayratoro, reversionado por SudestadaARG
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
'set parea 0.5 10.0 0.5 7.5'


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
'set t 'time
***---***
*Para la fecha correspondiente
'q time'
line1=sublin(result,1)
itime1=subwrd(line1,3)
fecha=substr(itime1,1,12)
***---***
*DEFINIENDO LAS VARIABLES
say 'DEFINIENDO LAS VARIABLES A(TMP)'
'define terreno=hgtsfc(lev=1000)'
'define tmp=tmpprs(lev='niv')'
'define u=ugrdprs(lev='niv')' 
'define v=vgrdprs(lev='niv')'
'define alturas=hgtprs(lev=1000)'
***---***
'dtx = cdiff(tmp,x)'
'dty = cdiff(tmp,y)'
'dx = cdiff(lon,x)*pi/180'
'dy = cdiff(lat,y)*pi/180'


*GRAFICO
'run jaecol.gs'
'set grads off'
*Se grafica la adveccion termica

'set gxout shaded'
'set clevs -4 -2.5 -2 -1.5 -1.3 -1.2 -1.1 -1 -0.5 0.5 1 1.1 1.2 1.3 1.5 2 2.5 4'
'set rbcols 59 58 57 56 55 54 53 52 51 0 21 22 23 24 25 26 27 28 29'

'd smth9(3600*(-1*((u*dtx)/(cos(lat*pi/180)*dx) + v*dty/dy)/6.37e6))'
'run cbarn.gs'
*Grafico el HGT en 1000hpa
'set gxout contour'
'set cthick 5'
'set clskip 3'
'set ccolor 1'
'set cint 20'
'd alturas'

* Sombreo en gris la zona enmascarada
'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'


* titulos
'draw title 'fecha' \ Adveccion termica en 'niv' hpa y alturas 1000 Hpa [HGP]'

'printim 'path'/t_adv'time'.png png white'
'c'
********************************************************
*Gradiente termico

'set grads off'
*transforma latitude e longitude de graus para radianos
'define latr=lat*3.1415/180'
'define lonr= lon*3.1415/180'
*raio da Terra
'define r=6.371e6'
*variacao em relacao a latitude
'define dy=r*cdiff(latr,y)'
*variacao em relacao a longitude
'define dx=r*cos(latr)*cdiff(lonr,x)'
*variacao de temperatura com long
'define dtx=cdiff(tmpprs(lev='niv'),x)'
*variacao da temperatura com relacao a lat
'define dty=cdiff(tmpprs(lev='niv'),y)'
*unidade: oC/km
'define dtdx=dtx/dx*1000'
'define dtdy=dty/dy*1000'

*Temperatura
'set cint 3'
'd tmpprs(lev='niv')-273'
*Gradiente de T
'set gxout contour'
'set arrscl 0.3 0.01'
'd skip(dtdx,5,5);dtdy;mag(dtdx,dtdy)'


* Sombreo en gris la zona enmascarada
'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'


* titulos
'draw title 'fecha' \ Temperatura 2m (oC) e Grad T (oC/km) en 'niv'hpa'
'printim 'path'/GradT_'time'.png png white'
'c'

say '************'
time=time+deltat
endwhile

