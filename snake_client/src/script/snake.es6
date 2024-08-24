/*
	author: leeenx
	@ 贪吃蛇
	@ model & view 不对外暴露接口
	@ SnakeClass 本质上说就是 SnakeControl
*/

// 向前兼容
import '@babel/polyfill'; 

// model
import SnakeModel from './core/model'; 

// view
import SnakeView from './core/view'; 

// control
import SnakeControl from './core/control'; 

class SnakeClass extends SnakeControl {
	constructor(dom) {
		super(new SnakeModel(), new SnakeView(dom)); 
	} 
}


// 创建一个游戏对象
var snakeGame = new SnakeClass(document.querySelector(".snake-game"));
// 初始化游戏 
snakeGame.init(
	{
		time: 300000, // 总时间
		width: 640, 
		height: 640, 
		row: 20, 
		column: 20, 
		// 显示屏的边框
		border: 0x414042, 
		color: 0x414042, // 蛇的节点颜色
		food: 0x990000, // 食物的颜色
		min: 4, // 初始长度
		speed: 1.5 // 速度标量
	}
); 
// 开始游戏 
snakeGame.start(); 

/* S 游戏 API */

// 注销游戏 
// snakeGame.destory(); 

// 重新开始游戏 
// snakeGame.restart(); // 相当于 destroy -> init -> start

// 暂停游戏 
// snakeGame.pause(); 

// 恢复游戏
// snakeGame.resume(); 

// 控制游戏速度，数值越大速度越快
// snakeGame.speed = 1; 

// 游戏方向
// snakeGame.turn(); // 四个值：left, right, up, down。

/* E 游戏 API */


/* S 游戏的事件 */

// 游戏时间
let $timer = document.querySelector(".snake-timer"); 
snakeGame.event.on("countdown", (time) => {
	$timer.innerHTML = `时间：${time}s`; 
});

// 游戏结束
snakeGame.event.on("gameover", (type) => {
	alert("游戏结束。结束类型是：" + type); 
}); 

// 吃到东西
snakeGame.event.on("eat", (food) => {
	console.log("吃到食物，当前长度: " + snakeGame.length); 
}); 

// 吃到东西前
snakeGame.event.on("before-eat", () => {
	console.log("吃到食物之前的长度：" + snakeGame.length)
})

/* E 游戏的事件 */

// 禁止页面滚动提高体验
document.body.addEventListener("touchmove", e => e.preventDefault()); 

/* S 控制游戏 */
{
	let controller = document.querySelector(".snake-direction"), 
	curDirection, 
	{top, left, width, height} = controller.getBoundingClientRect(), 
	x = left + width / 2, 
	y = top + height / 2, 
	deg45 = Math.PI / 4, 
	deg90 = Math.PI / 2, 
	deg135 = Math.PI / 2 + deg45, 
	deg180 = Math.PI, 
	deg225 = Math.PI + deg45, 
	deg270 = Math.PI + deg90, 
	deg315 = Math.PI * 2 - deg45; 

	controller.addEventListener("touchstart", ({targetTouches: [{pageX, pageY}]}) => {
		checkDirection(pageX - x, pageY - y); 
	});

	controller.addEventListener("touchmove", ({targetTouches: [{pageX, pageY}]}) => {
		checkDirection(pageX - x, pageY - y); 
	}); 

	controller.addEventListener("touchend", ({changedTouches: [{pageX, pageY}]}) => {
		curDirection = undefined; 
		controller.className = 'snake-direction'; 
	}); 

	let checkDirection = function(x, y) {
		let radian = Math.asin( y / Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2)) ); 
		// 1~2象限
		if(x > 0 && y < 0 || x > 0 && y > 0) {
			radian += deg90; 
		}
		// 3~4象限
		else if(x < 0 && y > 0 || x < 0 && y < 0) {
			radian = deg270 - radian; 
		}

		let direction = "up"; 
		if(radian > deg45 && radian < deg135) {
			direction = "right";
		}
		else if(radian > deg135 && radian < deg225) {
			direction = "down";
		}
		else if(radian > deg225 && radian < deg315) {
			direction = "left";
		} 
		direction === curDirection || snakeGame.turn(curDirection = direction, controller.className = "snake-direction " + direction); 
	}

	// 暂停开关
	let trigger = document.querySelector(".snake-trigger"); 
	trigger.addEventListener("click", function() {
		console.log("clickclickclick")
		if(this.checked) {
			snakeGame.pause(); 
		}
		else {
			snakeGame.resume(); 
		}
	}); 

	// 电源开关
	let power =document.querySelector(".snake-switch"); 
	power.addEventListener("click", () => {
		snakeGame.restart(); 
		trigger.checked = false; 
		trigger.click(); 
	}); 

	(function () {
		const slider = document.querySelector('.snake-speed input[type="range"]');
		const sliderValue = document.getElementById("speedValue");
		if (!slider || !sliderValue) {
			console.error("滑块或显示值的元素未找到");
			return;
		}
		function setSpeed(sliderValue) {
			// 更新速度值
			snakeGame.speed = sliderValue/100+0.4;
		}
		// Update slider value on input change
		slider.addEventListener('input', () => {
			sliderValue.textContent = slider.value;
			setSpeed(slider.value);
		});
		// Initialize slider value display
		sliderValue.textContent = slider.value;
		
	})();
	
	
	

	// PC 键盘
	let keyboradUpdate = ({keyCode}) => { 
		switch(keyCode) {
			case 37: snakeGame.turn("left"), controller.className = "snake-direction left"; break; 
			case 38: snakeGame.turn("up"), controller.className = "snake-direction up"; break; 
			case 39: snakeGame.turn("right"), controller.className = "snake-direction right"; break; 
			case 40: snakeGame.turn("down"), controller.className = "snake-direction down"; break; 
			// case 32: 
			// 	let checkbox = document.querySelector(".snake-trigger"); 
			// 	checkbox.click();
			// 	break; 

		}
	}
	window.addEventListener("keydown", keyboradUpdate); 
	window.addEventListener("keyup", () => controller.className = "snake-direction");
}

/* E 控制游戏 */
