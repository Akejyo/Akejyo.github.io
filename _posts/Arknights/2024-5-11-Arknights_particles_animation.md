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

> 看到这个粒子效果，我第一反应是真实的物理模拟，然后我嗯写俩小时加速度写了个抽象玩意出来😎，思路错的很。还好洗澡的时候想明白了（）

### 图片转粒子图

我采用的办法是预设一个 `blockSize` 值作为块的大小，将原图的每 `blockSize*blockSize` 个像素转化成一个粒子：按这个块所有像素的 RGB 平均值来决定是否是一个粒子。

```js
function convertImageToParticles(img) {
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

### 粒子运动

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

### 添加少许细节

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

***

> 2024/5/12 添加了多粒子图转换、图片跟随鼠标

### 粒子图切换

涉及到多个粒子图时，粒子图的转换我是这样搞的：

* 先塞一个新图的粒子数组 `newParticles` ；

* 打乱 `particles` 和 `newParticles`；

* 已存在的粒子直接赋新值，粒子不够的 New 一个 `push` 进去：

  ```js
      shuffle(newParticles);
      shuffle(particles);
      for (var i = 0; i < newParticles.length; i++) {
          if (i >= particleCount) {
              particles.push(newParticles[i]);
          } else {
              particles[i].needed = true;
              particles[i].originalX = newParticles[i].originalX;
              particles[i].originalY = newParticles[i].originalY;
          }
      }
      particleCount = newParticles.length;
  ```

  洗牌打乱：

  ```js
  function shuffle(arr) {
      var currentIndex = arr.length,
          randomIndex;
      while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
          [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
      }
      return arr;
  }
  ```

* 多余的粒子设置其 `needed` 属性为 `false`，在画粒子的部分对这部分粒子特殊处理：速度归零、透明度逐渐下降，下降到 0 时踢掉该粒子。

  ```js
  Particle.prototype.disappear = function() {
      ctx.fillStyle = `rgba(173, 216, 230, ${this.alphaNow -= 0.01})`;
      ctx.fillRect(this.x, this.y, this.size, this.size);
  }
  ```

  ```js
          if (particle.needed) {
              particle.update();
              particle.draw();
          } else {
              particle.speedX = 0;
              particle.speedY = 0;
              particle.disappear();
              if (particle.alphaNow <= 0) {
                  particles.splice(particles.indexOf(particle), 1);
              }
          }
  ```

### 图片平滑跟随鼠标

当鼠标移到列表时，对应的图片的会出现在鼠标下面，并平滑跟随鼠标。

本来我是想利用下 CSS 的 transition 的，没弄出来，最大的问题在于鼠标坐标改变时 transition 的速度要平滑变化过去，不然会有卡顿感。最后还是上了 js。

* 鼠标在 `list` 区域时，图片追着鼠标走，速度设置为与 $\sqrt{distance}$ 成正比；
* 鼠标离开 `list` 区域时，记录离开的坐标点，当鼠标回到 `list` 区域时图片从记录点开始移动。

```js
var imgSpeedRatio = 0.7;
var listItems = document.getElementsByClassName("listItem");
var aniId;
var imgX, imgY;
var lastX, laxtY;

function moveImg(img) {
    var rect = img.getBoundingClientRect(); //get the position of the img
    imgX = rect.left + img.width / 2;
    imgY = rect.top + img.height / 2;
    var distanceX = mouseX - imgX;
    var distanceY = mouseY - imgY;
    var distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

    var speedX = distanceX / Math.sqrt(distance) * imgSpeedRatio;
    var speedY = distanceY / Math.sqrt(distance) * imgSpeedRatio;

    if (lastX != undefined && lastY != undefined && img.style.opacity == 0) {
        img.style.left = (lastX - img.width / 2) + 'px';
        img.style.top = (lastY - img.height / 2) + 'px';
    } else {
        img.style.left = (imgX + speedX - img.width / 2) + 'px';
        img.style.top = (imgY + speedY - img.height / 2) + 'px';
    }
    aniId = requestAnimationFrame(() => moveImg(img));
}

for (let i = 0; i < listItems.length; i++) {
    listItems[i].addEventListener('mousemove', () => {
        var img = listItems[i].getElementsByTagName('img')[0];
        img.style.opacity = 0.7;
        lastX = mouseX;
        lastY = mouseY;
        if (aniId === undefined) { //init
            for (let j = 0; j < listItems.length; j++) {
                var img = listItems[j].getElementsByTagName('img')[0];
                moveImg(img);
            }
        }
    });
    listItems[i].addEventListener('mouseleave', () => {
        var img = listItems[i].getElementsByTagName('img')[0];
        img.style.opacity = 0;
    });
}
```
