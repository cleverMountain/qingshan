1. 最近的项目中遇到一个语音播报的功能，通过查询知道可以通过Web Speech API中的SpeechSynthesisUtterance构造函数实现。
- 通过new的方式创建一个SpeechSynthesisUtterance对象
- 属性：lang设置语言，volumn设置音量，pitch设置音调，rate设置语速
- 事件：speak播放，end结束
- 监听事件：start监听开始，pause监听暂停，error错误触发
```html
<!DOCTYPE html>
<html>

<head>
  <title>语音播报示例</title>
</head>

<body>
  <button onclick="speakText()">点击这里以播报文本</button>
  <input type="text" id="textToSpeak" placeholder="输入要播报的文本">
  <script>
    function createUtterance(options) {
      const { lang, volume, pitch, rate } = options || {
        lang: "zh-CN",
        volume: 1.0,
        pitch: 1.0,
        rate: 1.0
      }
      const utterance = new SpeechSynthesisUtterance()
      utterance.lang = lang; // 设置语言为英语（中文）
      utterance.volume = volume;   // 设置音量（0.0 到 1.0）
      utterance.pitch = pitch;    // 设置音调（0.0 到 2.0，1.0表示正常音调）
      utterance.rate = rate;     // 设置语速（0.1 到 10.0，1.0表示正常语速
      return utterance
    }
    const utterance = createUtterance()
    // console.log(utterance)
    // 函数用于播报输入框中的文本
    function speakText() {
      var text = document.getElementById("textToSpeak").value;
      if (text) {
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
      }
    }
  </script>
</body>

</html>
```