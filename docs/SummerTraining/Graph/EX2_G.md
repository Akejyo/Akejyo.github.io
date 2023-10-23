---
title: "拓扑排序"
date: 2022-3-1
tags:
  - Graph
---

拓扑排序

<!-- more -->

# EX2.拓扑排序

Animals are waiting in a line, in a quarantine zone, before they can enter a hunting-free area, where they will find an easier life.

When entering the quarantine zone, animals have to check in with a guard. The guard writes down the animal species, and then the animal is allowed to join the end of the line, in the last position. At the other end of the line, animals have to check out: when the animal in the first position in the line is finally allowed to enter the hunting-free area, another guard writes down the animal species. Thus, each guard maintains a list of animal species, written down in the chronological order in which the animals have checked in or out. A total of NN animals, representing SS species, have checked in (and, therefore, checked out).

However, animals may enter the waiting line and leave it in different orders. Indeed, some animal species are friends with each other, and thus two animals from such species, if they occupy adjacent places in the line may accept to switch their places.

You have a list of those pairs of animal species that may accept to switch their places when being in adjacent positions in the line: this list contains L pairs. You were handed out the check-in list maintained by the first guard. Depending on which animals decided to switch places, several check-out lists might be possible. Among all those possible lists, which one comes first in alphabetical order?

给你S个物种，L个朋友关系，相邻且是朋友关系的两个可以互换位置，对N个动物排序使其字典序最小

不能换位置的即为约束关系，建有向边，同时每个动物只要考虑与它前面动物的约束关系

```
#include <bits/stdc++.h>
template<typename T>
inline void read(T& x) { x = 0; char c = getchar(); while (!isdigit(c))c = getchar(); while (isdigit(c)) { x = x * 10 + c - '0'; c = getchar(); } }
#define si(a) read(a)
#define sii(a,b) read(a),read(b)
#define siii(a,b,c) read(a),read(b),read(c)
#define fl double
#define ll long long int
#define ull unsigned long long int
#define T ll
using namespace std;
const ll MOD = 1e9 + 7;
//const int N = 2e5 + 10;//                       这个容易改的啊！！！！！！！
//int gcd(int a, int b) { return a == 0 ? b : gcd(b % a, a); }
ll gcd(ll a, ll b) { return a == 0 ? b : gcd(b % a, a); }
int n, m;
int S, L, N;
vector<string>species(1);//这个1不能少
map<string, int> mp;
int Friend[210][210];//朋友关系
int last[210];//同种物种间也有约束，所以不同物种的只用考虑它前面的
vector<int>e[200010];//拓扑建图，有约束条件的建有向边
int du[200010];//入度
int Line[200010];//初始的排队序列
int ans[200010];
struct ani {
	int sp, dex;//物种、在Line里的下标
	friend bool operator < (ani a, ani b) {
		if (a.sp == b.sp)return a.dex > b.dex;
		return a.sp > b.sp;
	}//重载<,按sp从小到大 or dex
};
priority_queue<ani> S_tp;
void tuopu() {
	for (int i = 1; i <= N; i++)if (!du[i])S_tp.push({ Line[i],i });
	int cnt = 0;
	while (!S_tp.empty()) {
		ani tmp = S_tp.top();
		S_tp.pop();
		ans[++cnt] = tmp.dex;
		for (auto it : e[tmp.dex])
			if (--du[it] == 0)S_tp.push({ Line[it],it });
	}
}
void solve() {

	siii(S, L, N);
	for (int i = 1; i <= S; i++) {
		string tmp; cin >> tmp;//string 不能直接用 scanf
		species.push_back(tmp);
	}
	sort(species.begin(), species.end());//这里要用begin()和end()
	int tmp = 0;
	for (auto it : species) mp[it] = tmp++;
	for (int i = 1; i <= L; i++) {
		string x, y; cin >> x >> y;
		Friend[mp[x]][mp[y]] = 1;
		Friend[mp[y]][mp[x]] = 1;
	}
	for (int i = 1; i <= N; i++) {
		string tmp; cin >> tmp;
		int id = mp[tmp];
		Line[i] = id;
		for (int j = 1; j <= S; j++) {
			if (Friend[id][j] || !last[j])
				continue;
			e[last[j]].push_back(i);
			du[i]++;//入度加一
		}
		last[id] = i;
	}
	tuopu();
	for (int i = 1; i <= N; i++)cout << species[Line[ans[i]]] << ' ';
}
int main() {
	int t;
	t = 1;
	//si(t);
	while (t--)
		solve();
	return 0;
}
/*

*/
```

