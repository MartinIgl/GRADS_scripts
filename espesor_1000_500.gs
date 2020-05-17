********************************************************************
*Script que grafica espesor 1000/500 hpa
*v1.1 Github: huayratoro, reversionado por SudestadaARG
********************************************************************
*Se aclara que las variables que se usan es hgt, psfc (deben estar incluidas en el ctl)
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

*defino variables previamente
maskout=1500
*este seteado es ARG
'set lat -80 -20'
'set lon -90 -50'
'set mpdset hires'
'set poli on'
'set clopts -1 -1. 0.12'
'set ylopts 1 5 0.14'
'set xlopts 1 5 0.14'
'set map 79 1 6'
*'set vpage 0.6 10 0. 8.'
'set xlint 5'
'set ylint 5'


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
say 'DEFINIENDO LAS VARIABLES ESPESOR 1000/500'
'define terreno=hgtsfc(lev=1000)'
'define z5=hgtprs(lev=500)'
'define z1=hgtprs(lev=1000)'
'define p=prmslmsl(lev=1000)/100'
'define u=ugrdprs(lev=1000)'
'define v=vgrdprs(lev=1000)'
'define espesor=z5-z1'
***---***

*GRAFICO
'set grads off'
'run jaecol.gs'
*Espesor 1000/500
'set gxout shaded'
'set csmooth on'
'set clevs 5000 5050 5100 5150 5200 5250 5300 5350 5400 5450 5500 5550 5600 5650 5700 5750 5800 5850'
'set rbcols 59 58 57 49 47 45 43 42 41 21 22 23 24 25 26 27 28 29'
'd espesor'
'run cbarn.gs .9 1 10.2'

*campo de presion
'set gxout contour'
'set cthick 7'
'set clab on'
'set clskip 2'
'set cint 3'
'set ccolor 1'
'd p'

*para las isohipsas
'set clskip 1'
'set cthick 10'
'set cmax 5200'
'set cmin 5200'
'set ccolor 6'
'd espesor'
'set cmax 5700'
'set cmin 5700'
'set ccolor 7'
'd espesor'

'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'

* titulos
'draw title 'fecha' \ Espesor 1000/500 Hpa (somb,mgp), prnm(Hpa)'
'printim 'path'/espesor_1000_500_'time'.png png white'
'clear'



**********Otra forma
* mapa de 1000 + espesores 500/1000 y viento
*MODIFICAR (DE SER NECESARIO) EL NOMBRE DE LAS VARIABLES: H, T, U Y V 

'set gxout shaded'
'set clevs 5220 5280 5340 5400 5460 5520 5580 5640 5700 5760 5820'
'set rbcols 45 44 43 42 41 22 23 24 25 26'  
'set grads off'
'd maskout(HGTprs(lev=500)-HGTprs(lev=1000),2000-HGTprs(lev=1000))'
'run cbarn .9 1 10.2'
'set gxout contour'
'set clevs 5220 5280 5340 5400 5460 5520 5580 5640 5700 5760 5820'
'set ccolor 0'
'set clab off'
'd maskout(HGTprs(lev=500)-HGTprs(lev=1000),2000-HGTprs(lev=1000))'
'set lev 1000'
'set cint 40'
'set ccolor 1'
*set cthick 6'
'set clab on'
'set clskip 2'
'd maskout(HGTprs,2000-HGTprs(lev=1000))'
'set gxout vector'
'set ccolor 1'
'set arrscl 0.4 10'
'set arrowhead -.2'
'set digsize 0.07'
'd skip(maskout(UGRDprs(lev=1000),1500-HGTprs(lev=1000)),3);VGRDprs(lev=1000)'

'draw title 'time' \espesor 1000/500 (somb),Hgt y Viento en 1000 hPa'
'printim  'path'/esp_'tiempo'.png png x800 y600 white'
say '************'
time=time+deltat
endwhile






