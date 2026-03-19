---
title: VS2026对C语言printf报警的解决方案
tag:
  - Visual Studio
  - C
categories: 闲聊杂谈
cover: /images/vs2026_printf_warning/cover.png
---

 前一阵子一个学C朋友问我为什么在Visual Studio 2026里面写C语言代码，用``printf()``函数会报警warning。
<img src="/images/vs2026_printf_warning/0.png" />
我研究了一下，在这里分享给大家。
 ## 先说结论
这个东西是MSVC导致的。MSVC对C的支持本身就不好，而新更新的C++ 20标准更推荐使用``printf_s``函数，所以就会导致这个warning。
## 如何解决？
### 1.第一种：更换标准
在Visual Studio中的“项目”选项卡中点击“xxx和属性”
<img src="/images/vs2026_printf_warning/1.png" />
将语言标准改成别的，只要不是C++ 20就行。
<img src="/images/vs2026_printf_warning/2.png" />
### 2.第二种：换用clang编译器
在Visual Studio Installer中勾选这个选项：
<img src="/images/vs2026_printf_warning/3.png" />
等待安装完成后，重复1的步骤，但是将平台工具集改成LLVM(clang-cli)即可。
<img src="/images/vs2026_printf_warning/4.png" />