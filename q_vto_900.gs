'reset'
'set lat -65 -5'
'set lon 250 350'
'set mpdset hires'
'set map 79 1 5'
'set ylpos 0 l'
'set xlint 5'
'set ylint 5'
'set ylopts 1 4 0.12'
'set xlopts 1 4 0.12'

time = 1
maskout=1500
'run jaecol.gs'
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
'set grads off'
*DEFINIENDO LAS VARIABLES
say 'DEFINIENDO LAS VARIABLES HUM ESPECIFICA 900'
'define terreno=hgtsfc(lev=1000)'
'define topo=hgtsfc'
'define tmp=tmpprs(lev=900)'
'define hr=rhprs(lev=900)'
'define u=ugrdprs(lev=900)*1.94'
'define v=vgrdprs(lev=900)*1.94'
'define et=(-2937.4/(tmp))-(4.9283*log10(tmp))+22.5518'
'define es=pow(10,et)*10'
'define e=es*0.01*hr'
'define q=0.622*e/(lev-e)'

***---***
* Humedad especifica
'set gxout shaded'
'set grads off'
'set lev 900'
'set clevs  5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20'
'set rbcols 0 23 22 21 31 32 33 41 42 43 44 55 56 57 58 59'
'define hum=q*1000'
'd smth9(hum)'
'run cbarn'

* Viento
'set gxout barb'
'set ccolor 1'
'set cthick 2'
'set grads off'
'd skip(u,12);skip(v,12)'

* terreno
'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'

* titulos
'draw title 'fecha' \ 900mb: Humedad especif(g/kg,somb), vto(knots)'
'printim /home/marcos/Documentos/METEOROLOGIA/GRADS/PRONOSTICO/imagenes/SYNOP/qa_vto_'time'.png png white'
'clear'
say '************'
time=time+6
endwhile
