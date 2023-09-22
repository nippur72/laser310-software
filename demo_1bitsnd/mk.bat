zcc +vz demo_1bitsnd.c --list -O2 -create-app -Cz--audio -pragma-string:vzname=1BITSND -o release\demo_1bitsnd.vz 
call laser500wav -i release\demo_1bitsnd.vz -o release\demo_1bitsnd --l310 
call laser500wav -i release\demo_1bitsnd.vz -o release\demo_1bitsnd.turbo4 --l310 --turbo 4 
call laser500wav -i release\demo_1bitsnd.vz -o release\demo_1bitsnd.turbo3 --l310 --turbo 3 
call laser500wav -i release\demo_1bitsnd.vz -o release\demo_1bitsnd.turbo2 --l310 --turbo 2 
call laser500wav -i release\demo_1bitsnd.vz -o release\demo_1bitsnd.turbo1 --l310 --turbo 1 
