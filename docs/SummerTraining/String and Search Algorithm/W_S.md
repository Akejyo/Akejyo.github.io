---
title: "樱之刻"
date: 2022-3-1
tags:
  - String
  - ACM课程
---

AC自动机

<!-- more -->

# W. 樱之刻

**题意**：先给出$n$个字符串$s_i$，最后给出文本$t$，求每个$s_i$在$t$中的出现次数

***

### AC自动机

* 对$n$个字符串$s_i$建字典树，$tri[u][c]$表示节点$u$后加一个字符$c$的节点，$u$—$c$→$v$。同时还要记录一下第$i$个字符串的末尾还是最近哪一次出现过的字符串的末尾(如果有的话，$nxt[]$储存)，再记录一下节点u是否是某模式串末尾($id[]$储存)

* 建$fail$树. 对状态$u$，它的$fail$指针指向$u$的最长后缀$v$

  操作：

  1. 初始化：遍历$26$个字母$i$，如果$tri[0][i]$存在，向队列$q$中添加$tri[0][i]$；

  2. 扫队列$q$：设$u$为当前处理节点，如果$tri[u][i]$存在，$fail[tri[u][i]]=tri[0][i]$，同时把$tri[u][i]$塞到队列$q$里。然后$tri[u][i]=tri[fail[u]][i]$. 这样做确实是改变了字典树的结构，但事实上我们在跳$fail$指针时只关心能不能匹配到一个串的后缀，所以直接改变了$tri[u][i]$到$tri[fail[u]][i]$不会影响$fail$指针的匹配，还能起到压缩跳$fail$指针路径的作用；

  ```
  while (l<=r) {//数组模拟队列
  		int u = q[l++];
  		for (int i = 0; i < 26; i++) {
  			if (tri[u][i]) {
  				fail[tri[u][i]] = tri[fail[u]][i];
  				q[++r]=tri[u][i];
  				continue;
  			}
  			tri[u][i]= tri[fail[u]][i];
  		}
  	}
  ```

  3. 统计出现次数

     首先一层$for$扫文本串，初始化得到一个不完整的$sum$数组：

     ```
     for (int i = 0, u = 0; i < len; i++) u = tri[u][s[i] - 'a'], sum[u]++;
     ```

     然后就体会到建树时用数组模拟队列的优点了，逆序队列就是处理树上差分的顺序，此时利用前面保存的$nxt$数组和$id$数组就能对树上的每个节点$u$，快速遍历以该节点为末尾的所有模式串（这个过程更新$ans$数组）。逆序遍历字典树能保证父节点统计到所有后代的值，类似前面回文自动机的处理。

***

```
#include <bits/stdc++.h>
template<typename T>
inline void read(T& x) { x = 0; char c = getchar(); while (!isdigit(c))c = getchar(); while (isdigit(c)) { x = x * 10 + c - '0'; c = getchar(); } }
#define si(a) read(a)
#define sii(a,b) read(a),read(b)
#define siii(a,b,c) read(a),read(b),read(c)
#define fl float
#define ll long long int
#define ull unsigned long long int
using namespace std;
int gcd(int a, int b) { return a == 0 ? b : gcd(b % a, a); }
//const ll MOD = 924844033;
const int N = 2e6 + 10;
int n, m;
int cnt, ans_id, l = 1, r;
int ans[N], fail[N], sum[N], id[N],NEXT[N];
int tri[N][27];
char tmp[N];
int q[N];
void get_fail() {
	for (int i = 0; i < 26; i++)
		if (tri[0][i])q[++r]=(tri[0][i]);
	while (l<=r) {
		int u = q[l++];
		for (int i = 0; i < 26; i++) {
			if (tri[u][i]) {
				fail[tri[u][i]] = tri[fail[u]][i];
				q[++r]=tri[u][i];
				continue;
			}
			tri[u][i]= tri[fail[u]][i];
		}
	}
}
void match(char s[]) {
	int u = 0, len = strlen(s);
	for (int i = 0; i < len; i++) 
		u = tri[u][s[i] - 'a'], sum[u]++;
	for (int i = cnt; i >= 1; i--) {
		for (int j = id[q[i]]; j; j = NEXT[j])
			ans[j] = sum[q[i]];
		sum[fail[q[i]]] += sum[q[i]];
	}
}
void build(char s[]) {//建字典树
	int len = strlen(s), u = 0;
	for (int i = 0; i < len; i++) {//遍历字符串
		int c = s[i] - 'a';
		if (!tri[u][c]) 
			tri[u][c] = ++cnt;//没找到
		u = tri[u][c];
	}
	ans_id++;
	NEXT[ans_id] = id[u];
	id[u] = ans_id;
}
void solve() {
	si(n);
	for (int i = 1; i <= n; i++) {
		scanf("%s", tmp);
		build(tmp);
	}
	get_fail();
	scanf("%s", tmp);
	match(tmp);
	for (int i = 1; i <= n; i++)printf("%d\n", ans[i]);
}
int main() {
	int t;
	/*si(t);
	while (t--)*/
	solve();
	return 0;
}
/*
3
what
is
mind
thisisnotmind
*/
```

