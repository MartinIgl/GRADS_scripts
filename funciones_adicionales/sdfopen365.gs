function sdfopen365(args)
* This function opens an SDF otherwise acceptable to sdfopen w/365 day calendar.
* The calendar attribute is ignored, but it's really for either
* "365_day_calendar" or "noleap" (equivalent).
* -Hoop.   2017/02/20
*
**args are:
* 1 dset = full path of netCDF data file
* 2 timedim = name of time dimension in NetCDF data file
* 3 tstepcnt = number of time steps in file
* 4 starttime = initial time value in GrADS hh.mmZdayMonth_NameYYYY form
* 5 timeincr = time increment ala GrADS; E.G.:  1dy for daily data
* 6 DDF (optional; defaults to .out.ddf in the current directory)
*****************************************************************************
**Parse command line args  
dset = subwrd(args,1)
timedim = subwrd(args,2)
tstepcnt = subwrd(args,3)
starttime = subwrd(args,4)
timeincr = subwrd(args,5)
out = subwrd(args,6)
if(out='')
out='.out.ddf'
   say 'Defaulting optional DDF arg to .out.ddf'
endif
**warn if args are blank
if (dset = '' | timedim = '' | tstepcnt = '' | starttime = '' | timeincr = '')
say 'Must include following args:'
say 'sdfopen365manyArgs netCDFpath timedim tstepcnt starttime timeincr [DDF]'
say 'Where:'
say 'netCDFpath is full path to netcdf file'
say 'timedim is name of temporal dimension in NetCDF file'
say 'tstepcnt is number of time steps in the file'
say 'starttime is GrADS-style initial time, like 0z01Jan2000'
say 'timeincr is GrADS-style time increment, like 1dy for daily data'
say 'DDF is optional name of DDF file created.'
exit
endif
say 'netCDFfile= 'dset
say 'timedim= 'timedim
say 'tstepcnt= 'tstepcnt
say 'starttime= 'starttime
say 'timeincr= 'timeincr
say 'DDF= 'out


**construct DDF*
line = 'DSET 'dset
line2= 'options 365_day_calendar'
line3= 'TDEF 'timedim' 'tstepcnt' LINEAR 'starttime' 'timeincr
**write out DDF*
rc = write(out,line)
rc = write(out,line2)
rc = write(out, line3)
rc = close(out)

**open DDF*
'xdfopen 'out
say result
'set t 1'
say result

return
