********************************************************************
*Script que grafica la convergencia de humedad en 850hpa
*v1.1 Github: huayratoro, reversionado por SudestadaARG
********************************************************************
*Se aclara que las variables que se usan es Temperature, u v wind,rh, hgt,q (deben estar incluidas en el ctl)

'reinit'
'reset'
'set display color white'
'c'
*Defino la ruta del archivo
prompt 'Indique el nombre del Archivo ctl (si no esta en la misma carpeta pongalo con la ruta): '
pull CTL


*defino variables previamente
'define pi=3.14159'
'define r=6371000'
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

time=1
*si quiero graficar la topografia, definirla como el geopot en superficie
'define topo=hgtsfc'

*La cantidad de tiempos depende de cuantos archivos cada 6h tengas, se puede modificar.
*prompt 'Indique la cantidad de FCST o analisis: '
*pull timefin
*prompt 'Indique el delta de tiempo entre FCST o analsis: '
*pull deltat

deltat=6
timefin=121
while(time<timefin)
'set grads off'
'set poli on'

'set t 'time
***---***
*Para la fecha correspondiente, se define el tiempo en dia, hora..
'q time'
line1=sublin(result,1)
itime1=subwrd(line1,3)
fecha=substr(itime1,1,12)
***---***
*DEFINIENDO LAS VARIABLES
say 'DEFINIENDO LAS VARIABLES CONV HUM'
'define terreno=hgtsfc(lev=1000)'
'define u850=ugrdprs(lev=850)'
'define v850=vgrdprs(lev=850)'
'define tmp=tmpprs(lev=850)'
'define rh=rhprs(lev=850)'
'define alt=hgtprs(lev=850)'
'define et=(-2937.4/(tmp))-(4.9283*log10(tmp))+22.5518'
'define es=pow(10,et)*10'
'define e=es*0.01*rh'
'define q=0.622*e/(lev-e)'
'define aux=3.5 *log(tmp)-log(e)-4.805'
'define tl=2840./aux + 55.'
'define aux=3.376/tl - 0.00254'
'define aux1=q*1000*(1.+0.81*q)'
'define aux2=0.2854*(1.-0.28*q)'
'define aux3=(1000/850)'
'define te=((tmp)*pow(aux3,aux2)*exp(aux*aux1))'
'us850=q*u850'
'vs850=q*v850'
* Defino la Convergencia de humedad
'define conv=hdivg(us850,vs850)*86400000'
*Se definen los gradientes de temp equiv
'define dy=r*2*pi*cdiff(lat,y)/360'
'define dx=r*2*pi*cdiff(lon,x)*cos(lat*2*pi/360)/360'
'define dtex=cdiff(te,x)/dx'
'define dtey=cdiff(te,y)/dy'

* Graficado
'run jaecol.gs'
*Se grafican los valores negativos (convergencia)
'set gxout shaded'
'set clevs -80 -60 -40 -30 -20 -10'
'set ccols 29 27 25 24 23 21 0'
'd smth9(conv)'
'run cbarn.gs'

*Los contornos es la magnitud del gradiente de temp equiv
'set gxout contour'
'set ccolor 14'
'set cmin 5'
'd smth9(mag(dtex,dtey))*100000'
'set ccolor 1'
'd alt'
*Se grafica las barbas de viento en 850hpa
'set gxout barb'
'set clevs 850'
'set ccolor 1'
'set cthick 2'
'd skip(maskout(ugrdprs*1.94,'maskout'-hgtsfc),15);skip(maskout(vgrdprs*1.94,'maskout'-hgtsfc),15)'

* Sombreo en gris la zona enmascarada
'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'

* titulos
'draw title 'fecha' \ 850mb: Conv de humedad(%,somb), TPE(K), vto(knots)'
'printim conv_q_vto_'time'.png png white'
'clear'
say '************'
time=time+deltat
endwhile
