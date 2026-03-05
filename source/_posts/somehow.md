---
title: somehow？
date: 2026-02-27 
tags:
  - test
categories: 114514
---
测试新页面

{% codeblock lang:c%}
#include <stdio.h>
int main()
{
    printf("Hello World!\n");
    return 0;
}
{% endcodeblock %}
针对文件的代码块
{% codeblock usart.c %}
void usart1_Proc()
{
    sprintf(str,"%04d:HelloWorld\r\n",count);
    HAL_UART_Transmit(&huart1,(uint8_t *)str,strlen(str),50);
    count++;
}
{% endcodeblock %}


{% codeblock main.c lang:c %}
 sprintf(str,"%04d:HelloWorld\r\n",count);
    HAL_UART_Transmit(&huart1,(uint8_t *)str,strlen(str),50);
    count++;
{% endcodeblock %}


测试 bilibili视频嵌入
<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=116170443199889&bvid=BV1xRPvzTERb&cid=36449093843&p=1" scrolling="no" border="0" frameborder="yes" framespacing="0" allowfullscreen="true"></iframe>