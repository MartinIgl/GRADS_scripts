* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* draw_pdsi.gs
*
* Demonstrates a way to use the shapefile interface in GrADS by
* drawing the Palmer Drought Severity Index (PDSI) values for 
* U.S. climate divisions. 
*
* PDSI values:
*  0 to -.5 = normal; 
* -0.5 to -1.0 = incipient drought; 
* -1.0 to -2.0 = mild drought; 
* -2.0 to -3.0 = moderate drought; 
* -3.0 to -4.0 = severe drought; and 
* greater than - 4.0 = extreme drought
*
* The U.S. climate division shapefiles are available from:
* http://climate.usurf.usu.edu/products/data
* The files are division.shx, division.shp, division.dbf.
* 
* The data files containing index values for 
* U.S. Climate Divisions are available from:
* ftp://ftp.ncdc.noaa.gov/pub/data/cirs/
* The filename template is drd964x.<index>.txt
* where <index> is one of the following: 
* cdd, hdd, pcp, pdsi, phdi, pmdi, sp01, sp02, sp03, 
* sp06, sp09, sp12, sp24, tmp, zndx 
* 
* Written by Jennifer Adams, February 2010
*
function main(args)
y=subwrd(args,1)
m=subwrd(args,2)
if (y='' | m=''); 
  say 'This script needs two arguments, the year and the month.' 
  say 'Usage: draw_pdsi <y> <m>'
  return
endif

var='pdsi'
varcode='05'
datafile='/Users/jma/climatedivs/data/drd964x.'var'.txt'
shapefile='/Users/jma/climatedivs/divisions'
tmpfile='tmp'
ndivs=387

* Draw a blank background plot covering the continental US.
* This is required to set up the scaling environment for the polygons.
rc = setup()
if (rc); return; endif

* Set colors and levels
dorgb()

* Query the dBASE info from the climate division shapefile
'q dbf 'shapefile
data=result

* Loop over all climate divisons in the shapefile
div=0
while (div<ndivs)

* Get the last four characters from the dBase entry for this shape
* this is the division identifier
  divdata=sublin(data,div+2)
  len=math_strlen(divdata)
  stn = substr(divdata,len-3,4)

* Fix the string if we got a comma instead of a zero
* (some climate division identifiers aren't padded with zeros)
  firstchar=substr(stn,1,1)
  if (firstchar=',')
    last3=substr(stn,2,3)
    stn='0'last3
  endif

* Get the index value for the climiate division from the data file
  '!grep 'stn%varcode%y' 'datafile' > 'tmpfile
  result = read(tmpfile)
  line2=sublin(result,2)
  val=subwrd(line2,m+1)
  rc = close(tmpfile)
  '!/bin/rm -f 'tmpfile

* set the color for the outline of the polygon 
  'set line 1'

* the fill color will depends on the data value
  if (val < _plevs.1                    ) ; 'set shpopts '_pcols.1  ; endif 
  if (val < _plevs.2  & val >= _plevs.1 ) ; 'set shpopts '_pcols.2  ; endif
  if (val < _plevs.3  & val >= _plevs.2 ) ; 'set shpopts '_pcols.3  ; endif
  if (val < _plevs.4  & val >= _plevs.3 ) ; 'set shpopts '_pcols.4  ; endif
  if (val < _plevs.5  & val >= _plevs.4 ) ; 'set shpopts '_pcols.5  ; endif
  if (val < _plevs.6  & val >= _plevs.5 ) ; 'set shpopts '_pcols.6  ; endif
  if (val < _plevs.7  & val >= _plevs.6 ) ; 'set shpopts '_pcols.7  ; endif
  if (val < _plevs.8  & val >= _plevs.7 ) ; 'set shpopts '_pcols.8  ; endif
  if (val < _plevs.9  & val >= _plevs.8 ) ; 'set shpopts '_pcols.9  ; endif
  if (val < _plevs.10 & val >= _plevs.9 ) ; 'set shpopts '_pcols.10 ; endif
  if (val < _plevs.11 & val >= _plevs.10) ; 'set shpopts '_pcols.11 ; endif
  if (val < _plevs.12 & val >= _plevs.11) ; 'set shpopts '_pcols.12 ; endif
  if (                  val >= _plevs.12) ; 'set shpopts '_pcols.13 ; endif

* draw the filled polygon  
  'draw shp 'shapefile' 'div
  div=div+1
endwhile

* Draw a customized color bar
polycolor()

* Draw a title
mons="January February March April May June July August September October November December"
mon=subwrd(mons,m)
'set strsiz 0.18 0.20'
'set string 1 c 1'
'draw string 5.5 8.2 Palmer Drought Severity Index'
'draw string 5.5 7.8 'mon' 'y


* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
function setup
'set display color white'
'clear'
'sdfopen http://monsoondata.org:9090/dods/model'
if (rc); return(rc); endif

* Set up a dimension environment for continental US
coords='24 50 -125 -66'
_minlat = subwrd(coords,1)
_maxlat = subwrd(coords,2)
_minlon = subwrd(coords,3)
_maxlon = subwrd(coords,4)
'set lat '_minlat' '_maxlat
'set lon '_minlon' '_maxlon

* Draw a blank map
'set parea 0.5 10.5 0.5 8'
'set rgb 99  1  1  1'
'set annot 99'
'set clevs 0'
'set frame off'
'set grid off'
'set grads off'
'set map 0'
'set mproj nps'
'set mpvals -117.5 -77.5 25.5 51'
'set xlab off'
'set ylab off'
'd ps+10e4' 
return(0)

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
function dorgb
'set rgb 19 230 230 230'
'set rgb 99 10 10 10'

* This is the mossy rock palette -- green->yellow->brown
'set rgb 20 32 38 16'
'set rgb 21 38 55 20'
'set rgb 22 44 68 8'
'set rgb 23 65 96 18'
'set rgb 24 89 131 17'
'set rgb 25 114 150 18'
'set rgb 26 185 205 47'
'set rgb 27 247 223 55'
'set rgb 28 248 212 19'
'set rgb 29 245 186 23'
'set rgb 30 216 138 30'
'set rgb 31 199 113 22'
'set rgb 32 186 90 22'
'set rgb 33 160 70 13'
'set rgb 34 130 64 17'
'set rgb 35 109 55 18'
'set rgb 36 140 85 55'
'set rgb 37 160 122 93' 
'set rgb 38 146 138 137'
'set rgb 39 162 166 158'
'set rgb 40 185 191 183'
* Set the number of colors and levels, and their values
_ncols = 13
_nlevs = 14
_pcols.1  = 34
_pcols.2  = 33
_pcols.3  = 32
_pcols.4  = 31
_pcols.5  = 30
_pcols.6  = 29
_pcols.7  = 40
_pcols.8  = 26
_pcols.9  = 25
_pcols.10 = 24
_pcols.11 = 23
_pcols.12 = 22
_pcols.13 = 21
_plevs.1  = -6
_plevs.2  = -5
_plevs.3  = -4 
_plevs.4  = -3
_plevs.5  = -2
_plevs.6  = -1
_plevs.7  = 1 
_plevs.8  = 2 
_plevs.9  = 3 
_plevs.10 = 4 
_plevs.11 = 5 
_plevs.12 = 6  

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
function polycolor

* Get plot size info
'query gxinfo'
rec2 = sublin(result,2)
rec3 = sublin(result,3)
rec4 = sublin(result,4)
xsiz = subwrd(rec2,4)
ysiz = subwrd(rec2,6)
ylo = subwrd(rec4,4)
xhi = subwrd(rec3,6)
xd  = xsiz - xhi

* Set up constants
yb = ylo - 0.4
yt = yb + 0.25
ymid = yb + 0.5*(yt-yb)
xwid = 1
if (xwid*_ncols > xsiz*0.80) 
  xwid = xsiz*0.80/_ncols
endif
xmid = xsiz/2
xl = xmid - xwid*_ncols/2
'set string 1 c'

* Draw a color bar
num = 1
while (num <= _ncols) 
  col = _pcols.num
  val = _plevs.num
  'set line 'col
  xr = xl + xwid
  if (num=_ncols)
    'draw polyf 'xl' 'yb' 'xl' 'yt' 'xr' 'ymid
  else 
    if (num=1)
      'draw polyf 'xr' 'yt' 'xr' 'yb' 'xl' 'ymid
    else
      'draw recf 'xl' 'yb' 'xr' 'yt
    endif
  endif
  num = num + 1
  xl = xr
endwhile

* Draw numbers in the color bar
'set strsiz 0.10 0.11'
'set string 99 c'
xl = xmid - xwid*_ncols/2
num = 1
while (num <= _ncols) 
  val = _plevs.num
  xr = xl + xwid
  if (num<_ncols)
   'draw string 'xr' 'ymid' 'val
  endif
  num = num + 1
  xl = xr
endwhile

* Draw labels under the color bar
'set string 1 c'
'draw string 'xmid' 'ymid-0.3' Normal'
'draw string 'xmid+xwid' 'ymid-0.3' Mild'
'draw string 'xmid-xwid' 'ymid-0.3' Mild'
'draw string 'xmid+(3.5*xwid)' 'ymid-0.3' Severe'
'draw string 'xmid-(3.5*xwid)' 'ymid-0.3' Severe'
'set string 1 l'
'draw string 'xmid+(1.5*xwid)' 'ymid-0.3' Moderate'
'draw string 'xmid+(4.5*xwid)' 'ymid-0.3' Extreme'
'draw string 'xmid+(6.58*xwid)' 'ymid' WET'
'set string 1 r'
'draw string 'xmid-(1.5*xwid)' 'ymid-0.3' Moderate'
'draw string 'xmid-(4.5*xwid)' 'ymid-0.3' Extreme'
'draw string 'xmid-(6.58*xwid)' 'ymid' DRY'
