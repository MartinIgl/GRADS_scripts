* Demonstrates how to use gxout bar and errbar to draw a box and whisker plot

'open model.ctl'

* pick a variable and an area, in this case surface temperature in central US
var='ts'
minlat='30'
maxlat='50'
minlon='-110'
maxlon='-80'
tlast=5

* define variables: mean, plus 1 stddev, minus 1 stddev, min, max, 
'set x 1'
'set y 1'
'set t 1 'tlast
'define mean = tloop(aave('var',lon='minlon',lon='maxlon',lat='minlat',lat='maxlat'))'
'define pstd = mean + tloop(aave(sqrt(pow('var'-mean,2)),lon='minlon',lon='maxlon',lat='minlat',lat='maxlat'))'
'define mstd = mean - tloop(aave(sqrt(pow('var'-mean,2)),lon='minlon',lon='maxlon',lat='minlat',lat='maxlat'))'
'define vmax = tloop(max(max('var',lon='minlon',lon='maxlon'),lat='minlat',lat='maxlat'))'
'define vmin = tloop(min(min('var',lon='minlon',lon='maxlon'),lat='minlat',lat='maxlat'))'

* set up the plot 
'clear'
'set vrange 260 300'
'set t 0.5 'tlast+0.5

* draw bars centered on the mean, spanning the range from plus/minus 1 standard deviaton 
'set gxout bar'
'set bargap 50'
'set baropts outline'
'd mstd;pstd'

* draw error bars spanning the range from the min/max values
'set gxout errbar'
'd vmin;vmax'

* draw yellow line showing the mean values
'set gxout line'
'set cmark 0'
'set cthick 6'
'd mean'

 
