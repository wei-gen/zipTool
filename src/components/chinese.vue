<template>
  <div class="chinese">
    <button @click="index">返回主页</button>
    <div class="selecter">
      <div>
        <button type="primary" @click="selectDir()">点击这里选择文件夹目录</button>
      </div>
      <div>
        <input placeholder="请选择目录" v-model="dictorySelected" style="width:500px;" />
      </div>
    </div>
    <div class="chinese1" style="padding: 50px 0 50px 0;">
      <div v-for="(item,i) in pages" :key="i"
        style="display:flex;border: 1px solid red;width: 100%;margin-bottom: 20px;padding: 30px 0 30px 0;">
        <div style="width:3%">第{{i+1}}页</div>
        <div style="width:97%">
          <div style="display:flex;align-items: center;">
            <span>主图：</span>
            <input placeholder="选择图片" v-model="item.primaryImg" style="width:300px;" /><span
              @click="selectImg1(i)">点击选择</span>
            <span style="margin-left:20px">副图：</span>
            <input placeholder="选择图片" v-model="item.ancillaryImg" style="width:300px;" /><span
              @click="selectImg2(i)">点击选择</span>
            <span style="margin-left:20px">拼音：</span>
            <input v-model="item.phoneticizeTxt" />
          </div>

          <div style="margin-top: 30px;display:flex;align-items: center;">
            <span>语种---文本---音频：</span>
            <div class="chinese2" v-for="(val,key,j) in item.langTxts" :key="j">
              <span style="position:absolute;right:0;top:0;cursor: pointer;" title="删除" @click="del(i,key)">X</span>
              <span>{{key}}</span>
              <span style="width:30px;text-align: center;">---</span>
              <span style="max-width:50px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" :title="val">
                {{val}}
              </span>
              <span style="width:30px;text-align: center;">---</span>
              <span v-if="item.audios[key] != undefined && item.audios[key] != ''">{{item.audios[key]}}</span>
              <span v-else>没有mp3</span>
            </div>
            <button @click="addTxtAndAudio(i)">新增</button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <button @click="addPage">增加一页</button>
      <button @click="delLastPage">删除最后一页</button>
      <button @click="zip">点击合成zip</button>
    </div>
    <div class="chinese3" v-if="showFlag">
      <div>
        <span>语种</span>
        <select v-model="key">
          <option v-for="(val,i) in configLang" :key="i" :value="val">{{val}}</option>
        </select>
      </div>
      <div>
        <span>文本：</span>
        <input v-model="phoneticizeTxt" style="width:300px;" />
      </div>
      <div>
        <input v-model="audio" style="width:300px;" />
        <button type="primary" @click="selectMP3()">选择mp3</button>
      </div>

      <div>
        <button @click="confirm()">确定</button>
        <button @click="showFlag = false">取消</button>
      </div>
    </div>
  </div>
</template>

<script>

const dialog = require('electron').remote.dialog
const fs = require("fs")

export default {
  name: 'chinese',
  data() {
    return {
      showFlag: false,
      dictorySelected: '',
      isLoading: false,
      tableData: [],
      pages: {},
      phoneticizeTxt: '',
      key: '',
      audio: '',
      index: -1,
      configLang: [],
    }
  },
  created() {
    this.pages = [
      {
        phoneticizeTxt: '',
        primaryImg: '',
        ancillaryImg: '',
        langTxts: {
        },
        audios: {
        }
      },
    ]

    const { remote } = require('electron');
    
    var path = require('path');
    console.log(__dirname)
    var exePath = path.dirname(remote.app.getPath('exe')) + '\\lang.txt';
    // console.log(exePath);
    fs.readFile(exePath, (err, data) => {
      if (err) {
        alert(err)
        return
      }
      this.configLang = data.toString().split(',')
    })
  },
  methods: {
    zip() {
      let da = [];
      this.pages.forEach(element => {
        let d = {}

        d.img = element.primaryImg.substr(element.primaryImg.lastIndexOf("\\") + 1)
        d.ancillaryImg = element.ancillaryImg.substr(element.ancillaryImg.lastIndexOf("\\") + 1)
        d.phoneticize = element.phoneticizeTxt
        Object.keys(element.langTxts).forEach(key => {
          d[key] = element.langTxts[key]
        })
        Object.keys(element.audios).forEach(key => {
          let name = element.audios[key]
          d[key+'Path'] = name.substr(name.lastIndexOf("\\") + 1)
        })
        da.push(d);
      })
      let config = {
        "onceRow": 10,
        "data": da
      }
      fs.writeFile(this.dictorySelected + '\\config.json',JSON.stringify(config),'utf-8',(err,data) =>{
        if(err) throw err
        console.log("写入成功" + data)
      })
      
    },
    selectImg1(i) {
      dialog.showOpenDialog({ properties: ['openFile'] }).then(result => {
        this.pages[i].primaryImg = result.filePaths[0]
      })
    },
    selectImg2(i) {
      dialog.showOpenDialog({ properties: ['openFile'] }).then(result => {
        this.pages[i].ancillaryImg = result.filePaths[0]
      })
    },
    addPage() {
      this.pages.push({
        phoneticizeTxt: '',
        primaryImg: '',
        ancillaryImg: '',
        langTxts: {
        },
        audios: {
        }
      })
    },
    delLastPage() {
      if (this.pages.length == 1) {
        alert("只剩一页不能删除")
        return
      }
      this.pages.pop()
    },
    addTxtAndAudio(i) {
      this.index = i
      this.showFlag = true
    },
    confirm() {
      if (this.index < 0) {
        alert("程序错误")
      }
      if (this.pages[this.index] == undefined) {
        alert("程序错误")
      }
      this.pages[this.index].langTxts[this.key] = this.phoneticizeTxt
      this.pages[this.index].audios[this.key] = this.audio
      this.showFlag = false
      this.index = -1
      this.phoneticizeTxt = ''
      this.audio = ''
    },
    selectDir() {
      dialog.showOpenDialog({ properties: ['openDirectory'] }).then(result => {
        this.dictorySelected = result.filePaths[0]
      })
    },
    selectMP3() {
      dialog.showOpenDialog({ properties: ['openFile'] }).then(result => {
        this.audio = result.filePaths[0]
      })
    },
    index() {
      this.$router.push('/')
    },
    del(i, key) {
      delete this.pages[i].langTxts[key]
      delete this.pages[i].audios[key]
    }
  }
}
</script>

<style scoped>
.chinese {
  width: 100%;
  height: 100%;
  text-align: left;
}

.chinese2 {
  margin-right: 20px;
  border: 1px solid red;
  padding: 15px;
  display: flex;
  align-items: center;
  position: relative;
}

.chinese3 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background-color: white;
  border: 1px solid red;
}
</style>
