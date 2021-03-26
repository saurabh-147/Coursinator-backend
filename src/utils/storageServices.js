const { bucket } = require('./db');
exports.uploadFile = async (folder,format,blob,userId)=>{
  console.log('uploadFile starts ',`${folder}/${userId}.${format}`)
  let file =  bucket.file(`${folder}/${userId}.${format}`)
  
  await file.save(blob, {
    metadata: {
      firebaseStorageDownloadTokens:userId,
    }
  })
  await file.makePublic(); 
  console.log("public url ",file.publicUrl());
  return file.publicUrl();

}