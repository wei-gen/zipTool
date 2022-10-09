
var fs = require('fs');  //引入fs模块，对文件进行操作
var archiver = require('archiver'); // archiver可用于普通的打包压缩

export default function compress(dir, zipFileName, password) {
    console.log(dir)
    let zipPath = dir + "\\" + zipFileName
    console.log(__dirname)
    // archiver.registerFormat('zip-encrypted', require("archiver-zip-encrypted"))
    var output = fs.createWriteStream("F:\\111.zip")
    console.log(output)
    // var archive = archiver.create('zip-encrypted',
    //     {
    //         zlib: {
    //             level: 9,//压缩等级
    //         },
    //         encryptionMethod: 'aes256',//加密方法
    //         password: password,//解压密码
    //     }
    // )
    const archive = archiver('zip', {zlib: {level: 9}});
    //对文件夹压缩
    archive.directory('1111/', false)
    //将打包对象与输出流关联
    archive.pipe(output)

    //监听所有archive数据都写完
    output.on('close', function () {
        console.log('压缩完成', archive.pointer() / 1024 / 1024 + 'M')
    });

    archive.on('error', function (err) {
        console.log("压缩失败!");
        throw err;
    });
    //打包
    archive.finalize()

}