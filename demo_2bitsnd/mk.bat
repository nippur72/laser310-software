zcc +vz demo_2bitsnd.c --list -O2 -create-app -Cz--audio -pragma-string:vzname=2BITSND -o release\demo_2bitsnd.vz 
call laser500wav -i release\demo_2bitsnd.vz -o release\demo_2bitsnd --l310 
call laser500wav -i release\demo_2bitsnd.vz -o release\demo_2bitsnd.turbo4 --l310 --turbo 4 
call laser500wav -i release\demo_2bitsnd.vz -o release\demo_2bitsnd.turbo3 --l310 --turbo 3 
call laser500wav -i release\demo_2bitsnd.vz -o release\demo_2bitsnd.turbo2 --l310 --turbo 2 
call laser500wav -i release\demo_2bitsnd.vz -o release\demo_2bitsnd.turbo1 --l310 --turbo 1 
