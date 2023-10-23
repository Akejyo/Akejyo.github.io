---
title: "国际象棋"
date: 2022-3-1
tags:
  - Search Algorithm
  - ACM课程
---

剪枝，迭代加深

<!-- more -->

# R. 国际象棋

**题意**：5×5的棋盘，有12个黑子、12个白子和一个空格，每个子的移动方式为国际象棋中马的走法，要求最后棋局长这样：

```
11111
01111
00*11
00001
00000
```

1是黑子，0是白子，*是空格。求最小步数(步数大于15输出-1)

***

**迭代加深+可行性剪枝**

* 由于最大步数就是15，直接设搜索深度为15即可。
* 移动一次会改变两个子的位置，移动两次最多改变三个子的位置，移动n次最多改变n+1个子的位置，我们需要记录并计算当前棋局与终局棋子的差异个数，如果差异次数大于剩余次数+1，那就是不可能在剩余步数里下完棋局，就可以直接退出了。
* 每次枚举空格周围的8个格子而不是枚举每个棋子。

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
int ans;
int next_x[9] = { 0,-2,-1,1,2,2,1,-1,-2 };
int next_y[9] = { 0,1,2,2,1,-1,-2,-2,-1 };
char chess[6][6];
char chess_end[6][6] = {
	{'1','1','4','5','1','4'},
	{'w','1','1','1','1','1'},
	{'c','0','1','1','1','1'},
	{'w','0','0','*','1','1'},
	{'c','0','0','0','0','1'},
	{'A','0','0','0','0','0'}
};
bool check_xy(int a, int b, int th) {
	if ((a + next_x[th] >= 1) && (b + next_y[th] >= 1) && (a + next_x[th] <= 5) && (b + next_y[th] <= 5))
		return true;
	return false;
}
bool ok_() {
	for (int i = 1; i <= 5; i++)
		for (int j = 1; j <= 5; j++)
			if (chess_end[i][j] != chess[i][j])
				return false;
	return true;
}
int diff() {
	int cnt = 0;
	for (int i = 1; i <= 5; i++)
		for (int j = 1; j <= 5; j++)
			if (chess_end[i][j] != chess[i][j])
				cnt++;
	return cnt;
}
void dfs(int u, int x,int y, int now) {
	if (u > 15 || u>=ans)
		return;
	if (!now) {
		ans = min(ans, u);
		return;
	}
	if (now > 16 - u) return;
	for (int i = 1; i <= 8; i++)
		if (check_xy(x, y, i)) {
			int tmp = 0;
			int x2 = x + next_x[i], y2 = y + next_y[i];
			if (chess[x][y] == chess_end[x][y]) tmp++;
			if (chess[x2][y2] == chess_end[x2][y2]) tmp++;
			if (chess[x][y] == chess_end[x2][y2])tmp--;
			if (chess[x2][y2] == chess_end[x][y]) tmp--;
			swap(chess[x][y], chess[x + next_x[i]][y + next_y[i]]);
			dfs(u + 1, x + next_x[i], y + next_y[i],now+tmp);
			swap(chess[x][y], chess[x + next_x[i]][y + next_y[i]]);
		}
}
void solve() {
	ans = 114514;
	for (int i = 1; i <= 5; i++)
		scanf("%s", chess[i]+1);
	getchar();
	int tmp = diff();
	for (int i = 1; i <= 5; i++)
		for (int j = 1; j <= 5; j++)
			if (chess[i][j] == '*') {
				dfs(0, i, j, tmp);
				if (ans >15) printf("-1\n");
				else printf("%d\n", ans);
				return;
			}
}
int main() {
	int t;
	si(t);
	while (t--)
		solve();
	return 0;
}
/*
2
1*111
01111
00111
00001
00000
01011
110*1
01110
01010
00100
*/
```

