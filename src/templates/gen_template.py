#!/usr/bin/env python3

from jinja2 import Template
import glob,os,time,sys
from pathlib import Path

files = glob.glob(__file__.replace('gen_template.py','')+'*.html')
apps = [Path(path).stem for path in files]

print('Watching:',apps)

# [os.system('touch %s.%s'%(app,ext)) for ext in 'html css js'.split()]

tm = Template(
'''
<!-- Script autogenerated by Svelte-Jinja (author: Dan Ellis) -->

<!-- Use templates folder to update -->


<main>
    {{body}}
</main>


<script>
    {{globals}}
</script>


<style>
    {{stylesheet}}
</style>

''')


watching = [ [app,glob.glob(__file__.replace('gen_template.py','')+app+'.*')] for app in apps]

updated = [0]*len(watching)


while True:

    count = 0
    for app,watch in watching:
        new = max([int(os.popen('date -r %s +%s'%(x,'%s')).read()) for x in watch])

        if new != updated[count]:
            print('Updating',app,new)
            code = tm.render(globals=open(app+'.js','r').read(), body = open(app+'.html','r').read(),stylesheet=open(app+'.css','r').read())
            # print(app,code)

            loc = '../'
            if ':' in app:
                split = app.split(':')
                loc += split[0]+'/'
                app = split[1]

            with open('%s%s.svelte'%(loc,app),'w') as f:
                f.write(code)

            updated[count]= new
            # os.system('touch ../App.svelte')

        count+=1


    time.sleep(4)
