export const clearBoard = (context: CanvasRenderingContext2D | null) => {
  if (context) {
    context.clearRect(0, 0, 1000, 600);
  }
};

export interface IObjectBody {
  x: number;
  y: number;
}

export const drawBorder = (
  canvas: HTMLCanvasElement | null,
  context: CanvasRenderingContext2D | null,
  fillColor: string,
) => {
  if (!context || !canvas) {
    return;
  }
  const borderSize = 20; // 边框的厚度
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const borderColor = fillColor;

  // 设置字体和对齐方式
  context.font = '16px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  // 绘制上边框
  for (let i = 0; i < canvasWidth; i += 20) {
    context.fillStyle = borderColor;
      context.fillText('#', i + 10, 10); // 在上边框位置绘制#
  }

  // 绘制下边框
  for (let i = 0; i < canvasWidth; i += 20) {
    context.fillText('#', i + 10, canvasHeight - 10); // 在下边框位置绘制#
  }

  // 绘制左边框
  for (let i = 0; i < canvasHeight; i += 20) {
    context.fillText('#', 10, i + 10); // 在左边框位置绘制#
  }

  // 绘制右边框
  for (let i = 0; i < canvasHeight; i += 20) {
    context.fillText('#', canvasWidth - 10, i + 10); // 在右边框位置绘制#
  }
}

export const drawSnakeBody = (
  context: CanvasRenderingContext2D | null,
  objectBody: IObjectBody[],
  fillColor: string,
  strokeStyle = "#211a12"
) => {
  if (context) {
    const squareSize = 20
    objectBody.forEach((object: IObjectBody) => {
      const textX = object.x + squareSize / 2; // 正方形中心 x 坐标
      const textY = object.y + squareSize / 2; // 正方形中心 y 坐标

      context.fillStyle = fillColor;
      context?.fillText('@', textX, textY, squareSize); // 在每个节的位置绘制@
      // context.strokeStyle = strokeStyle;
      // context?.fillRect(object.x, object.y, 20, 20);
      // context?.strokeRect(object.x, object.y, 20, 20);
    });
  }
};

export const drawFood = (
  context: CanvasRenderingContext2D | null,
  objectBody: IObjectBody[],
  fillColor: string,
  strokeStyle = "#fff"
) => {
  if (context) {
    const squareSize = 20
    objectBody.forEach((object: IObjectBody) => {
      const textX = object.x + squareSize / 2; // 正方形中心 x 坐标
      const textY = object.y + squareSize / 2; // 正方形中心 y 坐标

      context.fillStyle = fillColor;
      context?.fillText('*', textX, textY, squareSize); // 在每个节的位置绘制@
      context.strokeStyle = strokeStyle;
      // context?.fillRect(object.x, object.y, 20, 20);
      context?.strokeRect(object.x, object.y, 20, 20);
    });
  }
};

export const drawObject = (
  context: CanvasRenderingContext2D | null,
  objectBody: IObjectBody[],
  fillColor: string,
  strokeStyle = "#211a12"
) => {
  if (context) {
    objectBody.forEach((object: IObjectBody) => {
      context.fillStyle = fillColor;
      context.strokeStyle = strokeStyle;
      context?.fillRect(object.x, object.y, 20, 20);
      context?.strokeRect(object.x, object.y, 20, 20);
    });
  }
};

function randomNumber(min: number, max: number) {
  let random = Math.random() * max;
  return random - (random % 20);
}
export const generateRandomPosition = (width: number, height: number) => {
  return {
    x: randomNumber(0, width) || 20,
    y: randomNumber(0, height) || 20,
  };
};

export const hasSnakeCollided = (
  snake: IObjectBody[],
  currentHeadPos: IObjectBody
) => {
  let flag = false;
  snake.forEach((pos: IObjectBody, index: number) => {
    if (
      pos.x === currentHeadPos.x &&
      pos.y === currentHeadPos.y &&
      index !== 0
    ) {
      flag = true;
    }
  });

  return flag;
};
