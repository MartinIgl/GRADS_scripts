function narropen(args)
* This function opens up pre-projected (lambert conformal) NARR netCDF data 
* in GrADS (version 1.9b4 or later).  
* It uses commandline arguments to build a data descriptor file (ddf) 
* to open in GrADS.  Written by Jamie Scott (NOAA/ESRL/PSD) 11/2005. 
* Modified 2008/02/12 to work all types of NARR files by Hoop
* Problem:  air.2m,apcp,prate,uwnd.10m,vwnd.10m, and hgt.sfc use missing=32767
* while land uses -9999 and the rest use 32766
* except monolevel monthly wspd (32767)
* This UNDEF problem solved 2008/02/13 by Hoop.
*
**args are:
* 1 dset = full path of netCDF data file
* 2 varname = variable name in netcdf file
* 3 ntimes = number of timesteps in netcdf file
* 4 start = first time/date in netcdf file : e.g. 00z01jan1979
* 5 delta = increment between timesteps : e.g 3hr,1dy, 1mo,or 1yr
* 6 out = full path of output data descriptor file (default is ./.ddf)
* 7 vert = vertical coordinate type (sfc or press or subsfc: sfc is default)
* 8 res  = horizontal resolotion to regrid to  (0.33 or 1.0: 0.33 is default)
*****************************************************************************

**Parse command line args  
dset=subwrd(args,1)
varname = subwrd(args,2)
ntimes = subwrd(args,3)
start  = subwrd(args,4)
delta  = subwrd(args,5)
out=subwrd(args,6)
vert = subwrd(args,7)
res = subwrd(args,8)

**warn is args are blank
if (dset ='' | varname='')
say 'must include following args:'
say 'narropen netCDFfile VarName NumTimes StartTime DeltaT [out.ddf] [VerticalCoord] [HorizRes] '
say 'Where:'
say 'netCDFfile is full path to netcdf file'
say 'VarName is the variable name in netcdf file'
say 'NumTimes is the number of timesteps in the netCDF file'
say 'StartTime is the first time in the file (e.g. 00z01jan1979)'
say 'DeltaT is the time increment between timesteps (e.g. 3hr, 1dy, 1mo, or 1yr)'
say 'out.ddf is the optional full path to the generated ddf file ./.ddf is the default'
say 'VerticalCoord is one of following: sfc or press or subsfc (sfc default)'
say 'HorizRes is the resolution to regrid to: 0.33 or 1.0 (0.33 default)'
exit
endif

lastslsh=rindex(dset,'/')
dsetlen=strlen(dset)
fnamelen=dsetlen-lastslsh
fname=substr(dset,lastslsh+1,fnamelen)
* say 'lastslsh='lastslsh', dsetlen='dsetlen', fnamelen='fnamelen', fname='fname'.'

**SET DEFAULT VALUES for command line args
if (start='');start='00z01jan1979';say 'Using 00z01jan1979 for start';endif
if (ntimes='');ntimes='4000';say 'Using default value for NumTimes (4000)';endif
if (delta='');delta='1mo';say 'Using default value for DeltaT (1mo)';endif
if (out='');out='./.ddf';say 'Using default value for out.ddf';endif
if ((vert != 'press') & (vert != 'subsfc'));vert='sfc';say 'Using default value for VerticalCoord';endif
if (res != '1.0');res='0.33';say 'Using default value for HorizRes';endif

say 'netCDFfile= 'dset
say 'VarName= 'varname
say 'NumTimes= 'ntimes
say 'StartTime= 'start
say 'DeltaT= 'delta
say 'out.ddf= 'out
say 'VerticalCoord= 'vert
say 'HorizRes= 'res

first4=substr(fname,1,4)
first5=substr(fname,1,5)
first6=substr(fname,1,6)
first7=substr(fname,1,7)
first8=substr(fname,1,8)
* say 'first4='first4', first5='first5', first6='first6', first7='first7', first8='first8'.'
use32767=0
use9999=0
if((first5='apcp.')|(first6='prate.')|(first7='air.2m.')|(first7='hgt.sfc'))
* say 'In first If for 32767'
use32767=1
endif
if((first8='uwnd.10m')|(first8='vwnd.10m'))
* say 'In second If for 32767'
use32767=1
endif
if((first4='wspd') & (vert='sfc'))
* say 'In wspd and sfc If'
use32767=1
endif
if(first4='land')
* say 'In land If'
use9999=1
endif

* say 'use32767='use32767
**construct default ddf*
line = 'DSET 'dset
line2= 'DTYPE netcdf'
line3= 'TITLE NARR 3D field lambert conformal projection'
line4= 'UNDEF 32766'
if(use32767=1)
line4= 'UNDEF 32767'
endif
if(use9999=1)
line4= 'UNDEF -9999'
endif
line5= 'UNPACK scale_factor add_offset'
line6= 'PDEF 349 277 lcc 1 -145.5 1 1 50 50 -107 32463 32463'
line7= 'XDEF 615 linear 150 0.3333'
line8= 'YDEF 255 linear 2 0.3333'
line9= 'ZDEF 1 levels 0'
line10 ='tdef 'ntimes' linear 'start' 'delta
line11 ='vars 3'
line12 = varname' 0 t,y,x 'varname
line13 ='lat=>glat 0 y,x Latitude'
line14 ='lon=>glon 0 y,x Longitude'
line15 ='endvars'

**modify defaults if necessary

**pressure level mods
if (vert='press')
* say 'Oh, a pressure-level file.'
line9= 'ZDEF 29 levels 1000.0 975.0 950.0 925.0 900.0 875.0 850.0 825.0 800.0 775.0 750.0 725.0 700.0 650.0 600.0 550.0 500.0 450.0 400.0 350.0 300.0 275.0 250.0 225.0 200.0 175.0 150.0 125.0 100.0'
line12= varname' 29 t,z,y,x 'varname
if (varname='tke')
* say 'Oh, it is TKE.'
line9='ZDEF 15 levels 1000.0 975.0 950.0 925.0 900.0 875.0 850.0 825.0 800.0 775.0 750.0 725.0 700.0 650.0 600.0'
line12= varname' 15 t,z,y,x 'varname
endif
endif

**lower res mods
if (res='1.0')
* say 'Oh, 1.0 degrees of horizontal resolution.'
line7= 'XDEF 205 linear 150 1'
line8= 'YDEF 85 linear 2 1'
endif

if (vert='subsfc')
* say 'Oh, a subsurface file.'
line9='ZDEF 4 levels 0 10 40 100'
line12= varname' 4 t,z,y,x 'varname
if (varname='tsoil')
* say 'Oh, it is tsoil.'
line9='ZDEF 5 levels 0 10 40 100 800'
line12= varname' 5 t,z,y,x 'varname
endif
endif

*write out ddf
rc = write(out,line)
rc = write(out,line2)
rc = write(out,line3)
rc = write(out,line4)
rc = write(out,line5)
rc = write(out,line6)
rc = write(out,line7)
rc = write(out,line8)
rc = write(out,line9)
rc = write(out,line10)
rc = write(out,line11)
rc = write(out,line12)
rc = write(out,line13)
rc = write(out,line14)
rc = write(out,line15)
rc = close(out)

*open ddf
'open 'out
say result

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
