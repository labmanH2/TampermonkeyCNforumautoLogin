// ==UserScript==
// @name         油猴中文网自动签到
// @namespace    http://tampermonkey.net/
// @version      2025-04-20
// @description  自动签到脚本
// @author       You
// @grant        GM_setValue
// @grant        GM_getValue
// @match        https://bbs.tampermonkey.net.cn/
// @match        https://bbs.tampermonkey.net.cn/dsu_paulsign-sign.html
// @icon         https://bbs.tampermonkey.net.cn/data/attachment/common/a3/common_68_icon.png
// ==/UserScript==

// 定义选择器
//const dailyattendance = "#mn_N462e > a";
const fastselect = "#qiandao > table.tfm > tbody > tr:nth-child(1) > td > label:nth-child(2) > input[type=radio]";
const Startchecking = "#qiandao > table:nth-child(11) > tbody > tr > td > div > a > img";
const Homepage = "#comiis_nv > div > ul > li.comiis_logo > a > img";

const Moodpicture = {
    1: '#kx',
    2: '#ng',
    3: '#ym',
    4: '#wl',
    5: '#nu',
    6: '#ch',
    7: '#fd',
    8: '#yl',
    9: '#shuai',
};

// 随机心情函数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

(function() {


    // 判断是否已签到
    const getTodayString = () => {
        const date = new Date();
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    };

    const LAST_EXECUTION_KEY = 'last_execution_date';
    const today = getTodayString();
    const lastDate = GM_getValue(LAST_EXECUTION_KEY, '');

    if (today !== lastDate) {
        // 区分当前页面类型
        if (location.href.includes('/dsu_paulsign-sign.html')) {
            // 当前在签到页：执行签到操作
            //GM_setValue(LAST_EXECUTION_KEY, today);
            console.log('开始自动签到流程');

            // 等待页面元素加载
            const checkElement = setInterval(() => {
                if (document.querySelector(Startchecking)) {
                    setTimeout(()=>{
                    document.querySelector(fastselect).checked = true;
                    document.querySelector(Moodpicture[getRandomInt(1, 9)]).click();
                    document.querySelector(Startchecking).click();
                    },1000);
                    setTimeout(() => {
                        document.querySelector(Homepage).click();
                        GM_setValue(LAST_EXECUTION_KEY, today);
                        clearInterval(checkElement);
                    }, 2000); // 等待签到完成

                }
            }, 500);

        } else {
            // 当前在主页：跳转到签到页（仅一次）
            console.log('跳转到签到页面');
            //GM_setValue(LAST_EXECUTION_KEY, today); // 立即标记已执行，避免循环
            window.location.href = 'https://bbs.tampermonkey.net.cn/dsu_paulsign-sign.html';
        }
    } else {
        console.log('今日已签到，跳过');
    }
})();