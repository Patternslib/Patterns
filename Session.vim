let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd /usr/local/plone-5.1/ploneintranet/dev/quaive.resources.ploneintranet/prototype/patternslib
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +1 src/pat/tooltip-ng/tooltip-ng.js
badd +1 src/pat/tooltip/tooltip.js
badd +1 node_modules/tippy.js/index.css
badd +1 node_modules/tippy.js/themes/light.css
badd +70 webpack/base.config.js
badd +24 package.json
badd +210 src/pat/tooltip/tests.js
badd +5 ~/.vimrc
badd +1 src/pat/tooltip-ng/index.html
badd +1 term://.//4838:/bin/bash
badd +24 webpack/karma.config.js
badd +1 tests/specs/lib/depends_parse.js
badd +1 tests/specs/lib/dependshandler.js
badd +28 tests/specs/lib/htmlparser.js
badd +43 tests/specs/lib/tippy.js
badd +66 src/pat/tooltip-ng/tests.bak
badd +1620 node_modules/tippy.js/esm/index.all.js
badd +1896 node_modules/tippy.js/umd/index.all.js
badd +1 src/pat/tooltip-ng/tests.js
badd +1 docs/developer/create-a-pattern.md
badd +1 docs/developer/parser.md
badd +47 docs/developer/patterns.rst
badd +208 docs/developer/styleguide.md
badd +1 docs/developer/usage-recipies.md
badd +19 src/pat/tooltip/index.html
argglobal
silent! argdel *
set stal=2
edit src/pat/tooltip-ng/index.html
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winminheight=1 winminwidth=1 winheight=1 winwidth=1
exe 'vert 1resize ' . ((&columns * 95 + 95) / 190)
exe 'vert 2resize ' . ((&columns * 94 + 95) / 190)
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 32 - ((31 * winheight(0) + 27) / 54)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
32
normal! 09|
wincmd w
argglobal
if bufexists('src/pat/tooltip/index.html') | buffer src/pat/tooltip/index.html | else | edit src/pat/tooltip/index.html | endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 34 - ((28 * winheight(0) + 27) / 54)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
34
normal! 011|
wincmd w
exe 'vert 1resize ' . ((&columns * 95 + 95) / 190)
exe 'vert 2resize ' . ((&columns * 94 + 95) / 190)
tabnew
set splitbelow splitright
set nosplitbelow
set nosplitright
wincmd t
set winminheight=1 winminwidth=1 winheight=1 winwidth=1
argglobal
if bufexists('term://.//4838:/bin/bash') | buffer term://.//4838:/bin/bash | else | edit term://.//4838:/bin/bash | endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
let s:l = 7134 - ((53 * winheight(0) + 27) / 54)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
7134
normal! 0113|
lcd /usr/local/plone-5.1/ploneintranet/dev/quaive.resources.ploneintranet/prototype/patternslib
tabedit /usr/local/plone-5.1/ploneintranet/dev/quaive.resources.ploneintranet/prototype/patternslib/src/pat/tooltip/tooltip.js
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winminheight=1 winminwidth=1 winheight=1 winwidth=1
exe 'vert 1resize ' . ((&columns * 95 + 95) / 190)
exe 'vert 2resize ' . ((&columns * 94 + 95) / 190)
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 337 - ((0 * winheight(0) + 27) / 54)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
337
normal! 013|
lcd /usr/local/plone-5.1/ploneintranet/dev/quaive.resources.ploneintranet/prototype/patternslib
wincmd w
argglobal
if bufexists('/usr/local/plone-5.1/ploneintranet/dev/quaive.resources.ploneintranet/prototype/patternslib/src/pat/tooltip-ng/tooltip-ng.js') | buffer /usr/local/plone-5.1/ploneintranet/dev/quaive.resources.ploneintranet/prototype/patternslib/src/pat/tooltip-ng/tooltip-ng.js | else | edit /usr/local/plone-5.1/ploneintranet/dev/quaive.resources.ploneintranet/prototype/patternslib/src/pat/tooltip-ng/tooltip-ng.js | endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 93 - ((15 * winheight(0) + 27) / 54)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
93
normal! 096|
lcd /usr/local/plone-5.1/ploneintranet/dev/quaive.resources.ploneintranet/prototype/patternslib
wincmd w
exe 'vert 1resize ' . ((&columns * 95 + 95) / 190)
exe 'vert 2resize ' . ((&columns * 94 + 95) / 190)
tabedit /usr/local/plone-5.1/ploneintranet/dev/quaive.resources.ploneintranet/prototype/patternslib/src/pat/tooltip-ng/tests.js
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winminheight=1 winminwidth=1 winheight=1 winwidth=1
exe 'vert 1resize ' . ((&columns * 94 + 95) / 190)
exe 'vert 2resize ' . ((&columns * 95 + 95) / 190)
argglobal
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 148 - ((41 * winheight(0) + 27) / 54)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
148
normal! 033|
lcd /usr/local/plone-5.1/ploneintranet/dev/quaive.resources.ploneintranet/prototype/patternslib
wincmd w
argglobal
if bufexists('/usr/local/plone-5.1/ploneintranet/dev/quaive.resources.ploneintranet/prototype/patternslib/src/pat/tooltip-ng/tooltip-ng.js') | buffer /usr/local/plone-5.1/ploneintranet/dev/quaive.resources.ploneintranet/prototype/patternslib/src/pat/tooltip-ng/tooltip-ng.js | else | edit /usr/local/plone-5.1/ploneintranet/dev/quaive.resources.ploneintranet/prototype/patternslib/src/pat/tooltip-ng/tooltip-ng.js | endif
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 95 - ((8 * winheight(0) + 27) / 54)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
95
normal! 021|
lcd /usr/local/plone-5.1/ploneintranet/dev/quaive.resources.ploneintranet/prototype/patternslib
wincmd w
exe 'vert 1resize ' . ((&columns * 94 + 95) / 190)
exe 'vert 2resize ' . ((&columns * 95 + 95) / 190)
tabnext 2
set stal=1
if exists('s:wipebuf') && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 winminheight=1 winminwidth=1 shortmess=filnxtToOF
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
