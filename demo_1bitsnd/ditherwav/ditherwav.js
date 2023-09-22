const fs = require("fs");
const WavEncoder = require("wav-encoder");
const WavDecoder = require("wav-decoder");

function writeWav(samplearr, fileName, sampleRate) {
   let s = samplearr.map(arr=>new Float32Array(arr));

   const wavdata = {
      sampleRate,
      channelData: s
   };      
   const buffer = WavEncoder.encode.sync(wavdata);
   fs.writeFileSync(fileName, Buffer.from(buffer));
}

function writeDat(samples) {

   let arr = [];

   let quant = samples.map(s=>{
           if(s === -1.0) return 0b0;
      else if(s ===  1.0) return 0b1;
      else return 0b00;
   });

   for(let t=0;t<quant.length-8;t+=8) {
      let b = (quant[t+0]<<0) | 
              (quant[t+1]<<1) |
              (quant[t+2]<<2) |
              (quant[t+3]<<3) |
              (quant[t+4]<<4) |
              (quant[t+5]<<5) |
              (quant[t+6]<<6) |
              (quant[t+7]<<7);

      arr.push(b);
   }
   
   fs.writeFileSync("../audio_data.bin", new Uint8Array(arr));
}

function dither(samples, coeffs, multiplier) {
   const work = [...samples];

   for(let t=0; t<work.length-coeffs.length-1;t++) {
      let v = work[t];
      let q = v > 0 ? 1.0 : -1.0;
      let err = v-q;

      // spread error
      work[t] = q;
      for(let j=0;j<coeffs.length;j++) {
         work[t+1+j] += err * coeffs[j] * multiplier;
      }
   }
   return work;
}

function main() {
   const f = "../sourcewav/nevergonna_mono_amplified_12000.wav";
   const data = fs.readFileSync(f);
   const audioData = WavDecoder.decode.sync(data);
   const samples = audioData.channelData[0];     
   const sampleRate = audioData.sampleRate;   
   
   let f8 = [8/36, 7/36, 6/36, 5/36, 4/36, 3/36, 2/36, 1/36];
   let f4 = [7/16, 5/16, 3/16, 1/16];
   let f3 = [5/8, 2/8, 1/8];
   let f2 = [4/5, 1/5];
   let f1 = [1/8];
   let f0 = [];
   
   let multiplier = 1.0;

   let all_samples = [
      dither(samples, f8, multiplier),      
      dither(samples, f4, multiplier),      
      dither(samples, f3, multiplier),      
      dither(samples, f2, multiplier),            
      dither(samples, f1, multiplier),            
      dither(samples, f0, multiplier),            
      samples
   ];
   
   writeWav(all_samples, "../sourcewav/dither.wav", sampleRate);
   writeDat(dither(samples, f1, multiplier));
}

main();

/*

// this noise dithering, according to ChatGPT

function convertTo1Bit(audioSamples) {
  const numSamples = audioSamples.length;
  const outputSamples = new Array(numSamples);

  let prevError = 0;

  for (let i = 0; i < numSamples; i++) {
    const inputSample = audioSamples[i];
    
    // Add dithering noise
    const noise = Math.random() * 2 - 1; // Generate random noise between -1 and 1
    const noisySample = inputSample + noise;

    // Apply 1-bit quantization
    const quantizedSample = noisySample > prevError ? 1 : -1;

    // Calculate the quantization error
    const error = inputSample - quantizedSample;

    // Update the previous error for noise shaping
    prevError = error;

    // Store the quantized sample in the output array
    outputSamples[i] = quantizedSample;
  }

  return outputSamples;
}

// Example usage:
const sixteenBitAudio = [...]; // Replace with your 16-bit audio waveform
const oneBitAudio = convertTo1Bit(sixteenBitAudio);
*/