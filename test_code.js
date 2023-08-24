
const fs = require('fs');


const stream = require('stream');

class BufferReadable extends stream.Readable {
  constructor(buffer, options) {
    super(options);
    this.myBuffer = buffer;
    this.currentPointer = 0;
  }

  _read(size) {
    if (this.currentPointer >= this.myBuffer.length) {
      this.push(null);
      return;
    } else {
      const chunk = this.myBuffer.slice(this.currentPointer, this.currentPointer + size);
      this.currentPointer += size;
      this.push(chunk); // Push the chunk into the stream
    }
  }
}

async function writeBinaryFile(fname="text.txt", buff=Buffer.allocUnsafe(3)) {
  await new Promise((resolve, reject) => {
      let readStream = new BufferReadable(buff);

      let writableStream = fs.createWriteStream(fname);
      writableStream.on("finish",()=>{
        resolve();
      })

      readStream.pipe(writableStream);
  });
} 

async function readChunkOfFile(filePath, startByte, endByte){
        let chunkSize = endByte-startByte;
        let myBuffer = Buffer.allocUnsafe(chunkSize);
     try{
        let fileDescriptor = await fs.promises.open(filePath,"r");
         await fileDescriptor.read(myBuffer,0,chunkSize,startByte);
         await fileDescriptor.close(fileDescriptor);
         return myBuffer;
     }catch(e){
      console.log(e);
     }
}

async function readIndexTable(fileDescriptor){
   try{
      //read an offsetOfDataBlock - it is an offset to data
      // i is also a length of index table
      let tableSizeBuf = Buffer.allocUnsafe(8);
      await fileDescriptor.read(tableSizeBuf, 0, 8, 0);
    let tableSize = tableSizeBuf.readBigUInt64BE(0);
    let tableBuffer = Buffer.allocUnsafe(Number(tableSize));
      //read all the table
    await fileDescriptor.read(tableBuffer,0, Number(tableSize), 0);
    return tableBuffer;
   } catch(e) {
    console.log(e);
   }
}

async function readAndDecodeItem (fileDescryptor, indexTable=Buffer.allocUnsafe(1),
                                 arrayForReading=Buffer.allocUnsafe(1), numberOfItem=1 ) {
                                    try {
                                          let offsetOfData = indexTable.readBigUInt64BE(0);
                                          const firstIndexOffset = BigInt(8);
                                          let offsetOfItem, sizeOfItem;
                                          //read in according to item`s number
                                          offsetOfItem = offsetOfData + indexTable.readBigUInt64BE(Number(firstIndexOffset + BigInt(numberOfItem*16)));
                                          sizeOfItem = indexTable.readBigUInt64BE(Number(firstIndexOffset + BigInt(numberOfItem*16)) + 8 );
                                          const {bytesRead} = await fileDescryptor.read(arrayForReading, 0, Number(sizeOfItem), Number(offsetOfItem));
                                          let strBuffer = arrayForReading.slice(0, bytesRead);
                                          strBuffer = strBuffer.toString("utf-8");
                                          return JSON.parse(strBuffer);
                                    } catch(e) {
                                          console.log(e);
                                    }
                                  
                                 }

/****
FILE:FORMAT:
-------begin-of-file--------
(0)  Uint64BE offsetOfDataBlock;   //pointer to the begin of data
(8)  uint64BE amountOfCells;      
(16) uint64BE offsetOfCell_0; uint64BE sizeOfCell_0;
(32) uint64BE offsetOfCell_1; uint64BE sizeOfCell_1;
...
 uint64BE offsetOfCell_last; uint64BE offsetOfCell_last;
  raw_binary_JSON_data;
---end-of-file--------------
 */



function serializeArray(inpArray){
  let outputData;
  ///array for binary repr of cells
  let offsetsAndSizesOfCells =[];
  ///array of offset+size
  let binaryCellsRepresentations= [];
   //include the size of  first parameter
  let offsetOfDataBlock = 8;
  //pointer to a cell 
  let relativePointer = 0;
  let idx=0
  for (; idx < inpArray.length; idx++) {
      ///prepare buffers

        let offsetOfCell = Buffer.allocUnsafe(8);
        let sizeOfCell = Buffer.allocUnsafe(8);
        let jsonRepr = JSON.stringify(inpArray[idx]);
        let binaryRepr = Buffer.from(jsonRepr,"utf-8");
        ///length
        sizeOfCell.writeBigUInt64BE(BigInt(binaryRepr.length));
        //relative offset (witout index part of a`index part of file)        
        offsetOfCell.writeBigUInt64BE(BigInt(relativePointer));
        ///modify pointer - add size of data in cell
        relativePointer += binaryRepr.length;
        //write in arrays
        binaryCellsRepresentations.push(binaryRepr);
        //
        offsetsAndSizesOfCells.push(Buffer.concat([offsetOfCell,sizeOfCell]));


    }

    offsetOfDataBlock += idx*16;
   //convert to binary:
    let offsetDataOfBlockBinary =  Buffer.allocUnsafe(8);
    offsetDataOfBlockBinary .writeBigUInt64BE(BigInt(offsetOfDataBlock));

    outputData = Buffer.concat([
      offsetDataOfBlockBinary,
      ...offsetsAndSizesOfCells,
      ...binaryCellsRepresentations
    ]);


  return outputData;

}

///let myData = serializeArray([{a:123},{b:456},{c:789}]);

async function main(){
 let binaryRepr =  serializeArray([{one:"Marry"},{two:"has"},{three:"a little"},{four:"lamb"}]);
 // await writeBinaryFile("myfile",binaryRepr);
  let mainBuffer = Buffer.allocUnsafe(1024);
  let fileDescr = await fs.promises.open("myfile","r");
  let table = await readIndexTable(fileDescr);
  let item = await readAndDecodeItem(fileDescr,table,mainBuffer,1);

}

main();
