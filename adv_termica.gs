'reset'
time = 1
'set lat -65 -5'
'set lon 230 340'
'set mpdset hires'
'run jaecol.gs'
'set parea 0.5 10.0 0.5 7.5'
'set poli on'
maskout=1500
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
say 'DEFINIENDO LAS VARIABLES A(TMP)'
'define terreno=hgtsfc(lev=1000)'
'define tmp=tmpprs(lev=925)'
'define u=ugrdprs(lev=925)'
'define v=vgrdprs(lev=925)'
'define alturas=hgtprs(lev=1000)'
***---***
'dtx = cdiff(tmp,x)'
'dty = cdiff(tmp,y)'
'dx = cdiff(lon,x)*3.1416/180'
'dy = cdiff(lat,y)*3.1416/180'
'set gxout shaded'
'set clevs -4 -2.5 -2 -1.5 -1.3 -1.2 -1.1 -1 -0.5 0.5 1 1.1 1.2 1.3 1.5 2 2.5 4'
'set rbcols 59 58 57 56 55 54 53 52 51 0 21 22 23 24 25 26 27 28 29'
'd smth9(3600*(-1*((u*dtx)/(cos(lat*3.1416/180)*dx) + v*dty/dy)/6.37e6))'
'run cbarn.gs'
'set gxout contour'
'set cthick 5'
'set clskip 3'
'set ccolor 1'
'set cint 20'
'd alturas'


'set gxout grfill'
'set clevs 1500'
'set ccols 73 73'
'd maskout(terreno,terreno-'maskout')'
* titulos
'draw title 'fecha' \ Adveccion termica en 925 MB y alturas 1000mb [HGP]'
* titulos
'printim /home/marcos/Documentos/METEOROLOGIA/GRADS/PRONOSTICO/imagenes/SYNOP/t_adv'time'.png png white'
'clear'
say '************'
time=time+6
endwhile
