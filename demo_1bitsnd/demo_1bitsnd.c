#include <stdio.h>
#include <arch/vz.h>

typedef unsigned char byte;
typedef unsigned int  word;

#define FASTCALL __z88dk_fastcall
#define FASTNAKED __z88dk_fastcall __naked
#define NAKED __naked

#define LATCH_DEFAULT 24

void show_rick() FASTNAKED {
   __asm

   ld de, 0x7000
   ld hl, image_data
   ld bc, 2048
   ldir
   ld a, $ff
   ret

image_data:
   ;INCBIN "image_rick0.bin"
   INCBIN "image_rick1.bin"
   __endasm;
}

// speaker b0,b5

void play_1_bit_sample() {
   __asm

   di

loop_audio:
   ld hl, audio_data

get_next_audio_data:
   ld a, (hl)
   ld c, a   

   // play bit 0
   call pop_bit   
   ld ($6800), a 
   call delay   
   // play bit 1
   call pop_bit   
   ld ($6800), a 
   call delay
   // play bit 2
   call pop_bit   
   ld ($6800), a 
   call delay
   // play bit 3
   call pop_bit   
   ld ($6800), a 
   call delay
   // play bit 4
   call pop_bit   
   ld ($6800), a 
   call delay
   // play bit 5
   call pop_bit   
   ld ($6800), a 
   call delay
   // play bit 6
   call pop_bit   
   ld ($6800), a 
   call delay
   // play bit 7
   call pop_bit   
   ld ($6800), a 
   call delay

   inc hl

   ; if hl <> end_audio_data then jr get_next_audio_data else jr loop_audio
   push hl
   ld de, end_audio_data
   and a
   sbc hl, de
   pop hl
   jr nz, get_next_audio_data 
   jr loop_audio   
      
pop_bit:     
   ld a, c         ; get audio data to from C
   ld b, 0         ; reset working value
   rra             ; C = sample0
   rl  b           ; B.0 = sample0
   sla b           ; B.1 = sample0
   sla b           ; B.2 = sample0
   sla b           ; B.3 = sample0
   sla b           ; B.4 = sample0
   ccf             ; C = ~c
   rl b            ; B.5 = sample0; B.0 = ~sample0
   ld c, a         ; save audio data to C
   ld a, b         ; A.5 = sample0; A.0 = ~sample0
   or 8            ; other bits (video mode) in I/O latch
   ret

delay:   
   ld b, 10        ; that results in 6066 Hz  
delay_count:
   djnz delay_count   
   ret

audio_data:
   INCBIN "audio_data.bin"   
   ;defs 8192, $A8 ; test
end_audio_data:
   __endasm;
}

void main() {
   vz_mode(1);
   show_rick();
   play_1_bit_sample();   
}
