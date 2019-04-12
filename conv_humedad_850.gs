'reset'
'set lat -65 -5'
'set lon 270 330'
maskout=1500
time=1
'define pi=3.14159'
'define r=6371000'
'run jaecol'
'set grads off'
'define topo=hgtsfc'
*xlo=0.2
*xhi=10.5
*ylo=0.8
*yhi=7.0
*'set parea 'xlo' 'xhi' 'ylo' 'yhi
'set poli on'
while(time<121)
'set t 'time
***---***
*Para la fecha correspondiente
'q time'
line1=sublin(result,1)
itime1=subwrd(line1,3)
fecha=substr(itime1,1,12)
***---***
*DEFINIENDO LAS VARIABLES
say 'DEFINIENDO LAS VARIABLES CONV HUM'
* Convergencia de humedad
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
'define conv=hdivg(us850,vs850)*86400000'

'define dy=r*2*pi*cdiff(lat,y)/360'
'define dx=r*2*pi*cdiff(lon,x)*cos(lat*2*pi/360)/360'
'define dtex=cdiff(te,x)/dx'
'define dtey=cdiff(te,y)/dy'

* Graficado
'set gxout shaded'
'set clevs -80 -60 -40 -30 -20 -10'
'set ccols 29 27 25 24 23 21 0'
'set grads off'

'd smth9(conv)'
'run cbarn'

'set gxout contour'
'set ccolor 14'
'set cmin 5'
'd smth9(mag(dtex,dtey))*100000'
'set ccolor 1'
'd alt'

'set gxout barb'
'set clevs 850'
'set ccolor 1'
'set cthick 2'
'set grads off'
'd skip(maskout(ugrdprs*1.94,'maskout'-hgtsfc),15);skip(maskout(vgrdprs*1.94,'maskout'-hgtsfc),15)'

* Sombreo en gris la zona enmascarada
'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'

* titulos
'draw title 'fecha' \ 850mb: Conv de humedad(%,somb), TPE(K), vto(knots)'
'printim /home/marcos/Documentos/METEOROLOGIA/GRADS/PRONOSTICO/imagenes/SYNOP/conv_q_vto_'time'.png png white'
'clear'
say '************'
time=time+6
endwhile
