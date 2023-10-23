---
title: "Little Vampire"
date: 2022-7-1
tags:
  - C#
  - Unity
---

Unity制作2D小游戏

<!-- more -->

# Day1

尝试一天速通C#

前面的都好办，和C++啥的都大差不差，后面的给我看的云里雾里，要用的话再看吧

然后为了练练手去cf上找了俩简单题写

1594A，下面是用三种语言写的差别：

![wtf1](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/wtf1.png)

![t2](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/t2.png)

![wtf3](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/wtf3.png)

乐

然后还有一道1709B：

 ![wtf4](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/wtf4.png)

![wtf5](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/wtf5.png)

只能说差距显著

C#读入数据真的很不方便，对于一次输入很多数据，中间用空格间隔的那种，C#基本就废了

最后我是Console.ReadLine()一整行，然后另定义了一个string[]，把读入的一整行Split了，然后遍历一遍Convert到数组里

就离谱啊🙃

下面是1709B用C#写的屎山

```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace cftime
{
    class Helloworld
    {
        static void Main(string[] args)
        {
            int t;
            t = 1;
            long[] a = new long[200005];
            long[] dam = new long[200005];
            long[] dam2 = new long[200005];
            //t = Convert.ToInt32(Console.ReadLine());
            while (t != 0)
            {
                t--;
                int n, m;
                string wtf = Console.ReadLine();
                string[] wocao = wtf.Split();
                n = Convert.ToInt32(wocao[0]);
                m = Convert.ToInt32(wocao[1]);
                wtf = Console.ReadLine();
                wocao = wtf.Split();
                for (int i = 1; i <= n; i++)             
                    a[i] = Convert.ToInt64(wocao[i - 1]);
                for(int i = 2; i <= n; i++)
                {
                    if (a[i] <= a[i - 1])
                        dam[i] += a[i - 1] - a[i];
                    dam[i] += dam[i - 1];
                }
                for(int i = n - 1; i >= 1; i--)
                {
                    if (a[i] <= a[i + 1])
                        dam2[i] += a[i + 1] - a[i];
                    dam2[i] += dam2[i + 1];
                }
                while (m-- != 0)
                {
                    int l, r;
                    wtf = Console.ReadLine();
                    wocao = wtf.Split();
                    l = Convert.ToInt32(wocao[0]);
                    r = Convert.ToInt32(wocao[1]);
                    if (l <= r)
                        Console.WriteLine("{0}", dam[r] - dam[l]);
                    else
                        Console.WriteLine("{0}", dam2[r] - dam2[l]);
                }
            }
        }
    }
}


```

# Day2

找了很多Unity教程，我最开始的想法是直接找一个像素rpg的教程，方便我自己写~~抄~~。在b站翻了半天也没有称心的. 最后还是选了一个普通的2d横板游戏的教程（BV1W4411Z7UC），希望我看完后能写小rpg.

讲的很细，跟着做的时候基本没有出现问题. 今天跟着视频做了素材导入/画地图/图层/角色的左右朝向and水平移动and跳跃下落.

### **素材导入**：

​	去Assets store下载，导就完事了.

### **画地图**：

1. 左侧SampleScene创建2D Object→Tilemap；顶部栏的Window→2D→Tile Palette打开一个窗口，之后要把背景素材导入进去（记得新建一个map文件夹）.

2. 导入素材前，需要把素材分割成单元，方便更好的绘图：点击素材的tileset→右侧inspector里的Sprite Mode调成Multiple→点击Sprite Editor进入编辑界面→顶部栏Slice的Type换成Grid By Cell Size，Pixel Size取俩16(因为我们的一个Unit取的是16个像素).

3. 分割好后把素材拖到Tile Palette里，就可以在Scene里画图了.

   ![d2_1](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d2_1.png)

   ![d2_2](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d2_2.png)

### **图层**：

​	地图和背景需要分图层。

1. Sorting Layer的下拉菜单里点Adding Sorting Layer，在里面建俩Sorting Layer：Background和Frontground。回到原菜单，给地图和背景选择Sorting Layer，选项里越靠下的越在前面.

   ![d2_3](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d2_3.png)

2. 也可以调Order in Layer.

### **Player**：

1. 导进来，Inspector的Rigibody 2D里把刚体的Freeze Rotation给选上，否则后面移动的时候会鬼畜.

2. Inspector下Add Component添加Capsule Collider 2D，这里教程用的是Box Collider 2D，但是好像有点问题. 点击一下Edit Collider调整碰撞体

3. 同时还要给地图加碰撞体. 在Tilemap里Add Compoment 2D添加Tilemap Collider 2D

4. 接下来要写移动，有关移动的名称/按键在顶部栏Edit→Project Setting→Input Manager里的Axes里查看. Player里Add组件Script，建议创一个Script文件夹把所有Script都放进去. 下面开始写码

   * **移动：**

     首先要声明很多

     ```
       	public Rigidbody2D rb;//Player
         public Animator anim;//动画
         public Collider2D coll;//Player 碰撞体
         public float speed;//移速
         public float jumpforce;//跳跃
         public LayerMask ground;//地图的碰撞体
     ```

     这里要注意在Inspector里给设置一下，拖拽就行

     ![d2_4](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d2_4.png)

     下面是函数部分

     ```
     void Movement()
         {
             float horizontalmove = Input.GetAxis("Horizontal");//会获得-1~1的值
             float facedircetion = Input.GetAxisRaw("Horizontal");//会获得-1、0、1中的一个值
             if (horizontalmove != 0)//水平移动
             {
                 rb.velocity = new Vector2(horizontalmove * speed, rb.velocity.y);
                 anim.SetFloat("running", Mathf.Abs(facedircetion));
             }
             //player朝向
             if (facedircetion != 0)        
                 transform.localScale = new Vector3(facedircetion, 1, 1);
             // 跳跃
             if (Input.GetButtonDown("Jump"))
             {
                 rb.velocity = new Vector2(rb.velocity.x, jumpforce);
                 anim.SetBool("jumping", true);
             }
         }
     ```

   * **动画：**

     * Player里Add组件Animator，创建文件夹Assets→Animation→Player→Player(前面的都是文件夹，这个是Animator Controller)，拖拽这个Controller到Player的Script里（上面有图显示了）

     * Window→Animation→Animation打开时间轴窗口，创建动画idle，把idle每一帧都导进去，调整时间。再开一个窗口：Window→Animation→Animator，这里能连线，做细节. 添加新动画，先在SampleScence里选中Player，然后就在时间轴那个窗口里添加就行.

     * 动画的转换，可见下图

       ![d2_5](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d2_5.png)

       这里要设置连线的Conditions设置，如jump到fall的线是falling is true && jumping is false，falling和jumping是在左侧Parameters里设置的bool量。

       对于跳跃动画，fall转idle需要判断是否落地，也就是判断Player的碰撞体下端碰到地图的碰撞体了，得先设置一下地图的碰撞体. 

       地图Inspector里的Layer新建一个![d2_6](E:\_public\2d_1-7\d2_6.png)

       Player的Script也要设置一下（上面的一个图里有），其余就是看代码。

     * ```
           void SwitchAnim()//切换动画这里结合Animator看
           {
               anim.SetBool("idle", false);
               if (anim.GetBool("jumping"))
               {
                   if (rb.velocity.y < 0)
                   {
                       anim.SetBool("jumping", false);
                       anim.SetBool("falling", true);
                   }
               }
               else if (coll.IsTouchingLayers(ground))//判断是否触地
               {
                   anim.SetBool("falling", false);
                   anim.SetBool("idle", true);
               }
           }
       ```

全图：

![d2_7](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d2_7.png)

# Day3

### **镜头跟随**：

1. 普通的办法是：给Main Camera新建一个Script，在里面获取Plaer的transform并Update到Main Camera.

   ```
       public Transform player;
       void Update()
       {
           transform.position = new Vector3(player.position.x, player.position.y, -10f); 
       }
   ```

   更方便，效果更好的方法是利用Cinemachine的2D Camera. 在右侧SampleScene新建Cinemachine→2D Camera，将其Follow设置为Player即可. 在Body里有不少东西可以调整. 

2. 背景图ctrl+d复制几个拉长，新建Create Empty把所有的背景图都拉进去，给BackGround添加Polygon Collider 2D组件，调整边框到背景图的边界，勾上"Is Trigger"，拖到摄像头的Bounding Shape 2D里，这样做可以使摄像头不会超出背景图，即会被背景的碰撞体约束. 

3. 镜头会**晃动**，有解法是把 CinemachineVirtualCamera 里三个轴的Damping都设置成0，我试了确实可以，但是镜头移动没有平滑感了，不大行. 最后改了CinemachineBrain里的Update Method为Fixed Update，效果很好. 

### **物品收集**：

1. 先是添加物品及加动画：新建Sprite，添加Animator组件，在文件夹Animation里新建Collections文件夹，里面新建Animator Controller，拖拽到Animator里. 新建Animation并加上动画.

2. 给物件添加Box Collider 2D组件，勾选"Is Trigger".

3. 给物件添加Tag："Collection"，在Player Controller的脚本里添加函数.

   ```
       private void OnTriggerEnter2D(Collider2D collision)
       {
           if(collision.tag == "Collection")
           {
               Destroy(collision.gameObject);
               Cherry++;
           }
       }
   ```

   即Player与物件碰撞后销毁物件并计数.

4. Assets里新建文件夹Perfabs(预制品)，把SampleScene里的物件拖进去，这样方便使用. 

### **跳跃部分的修改**：

1. 解决撞墙不掉落的问题：在Assets里新建物理材质Physics Material 2D，Friction调成0，拖到Player的碰撞体里. Player在斜坡上会滑，可以用俩碰撞体来解决. 

2. 我稍微改了一点教程里的，添加了从idle到fall的箭头，毕竟这是可能出现的情况.

3. 解决无限跳的问题：判定触地了才能跳.

   ```
      if (Input.GetButtonDown("Jump")  && coll.IsTouchingLayers(ground))
   ```

4. 动画延迟，在线那里的has exit time取消掉.

### **下蹲**：

1. 导动画素材.

2. 按下S时把Player头部的碰撞体给取消掉，这样Player只有下面的碰撞体，可以穿过一格小的空间. 

   ```
           ...
           public Collider2D Crouchcoll;
           ...
           if (Input.GetKey(KeyCode.S))
           {
               speed = 6f;//蹲下的时候速度当然慢啦
               Crouchcoll.enabled = false;//取消头部碰撞体
               anim.SetBool("crouch", true);
           }
           else
           {
               speed = 12f;
               anim.SetBool("crouch", false);
               Crouchcoll.enabled = true;
           }
   ```

### **物品收集数量显示**：

1. SampleScene里新建UI→Canvas，里面新建UI→Legacy→Text. 分为不变的和变化的文本.

2. 双击Canvas，调整text，尤其要注意定位![d3_1](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d3_1.png)

3. 改一下脚本.

   ```
   ...
   public Text CherryNum;
   ...
    private void OnTriggerEnter2D(Collider2D collision)//收集物品
       {
           if(collision.tag == "Cherry")
           {
               Destroy(collision.gameObject);
               Cherry++;
               CherryNum.text = Cherry.ToString();
           }
        
       }
   ```

4. 在Player的脚本里把Text拖过去.

留个全图~

![d3_2](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d3_2.png)

# Day4

### **敌人(青蛙)**：

1. 导模型、加动画. 

2. 设置为刚体，添加碰撞体. 

3. 简易AI：

   ​		■ 教程里的普通青蛙：

   * 给青蛙建个脚本. 

   * 在Frog下新建俩标签，分别为Left和Right，上个色看着清楚![d4_1](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d4_1.png)  ，我们希望青蛙可以在范围内左右移动. 

   * 这两个标签的坐标会跟着Frog（其父亲）移动，所以在Start()里先获取标签的下标后保存起来. 

   * 判断青蛙与标签的坐标关系，更改图像和速度的方向. 

     ■ 为啥说这是普通青蛙呢，这样的青蛙除了有idle的鼓嘴动作之外，就是很无聊的左右平移啊，素材里有jump的素材，可以利用一下. 

   * 各种游戏里青蛙移动方式似乎都是站着不动一会，然后跳一下，我们要实现的也是这样的. 

   * 首先得给青蛙弄个计时器. 

     ```
         public float times;
         public float clock = 3f;
     ```

     先给times赋初值clock，在Update()里让times每次更新都-Time.deltaTime，也就是系统一个时间，当times<0时在给times赋值clock，这样就做出循环了. 

   * times<0时，把anim的jump给开了，然后给青蛙速度赋个值、水平和竖直方向都要有. 竖直方向速度为负数时把anim的fall打开，触底时idle打开，关其他俩，同时速度归零. 

   * 图像转向的部分，要判断是触地了才能转向，否则在空中图像变了速度方向没变就很鬼畜...

   效果图：

   ![d4_2](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d4_2.png)

   ​	■ 后来我发现我做的这些都在后面的教程里有？好离谱...包括我做的那个从idle到fall的转化. 这青蛙的码塞到最后吧，好歹花了我不少时间.

   ​	■ 后面教程做的青蛙跳跃是用了event来延长动画，就是加了一个空的动画节点，在这个节点可以调用青蛙脚本里的Movement()，然后把Update()里的Movement()给删了，这样Movement()函数就不是反复执行，而是在特定时间节点才执行了. 和我那种方法感觉是各有优缺吧.

### **Hurt**：

1. 添加bool值hurt，true时播放hurt动画.

2. Hurt要反弹一下，具体代码见下(就硬写三目运算🤣).

   ```
   if (!isHurt) {
   	rb.velocity = new Vector2(5 * (transform.position.x < collision.gameObject.transform.position.x ? -1 : 1), rb.velocity.y);
   	isHurt = true;
       Jump_();//反弹当然要跳一下~
   }
   ```

3. 因为Update()的问题，Hurt的动画可能会播不出来，在Update()里加个判断条件，不受伤的情况下才执行Movement().

   ```
   if(!isHurt) Movement();
   ```

4. Hurt的刷新在SwitchAnim()里写.

   ```
           if (isHurt) {
               anim.SetBool("hurt", true);
               if(Mathf.Abs(rb.velocity.x) < 0.1f) {
                   anim.SetBool("idle", true);
                   anim.SetBool("hurt", false);
                   isHurt = false;
               }
           }
   ```

   效果图：

   ![d4_3](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d4_3.png)

### **父类继承and死亡动画**：

1. 敌人很多，但都有死亡动画. 且我们希望在Player的碰撞敌人函数里来执行敌人的动画.

   * 新建脚本Enemy，这个Enemy要给其所有子类用，其Start()为protected virtual void Start()，virtual是为了子类也可以更改.

     ```
     protected virtual void Start() {anim = GetComponent<Animator>();}
     ```

   * 在Enemy里编写死亡动画部分，分两个

     * ```
       void Death() { Destroy(gameObject);}//销毁物件
       ```

     * ```
       public void JumpOn() { anim.SetTrigger("death");}//打开death的trigger
       ```

   * 以青蛙为例，

     其class改为：

     ```
     public class Enemy_Frog : Enemy{...}// :是继承
     ```

     其Start()改为：

     ```
     protected override void Start(){
     	base.Start();//启动其父类的Start()
     	...
     }
     ```

     因为用了其父类的Star()，anim被创建了，frog自己就无需提前创建anim. 

     然后在Player的脚本里，敌人交互部分，获取碰撞的敌人：

     ```
     Enemy enemy = collision.gameObject.GetComponent<Enemy>();
     ```

     判断是踩上去的后，直接就能用enemy的函数JumpOn()来启动敌人死亡.

   * 再提一下这个东西是Trigger

     ![d4_4](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d4_4.png)

2. 死亡销毁物件：

   给死亡动画的Animation加一个event，放在动画结束的地方，执行Death()函数. 

### **音效**：

1. BGM：给Player加Audio source，将音源拖进去，勾选Play On Awake（游戏开始时就播放），Loop（循环）

2. 敌人爆炸：不要勾Play On Awake，打开Enemy脚本. 添加：

   ```
   ...
    protected AudioSource deathAudio;
   ...
       public void JumpOn() {
           anim.SetTrigger("death");
           deathAudio.Play();//这里
       }
   ```

3. 跳跃音效：新建Audio Source，把音效拖进去，在Player脚本的跳跃部分播放音效，注意要把音效拖到Scprit里



1. ![d4_5](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d4_5.png)

2. 收集物品的音效，我开始是给物品加了脚本，然后弄了好久也没成功，最后干脆直接给Player又加了一个音效（

### **其他**：

1. 改了踩敌人的判定，之前是当前动画为fall是可以踩，但由于我设置可以在空中蹲（高难动作钻缝），改成了判定当前速度为向下. 

***

#### 青蛙自动左右跳跃移动的码（没有继承Enemy的）：

```
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemy_Frog : MonoBehaviour {
    private Rigidbody2D rb;
    public Transform leftpoint, rightpoint;
    public float speed, jumpforce;
    public int Face = 1;//1朝左，-1朝右
    private float Leftx, Rightx;//左右边界的位置

    private Animator anim;//动画
    public float times;
    public float clock = 3f;

    public Collider2D coll;//Frog 碰撞体
    public LayerMask ground;//地图的碰撞体
    void Start() {
        rb = GetComponent<Rigidbody2D>();
        anim = GetComponent<Animator>();
        Leftx = leftpoint.position.x;
        Rightx = rightpoint.position.x;
        Destroy(leftpoint.gameObject);
        Destroy(rightpoint.gameObject);
        times = clock;
    }

    void Update() {
        times -= Time.deltaTime;
        Movement();
    }
    void Movement() {
        //起跳
        if (times <= 0) {
            times = clock;
            rb.velocity = new Vector2(speed * Face, jumpforce);
            anim.SetBool("jump", true);
            anim.SetBool("idle", false);
        }
        if (anim.GetBool("jump")) {
            if (rb.velocity.y > 0) return;
            //下落
            if (rb.velocity.y < 0) {
                anim.SetBool("jump", false);
                anim.SetBool("fall", true);
            }
        }
        //触地
        if (coll.IsTouchingLayers(ground)) {
            rb.velocity = new Vector2(0, 0);
            anim.SetBool("fall", false);
            anim.SetBool("idle", true);
        }
        //rb.velocity = new Vector2(speed*Face, rb.velocity.y);
        if (!anim.GetBool("idle")) return;
        if (Face==1) {
            if (transform.position.x <= Leftx) {
                Face *= -1;
                transform.localScale = new Vector3(Face,1,1);
            }
        }
        else {
            if (transform.position.x >= Rightx) {
                Face *= -1;
                transform.localScale = new Vector3(Face, 1, 1);
            }
        }
    }
}

```

# Day5

### Dialog：

1. Canvas里新建UI→Panel，命名EnterDialog，这个是对话框. 下面新建Text写内容.

2. 给门（hourse）新建碰撞体和脚本：

   ```
   ...
   public GameObject enterDialog;
   ...
   	private void OnTriggerEnter2D(Collider2D collision) {
           if(collision.tag == "Player") {
               enterDialog.SetActive(true);
           }
       }
       private void OnTriggerExit2D(Collider2D collision) {//离开时
           if (collision.tag == "Player") {
               enterDialog.SetActive(false);
           }
       }
   ```

   要把那个EnterDialog拖到hourse的脚本里，初始把Active给关了.

3. 设置对话框的出现对话：

   * Assets新建Dialog文件夹，新建Dialog的Animation，直接拖给EnterDialog就能自动填上Animator.
   * 录制：点这个![d5_1](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d5_1.png)  ，先把EnterDialog和里面的Test透明度都调成0，在后面一点的时间里在把透明度调回来.

### 蹲下的修改：

​	在障碍物下面蹲，起来会卡模型，不能让Player起来.

1. 在Player下Create Empty，命名ceiling，调整到Player头顶. 

2. 修改Player脚本.

   ```
   ...
   public Transform ceilingCheck;
   ...
   //下蹲
   if(!Physics2D.OverlapCircle(ceilingCheck.position, 0.2f, ground)){//判断Player头有无障碍
   ...           
   }
   ```

   别忘了把ceiling拖到Player的脚本里.

### **死亡重置**：

1. Create Empty命名DeadLine，拉到地图下面，给它一个标签DeadLine. 

2. 修改Player脚本.

   ```
   using UnityEngine.SceneManagement;
   ...
   private void OnTriggerEnter2D(Collider2D collision) {
   ...
   	if(collision.tag == "DeadLine") {
   		GetComponent<AudioSource>().enabled = false;//关闭所有音乐
   		Invoke("Restart", 2f);//延迟两秒执行函数
       }
   ...
   }
   void Restart() {
       SceneManager.LoadScene(SceneManager.GetActiveScene().name);//重载当前场景
   }
   ...
   ```

### **换场景**：

1. 新建脚本.

   ```
   using UnityEngine.SceneManagement;
   ...
   void Update() {
       if (Input.GetKeyDown(KeyCode.E)) {//进入当前场景的下一个场景
           SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex+1);
       }
   }
   ```

2. 把这个脚本拖到EnterDalog上去.

### **2D光源**：

1. 给背景、地图添加材质Default-Diffuse![d5_2](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d5_2.png) 

2. 素材文件夹里新建Material，将其Shader设置成Sprites/Diffuse，拖给Player的材质用.

3. 新建Light→Point Light,可以放在地图上的火苗位置.

4. 在Player下新建点光源，让Player一直有一点光.

5. 整个场景的光：新建Light→Directional Light.

6. 光是3D的，注意z轴.

   ![d5_3](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d5_3.png)

### **视觉差**：

​	就是让不同远近的场景交错跟着摄像机移动.

1. 新建脚本Parallax，我们希望场景跟随相机的速度有倍率关系.

   ```
   public Transform Cam;
   public float moveRate;
   private float startPoint;
   void Start() {
       startPoint = transform.position.x;
   }
   void Update() {
       transform.position = new Vector2(startPoint + Cam.position.x * moveRate, transform.position.y);
   }
   ```

   这是x轴方向的，还可以添加y轴方向，做Flag来设置哪个方向是需要的.

2. 把Parallax直接拖到BackGround或者其他需要视觉差的. 

### 主菜单

1. 新建Scene：Menu.

2. 新建Panel：background，导入图片（Source Image）.

3. 为了让背景是渐变出现，添加动画，录制. 

4. Menu新建脚本. 

   ```
   ...
   using UnityEngine.SceneManagement;
   ...
       public void PlayGame() {//开始
           SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);
       }
       public void QuitGame() {//退出
           Application.Quit();
       }
       public void UIEnable() {//UI是否可见
           GameObject.Find("Canvas/MainMenu/UI").SetActive(true);
       }
   ```

   **注意**要把Menu这个Scene添加到File→Build Setting里的最上面

5. Menu下新建两个Button：Play、Quit，设置文字.

6. 在Button的On Click()，把Menu拖进去，设置函数![d5_4](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d5_4.png) 

7. 让背景渐变结束后才出现Button，Menu动画添加事件，设置函数.

### 暂停游戏及音量调节

​	~~~~**暂停游戏**

1. 首先做一个Pause按钮，在Canvas下新建Button，设置文字Pause.

2. 方便起见直接继续在Menu的脚本里写. 加函数

   ```
       public void PauseGame() {
           pauseMenu.SetActive(true);
           Time.timeScale = 0f;//时间Scale变0
       }
       public void ContinueGame() {
           pauseMenu.SetActive(false);
           Time.timeScale = 1f;
       }
   ```

   分别是打开PauseMenu和关闭

3. Canvas下新建Panel，里面不少东西![d5_5](E:\_public\2d_1-7\d5_5.png)

   出来这样的图：![d5_6](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d5_6.png)

4. Menu的脚本拖给Canvas，再把Canvas拖进Pause按钮的On Click()里，设置函数PauseGame; Continue按钮同理.

5. 注意定位.

​	~~~~**调节音量**

1. Assets里新建Audio Mixer，命名MainMixer.

2. Menu里添加代码.

   ```
   using UnityEngine.Audio;
   ...
   public AudioMixer audioMixer;
   ...
   public void SetVolume(float val) {
       audioMixer.SetFloat("MainVolume", val);
   }
   ```

   获得输入的值，将值赋给audioMixer.

3. 正常来说是不支持赋值的，在MainMixer里，点击Master，右键Volume将其设置成可被代码编辑的，同时改一下名字![d5_7](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d5_7.png) ，改的名字就是在那个函数里用的字符串. 

4. Canvas，把MainMixer拖进Audio Mixer里.

5. VolumeSlider，把Canvas拖进On Value Changed(Single)，注意点看图![d5_8](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d5_8.png)

6. VolumeSlider的Min Value设置成-80，Max Value设置成0.

### 可以从下面跳上去的平台

1. 这类特殊平台需要创建新Tilemap管理
2. 画一个平台，加上Tilemap Collider 2D，勾选Used By Effector
3. 加组件Platform Effector 2D，不要勾选Use Collider Mask

### 更好的管理音效

​	在熬夜...

​	总结来说，就是创建了一个空物件，添加脚本，里面写上播放各种音效的函数，设置静态class，将Player上的音效利用这个静态class直接播放. 

​	好困...

### **优化代码？**：

1. Player脚本换成FixedUpdate()，Time.DeltaTime换成Time.fixedDeltaTime，获取跳跃按键换成GetButton().

2. 改了敌人碰撞部分，在Death()里加.

   ```
    GetComponent<Collider2D>().enabled = false;
   ```

   直接禁用.

3. 防止一个物件计数两次：这里改的真的莫名其妙的，其实我本来就没有这个问题，但还是记录一下

   * 给Cherry加获得的动画，最后加个事件

   * Cherry脚本里

     ```
        public void Death() {
             Destroy(gameObject);
             FindObjectOfType<PlayerController>().CherryCount();
         }
     ```

   * Player脚本里

     ```
     ...
     void FixedUpdate(){
     ...
     	CherryNum.text = Cherry.ToString();//奇妙的延迟问题
     ...
     }
     ...
     private void OnTriggerEnter2D(Collider2D collision) {
         if (collision.tag == "Cherry") {//樱桃
             collectAudio.Play();
             collision.GetComponent<Animator>().Play("isGot");//播放获得动画
         }
     }
     public void CherryCount() {
         Cherry++;
     }
     ...
     ```

   * Cherry的获得动画那个事件选上Death()

### 打包游戏

Build...

# Day6-8

**Day6**：

摆烂了两天...主要是不知道怎么开始，一点思路也没有.

不过现在要开始啦😤 *新建文件夹.

今天稍微编了一点设定，画了一点素材.

设定的话，想设计成吸血鬼方向的.（白毛红瞳🤤）

素材，这里留点图吧：

![d6_1](E:\_public\2d_1-7\d6_1.png)

![t](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/t.png)

![d6_3](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d6_3.png)

还没画人物，主角想多问问其他人的意见

***

**Day7**：

又画了一点素材，进度有点慢（我是真不会画啊艹）

留点图

![d7_1](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d7_1.jpg)

![d7_2](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d7_2.jpg)

![d7_3](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d7_3.jpg)

![d7_4](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d7_4.jpg)

这张主角草稿主要参考了有一张铃兰的图（铃兰...我的铃兰🤤...我没有啊😭）

***

**Day8：**

寄啊，这进度是真滴慢...

今天弄了主角的左右移动，还画了主角寄的动画，然后这一天就过去了...

所幸是我找到背包系统、对话啥的教程在哪了（还是之前那个up有教）

留图：

是我女儿了现在🤤

![d8_1](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d8_1.JPG)

像素图：

![d8_2](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d8_2.png)

还有些图过于雪芯就不放了...

# Day9-11

**Day9**

今天主要弄了背包，这背包要弄的东西是真的多

#### 背包UI

***

我这里其实只画了一个这个图就行了

![d9_1](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d9_1.png)

主要是放物件的格子和文本框

先丢个b站教程在这里，我觉得照着做非常舒服BV1YJ41197SU

等我有时间了在看看能不能补一下这里（其实是我自己也没太搞明白）

**Day10** **Day11**

***

啥也不会，也看不懂...

抄教程的话，抄的云里雾里，而且由于我看的教程比较杂，抄了会有各种各样的问题（

最后还是全靠自己写的（连蒙带猜就胡写出来了

* **切换场景的影流之主BUG**

首先切换场景的话，可以看那个教程里写的. 这里我出现了BUG，就是我无法卸载场景，然后会有两个，甚至三个同样的场景同时出现，于是就出现了影流之主的奇妙场面

![d10_1](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d10_1.png)

我把教程里切换场景的码看了好多遍，然后网上也查到了相同的情况，试了很多解决方案都寄了. 最后我到官网手册去查，这一查就查出来了

![d10_2](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d10_2.png)

我的函数是照着教程里写的，先卸载再加载，但我的场景布置和教程不一样. 我的场景是分开的，教程里是在一起的，也就是说我的场景只会同时出现一个，也就不能卸载.

解决方法也就简单了，先加载再卸载即可.

* **警惕背包演人**

关于背包最开始也有一点BUG. 虽然我的背包可以永久存储信息，但我的背包UI再第二次打开游戏时是空的，也就是没有把inventory里的信息弄出来，背包存了个寂寞的信息. 我是给**inventoryManger**加了Start，让它一开始就遍历Bag把东西都加载出来，效果很好.

```
    ...
    private void Start() {
        for (int i = 0; i < instance.Bag.itemList.Count; i++)
            CrateNewItem(instance.Bag.itemList[i]);
    }
    ...
```

* **吃掉的就别吐出来啊**

背包还有一个需要解决的问题， 反复切换场景，会发现之前吃掉的物品又被加载出来了. 我在看了各方教程后选择用字典来存储改物件是否被吃掉了，在加载场景时，如果发现该物件已经被收集，就直接Destory. 这部分我写在**itemOnWorld**(教程里叫slot好像吧)的Awake函数里

```
   ...
   private void Awake() {
        if (playerInventory.itemAvailabeDict[itemName]) {
            Destroy(gameObject);
        }
    }
    ...
```

这里的playerInventory.itemAvailabeDict即使字典，在**inventory**里我们加上这个字典：

```
...
public class inventory : ScriptableObject {
    public Dictionary<ItemName, bool> itemAvailabeDict = new Dictionary<ItemName, bool>();
    public List<item> itemList = new List<item>();
}
...
```

Player吃掉物件时将其bool值改一下就行了. 

# Day12

* **Button无效BUG**

在做其他场景的时候的出现了一点问题，就是我在其他场景里的背包无法使用Button，网上查到原因是没有加EventSystem. 

我对这玩意真是没啥印象，我之前甚至觉得没用想在第一个场景里也给删了...加上就好了

* **翻柜子**

我不大想做那种带UI的，甚至有鼠标点击的翻柜子. 我做了个极其简单的. 到柜子附近按"E"就会将柜子下的子物件（即要放在柜子里的item）设置为active. 这里需要找到一个物件的子物件.

```
 ...//这里是Player的碰撞检测
 switch (collisionNow.tag) {
 ...
            case "Cabinet"://打开柜子，翻出物件
                collisionNow.transform.GetChild(0).gameObject.SetActive(true);//将第一个子物件显示
                break;
 ...
        }
 ...
```

* **判断是否拿到了铲子**

设置tag可以轻松解决，但是tag越多，码越丑. 我考虑到有个物品ID的东西就试了一下，开始确实是成功了，然后过一会就寄了，我发现ID变了. 我可以一开始就记录ID，感觉好像和再加一个tag也没啥区别了（

* **BUG: 切换场景时Player的信息没了（如已经获得了铲子**

在inventoy里记录一下，然后Player的Start里给is_Shovel用inventory里的赋值就行

# Day13-14

对于关卡的设计，今天有了一些想法

多个Player，但不在同一地点，Player的移动是互相链接的，每个Player都在一个迷宫里

我是这样实现上面的操作的：给其中一个Player添加多个碰撞体，其余Player跟随这个Main Player移动

需要注意碰撞体的LocalScale也要变

***

做了迷宫

特点：左右镜像移动，需要左右的Player都到达目的地才能场景互动

没遇到啥bug~留个图

![d14-1](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d14-1.png)

![d14-2](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d14-2.png)

![d14-3](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d14-3.png)

# Day15-16

鹰角你坏事（夏活）做尽，摆烂好久...

从迷宫到下一个场景的时候再次出现了影流之主bug，分明之前都解决过的，这又出现了我查了好久没有一点头绪.

最后找到了这一切的罪魁祸首

```
        yield return SceneManager.LoadSceneAsync(to, LoadSceneMode.Additive);
```

这是TransitionManger的部分，最后那个Additive会让场景叠加，改成**Single**就会自动删除多余的

留个图

![d15_1](https://raw.githubusercontent.com/Akejyo/imageForBlog/master/img/d15_1.png)

***

后面做了很多天，加了追逐战（用的iwanna的那个）啥的

基本上没啥可加的了（懒的写了）

