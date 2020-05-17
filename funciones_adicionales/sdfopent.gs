function sdfopent(args)
* This function simulates the old 3-arg sdfopen for templating, but needs 5.
* It is based on narropen.gs, originally by Jamie Scott, and heavily
* modified by me. -Hoop.   2008/02/14
*
**args are:
* 1 dset = full path of netCDF data file
* 2 the template, full path or just the filename portion
* 3 ntimes = number of timesteps in the time series
* 4 DDFname = filename of DDF file that this script writes for you (optional)
*****************************************************************************

**Parse command line args  
dset = subwrd(args,1)
templ = subwrd(args,2)
ntimes = subwrd(args,3)
gradsvers=getvers()
* say 'gradsvers='gradsvers'.'
if(gradsvers="v1.8")
* short-circuit to the built-in, which this script emulates, 'cuz no strlen()
'sdfopen ' dset ' ' templ ' ' ntimes
else
out = subwrd(args,4)
if(out='')
out='out.ddf'
   say 'Defaulting optional DDF arg to out.ddf'
endif

**warn if args are blank
if (dset = '' | templ = '' | ntimes = '')
say 'Must include following args:'
say 'sdfopent netCDFpath Template NumTimes [DDF]'
say 'Where:'
say 'netCDFpath is full path to netcdf file'
say 'Template is the template (full path or relative)'
say 'NumTimes is the number of timesteps in the netCDF file'
say 'DDF is optional name of DDF file created.'
* say 'Time1 is the first time in GrADS format (E.G., 0z01Jan1979)'
* say 'Tstep is the size of a time step (E.G., 6hr, 1dy, 1mo)'
* say 'DDFname is the filename of the DDF file that this script writes for you'
exit
endif

* Remember, the path args may not have slashes
lastslsh=rindex(dset,'/')
dsetlen=strlen(dset)
fnamelen=dsetlen-lastslsh
fname=substr(dset,lastslsh+1,fnamelen)
if (lastslsh=0)
dirname=''
else
dirname=substr(dset,1,lastslsh)
endif
templchr1=substr(templ,1,1)
if (templchr1='/')
templtln=templ
else
templtln=dirname%templ
endif
'sdfopen 'dset
line2=sublin(result,2)
filenum=subwrd(line2,8)
'q dims'
line5=sublin(result,5)
time1=subwrd(line5,6)
'set t 1 2'
ymdh1=subwrd(result,4)
ymdh2=subwrd(result,5)
'close 'filenum

* parse first time
tempstr=ymdh1
* say 'Parsing 'tempstr'.'
templen=strlen(tempstr)
lastcolon=rindex(tempstr,':')
* say 'Length='templen'.'
coloncol=index(tempstr,':') 
* say 'First colon found at position='coloncol'.'
yr1=substr(tempstr,1,coloncol-1)
say 'yr1='yr1'.'
tempstr=substr(tempstr,coloncol+1,templen-coloncol)
* say 'tempstr shrunk to='tempstr'.'
templen=templen - (strlen(yr1)+1)
* say 'New length='templen
coloncol=index(tempstr,':')
* say 'Next colon position='coloncol'.'
mon1=substr(tempstr,1,coloncol-1)
* say 'mon1='mon1'.'
tempstr=substr(tempstr,coloncol+1,templen-coloncol)
* say 'tempstr shrunk again to='tempstr'.'
templen=templen-(strlen(mon1)+1)
* say 'And now it has length='templen'.'
coloncol=index(tempstr,':')
* say 'Last colon position='coloncol'.'
dy1=substr(tempstr,1,coloncol-1)
* say 'dy1='dy1'.'
hr1=substr(tempstr,coloncol+1,templen-coloncol)
* say 'hr1='hr1'.'

* parse time2
tempstr=ymdh2
* say 'Parsing 'tempstr'.'
templen=strlen(tempstr)
* say 'Length='templen'.'
coloncol=index(tempstr,':') 
* say 'First colon found at position='coloncol'.'
yr2=substr(tempstr,1,coloncol-1)
* say 'yr2='yr2'.'
tempstr=substr(tempstr,coloncol+1,templen-coloncol)
* say 'tempstr shrunk to='tempstr'.'
templen=templen - (strlen(yr2)+1)
* say 'New length='templen
coloncol=index(tempstr,':')
* say 'Next colon position='coloncol'.'
mon2=substr(tempstr,1,coloncol-1)
* say 'mon2='mon2'.'
tempstr=substr(tempstr,coloncol+1,templen-coloncol)
* say 'tempstr shrunk again to='tempstr'.'
templen=templen-(strlen(mon2)+1)
* say 'And now it has length='templen'.'
coloncol=index(tempstr,':')
* say 'Last colon position='coloncol'.'
dy2=substr(tempstr,1,coloncol-1)
* say 'dy2='dy2'.'
hr2=substr(tempstr,coloncol+1,templen-coloncol)
* say 'hr2='hr2'.'

if(yr1!=yr2)
   say 'Cannot handle differences in years'
   return
endif
deltamon=mon2-mon1
if (deltamon > 0)
   if (deltamon = 1)
tstep="1mo"
   else
       say 'Cannot handle differences in months greater than 1'
       return
   endif
else
deltady=dy2-dy1
   if (deltady > 0)
       if (deltady = 1)
tstep="1dy"
       else
           say 'Cannot handle differences in days greater than 1'
	    return
       endif
   else
deltahr = hr2 - hr1
tstep=deltahr%'hr'
   endif
endif
* say 'Got dset='dset', templ='templ', ntimes='ntimes', time1='time1', tstep='tstep', DDFname='out'.'

say 'netCDFfile= 'dset
say 'Template= 'templ
say 'NumTimes= 'ntimes
say 'Time1= 'time1
say 'Tstep= 'tstep
say 'DDF= 'out

**construct default ddf*
line = 'DSET 'templtln
line2= 'options template'
* problem - xdfopen requires full tdef line when templating, so 2 more args
line3 ='tdef time 'ntimes' linear 'time1' 'tstep

*write out ddf
rc = write(out,line)
rc = write(out,line2)
rc = write(out,line3)
rc = close(out)

*open ddf
'xdfopen 'out
say result
'set t 1'
say result
endif
* This endif is from the beginning of the script where we short-circuit
* to the built-in sdfopen command if we have version 1.8, as 1.8 doesn't
* have "strlen".  This is OK, because this script is meant to restore the
* functionality in the 1.8 version of sdfopen.
return

function index(arg1,arg2)
bigstr=subwrd(arg1,1)
ltlstr=subwrd(arg2,1)
* say 'bigstr='bigstr' , ltlstr='ltlstr'.'
biglen=strlen(bigstr)
ltllen=strlen(ltlstr)
* say 'biglen='biglen
* say 'ltllen='ltllen
if(ltllen < 1)
   return(0)
endif
if(ltllen > biglen)
   return(0)
endif
i=1
while (i <= (biglen - ltllen + 1))
   newstr=substr(bigstr,i,ltllen)
* say 'newstr='newstr
   if (newstr=ltlstr)
       return(i)
   endif
   i=i+1
endwhile
return(0)

function rindex(arg1, arg2)
bigstr=subwrd(arg1,1)
ltlstr=subwrd(arg2,1)
* say 'bigstr='bigstr' , ltlstr='ltlstr'.'
biglen=strlen(bigstr)
ltllen=strlen(ltlstr)
* say 'biglen='biglen
* say 'ltllen='ltllen
if(ltllen < 1)
   return(0)
endif
if(ltllen > biglen)
   return(0)
endif
i=(biglen -ltllen + 1)
while (i >= 1)
   newstr=substr(bigstr,i,ltllen)
* say 'newstr='newstr
   if (newstr=ltlstr)
       return(i)
   endif
   i=i-1
endwhile
return(0)

function getvers(args)
'q config'
line1=sublin(result,1)
word2l1=subwrd(line1,2)
tempstr=substr(word2l1,1,4)
return(tempstr)
