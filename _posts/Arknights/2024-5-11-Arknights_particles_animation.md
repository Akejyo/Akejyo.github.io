---
title: 复刻明日方舟官网粒子特效
date: 2024-5-11
categories: [Recreation, FrontEnd]
tags: [FrontEnd]
math: true
image:
  path: /img/image-20240511020055621.png

---

# 复刻明日方舟官网粒子特效

原版：[明日方舟 - Arknights (hypergryph.com)](https://ak.hypergryph.com/#world)

我的：[Arknights_particle_animation (akejyo.github.io)](https://akejyo.github.io/Arknights_partical_animation/)

> 看到这个粒子效果，我第一反应是真实的物理模拟，然后我嗯写俩小时加速度写了个抽象玩意出来😎，洗澡的时候突然想明白了，好像可以简化一下

第一步要做的是把图片转换成我们要操作的粒子图。我采用的办法是预设一个 `blockSize` 值作为块的大小，将原图的每 `blockSize*blockSize` 个像素转化成一个粒子：按这个块所有像素的 RGB 平均值来决定是否是一个粒子。

```js
img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {// rgb 取平均
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var blockX = Math.ceil(canvas.width / blockSize);
    var blockY = Math.ceil(canvas.height / blockSize);
    for (var y = 0; y < blockY; y++) {
        for (var x = 0; x < blockX; x++) {
            var sum = 0;
            for (var j = 0; j < blockSize; j++) {
                for (var i = 0; i < blockSize; i++) {
                    var index = ((y * blockSize + j) * canvas.width + x * blockSize + i) * 4;
                    sum += data[index]; //红色通道，前面已经处理成灰度
                }
            }
            var average = Math.floor(sum / (blockSize * blockSize));
            if (average > 128) {
                particles.push(new Particles(x*7, y*7)); //乘一个数使得粒子之间有间隔
            }
        }
    }
}
```

***

接下来最核心的问题：粒子与鼠标之间的斥力，以及粒子趋向复位受到的引力。

粒子复位的速度是越来越慢的，可以用距离除上一个固定值来模拟；斥力直接用距离的反比例函数模拟。

* 首先给每个粒子记录其原始坐标 `originalX`、`originalY`，由当前粒子的实时坐标 `x`、`y`，直接计算坐标差，除一个固定值得到当前状态的复位速度：

  ```js
          var dToOriginalX = particle.x - particle.originalX;
          var dToOriginalY = particle.y - particle.originalY;
          particle.speedX = -dToOriginalX / 30;
          particle.speedY = -dToOriginalY / 30;
  ```

* 监听获得鼠标的坐标，计算与粒子之间的距离，取倒数得到斥力，乘一个 `forceRatio` 调整大小，叠加到粒子的速度上：

  ```js
              var dx = particle.x - mouseX;
              var dy = particle.y - mouseY;
              var distance = Math.sqrt(dx * dx + dy * dy);
              var force = 1 / distance;
              force = Math.min(force, 5);
  
              particle.speedX += dx / distance * force * forceRatio;
              particle.speedY += dy / distance * force * forceRatio;
              particle.speedX = Math.min(particle.speedX, 5);
              particle.speedY = Math.min(particle.speedY, 5);
  ```

这样做的话，距离鼠标较近的粒子是完全过不来的，当鼠标远离时，粒子可以较丝滑的复位。

***

一些小细节：

1. 随机初始化粒子的的坐标，这样加载粒子图时粒子会四面八方聚集到正确位置，比较有观赏性；

2. 给粒子一个带有随机的 `alpha` 属性作为最终透明度，可以让最后的图案有变化感；

   ```js
   function Particles(x, y) {
       this.x = Math.random() * window.innerWidth;
       this.y = Math.random() * window.innerHeight;
   ...
       this.alpha = 1 - Math.random() * randomRatio;
       this.alphaNow = 0;
   }
   ```

3. 给粒子一个 `alphaNow` 属性作为当前透明度，可以在最开始加载的时候让这个值逐渐加到 `alpha`，这样视觉上有个由暗到明的渐变，具体在粒子的 `draw` 方法；

   ```js
   Particles.prototype.draw = function() {
       ctx.fillStyle = `rgba(173, 216, 230, ${this.alphaNow + 0.005 > this.alpha ? this.alpha : this.alphaNow += 0.005})`;
       ctx.fillRect(this.x, this.y, this.size, this.size);
   }
   ```

4. 与随机透明同理，最终坐标也可以上随机，具体在作粒子图的部分调整

   ```js
   img.onload = () => {
   		...   
               if (average > 128) {
                   particles.push(new Particles((x + Math.random() * randomRatio) * 7, (y + Math.random() * randomRatio) * 7));
               }
          ...
   }
   ```

