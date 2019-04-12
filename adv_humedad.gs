'reset'
'set lat -65 -5'
'set lon 270 330'
maskout=1500
'set mpdset hires'
'run jaecol.gs'
'set poli on'
time = 1
while(time<121)
'set t 'time
***---***
*Para la fecha correspondiente
'q time'
line1=sublin(result,1)
itime1=subwrd(line1,3)
fecha=substr(itime1,1,12)
***---***
say 'DEFINIENDO VARIABLES DE A(HUM)'
'define terreno=hgtsfc(lev=1000)'
'define tmp=tmpprs(lev=900)'
'define et=(-2937.4/(tmp))-(4.9283*log10(tmp))+22.5518'
'define es=pow(10,et)*10'
'define e=es*0.01*rhprs'
'define q=0.622*e/(lev-e)'
'define u=ugrdprs(lev=900)'
'define v=vgrdprs(lev=900)'
***---***
'dtx = cdiff(q,x)'
'dty = cdiff(q,y)'
'dx = cdiff(lon,x)*3.1416/180'
'dy = cdiff(lat,y)*3.1416/180'
'set gxout shaded'
'set clevs -2 -1.5 -1.4 -1.3 -1.2 -1 -0.9 -0.8 -0.7 -0.6 -0.5 -0.4 -0.3 0 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1 1.2 1.3 1.4 1.5 2'
'set rbcols 87 86 85 84 83 29 28 27 26 25 24 23 0 33 34 35 41 42 43 44 45 46 47 48 49'
'd smth9(3600*(-1*((u*dtx)/(cos(lat*3.1416/180)*dx) + v*dty/dy)/6.37e6))*1000'
'run cbarn.gs'
'set gxout barb'
'd skip(u*1.94,9);skip(v*1.94,9)'

'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'
* titulos
'draw title 'fecha' \ Adveccion de humedad especifica (g/kg) y viento (knots) en 900 MB'
'printim /home/marcos/Documentos/METEOROLOGIA/GRADS/PRONOSTICO/imagenes/SYNOP/adv_q_'time'.png png white'
'c'
say '************'
time=time+6
endwhile
