* open a file
'sdfopen http://monsoondata.org:9090/dods/model'

* get the range of data values to be plotted
'set gxout stat'
'd ts'
n8=sublin(result,8)
min=subwrd(n8,4)
max=subwrd(n8,5)

* set the contour levels
nlevs=239
l=1
levs=''
val=min
delta=(max-min)/nlevs
while(l<=nlevs)
 val=min + l*delta
 fmt="%3.0f"
 fval = math_format(fmt,val)
 levs=levs' 'fval
 l=l+1
endwhile

* set the contour colors
c=255
cols=''
while (c>15)
  cols=cols' 'c
  c=c-1
endwhile

* define the colors
delta=5
base=15
c=16
blksz=48
while (c<=255)

* block 1: Red to Yellow
  rval=255 
  bval=base  
  i=0
  while (i<blksz)
    gval=base + (i*delta)
    'set rgb 'c' 'rval' 'gval' 'bval
    i=i+1
    c=c+1
  endwhile

* block 2: Yellow to Green
  gval=255
  bval=base
  i=0
  while (i<blksz)
    rval=255 - (i*delta)
    'set rgb 'c' 'rval' 'gval' 'bval
    i=i+1
    c=c+1
  endwhile

* block 3: Green to Cyan
  rval=base
  gval=255
  i=0
  while (i<blksz)
    bval=base + (i*delta)
    'set rgb 'c' 'rval' 'gval' 'bval
    i=i+1
    c=c+1
  endwhile

* block 4: Cyan to Blue
  rval=base
  bval=255
  i=0
  while (i<blksz)
    gval=255 - (i*delta)
    'set rgb 'c' 'rval' 'gval' 'bval
    i=i+1
    c=c+1
  endwhile

* block 5: Blue to Purple
  gval=base
  bval=255
  i=0
  while (i<blksz)
    rval=base + (i*delta)
    'set rgb 'c' 'rval' 'gval' 'bval
    i=i+1
    c=c+1
  endwhile

endwhile  

* draw the plot
'clear'
'set ccols 'cols
'set clevs 'levs
'set gxout grfill'
'd ts'

* draw a colorbar
'cbarm'

