const arrayContainer = document.getElementById('array-container');
let array = [];

function generateArray() {
  arrayContainer.innerHTML = '';
  array = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 10);
  array.forEach(value => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${value}px`;
    bar.style.width = '20px';
    arrayContainer.appendChild(bar);
  });
}

async function runSort() {
  const sortMethod = document.getElementById('sort-selector').value;
  if (sortMethod === 'bubbleSort') await bubbleSort();
  if (sortMethod === 'selectionSort') await selectionSort();
  if (sortMethod === 'insertionSort') await insertionSort();
  if (sortMethod === 'mergeSort') await mergeSort();
  if (sortMethod === 'quickSort') await quickSort();
}

async function bubbleSort() {
  const bars = document.querySelectorAll('.bar');
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      bars[j].classList.add('active');
      bars[j + 1].classList.add('active');

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        await swapBars(bars[j], bars[j + 1]);
      }

      bars[j].classList.remove('active');
      bars[j + 1].classList.remove('active');
    }
    bars[array.length - i - 1].classList.add('sorted');
  }
  bars[0].classList.add('sorted');
}

async function selectionSort() {
  const bars = document.querySelectorAll('.bar');
  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    bars[minIdx].classList.add('active');
    for (let j = i + 1; j < array.length; j++) {
      bars[j].classList.add('active');
      if (array[j] < array[minIdx]) {
        bars[minIdx].classList.remove('active');
        minIdx = j;
        bars[minIdx].classList.add('active');
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      bars[j].classList.remove('active');
    }
    [array[i], array[minIdx]] = [array[minIdx], array[i]];
    await swapBars(bars[i], bars[minIdx]);
    bars[i].classList.add('sorted');
    bars[minIdx].classList.remove('active');
  }
}

async function insertionSort() {
  const bars = document.querySelectorAll('.bar');
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    bars[i].classList.add('active');
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      await swapBars(bars[j + 1], bars[j]);
      j--;
    }
    array[j + 1] = key;
    bars[i].classList.remove('active');
    bars[j + 1].classList.add('sorted');
  }
}

async function mergeSort() {
  await mergeSortRecursive(0, array.length - 1);
  const bars = document.querySelectorAll('.bar');
  bars.forEach(bar => bar.classList.add('sorted'));
}

async function mergeSortRecursive(start, end) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSortRecursive(start, mid);
  await mergeSortRecursive(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  const temp = [];
  let i = start, j = mid + 1;
  while (i <= mid && j <= end) {
    if (array[i] <= array[j]) {
      temp.push(array[i++]);
    } else {
      temp.push(array[j++]);
    }
  }
  while (i <= mid) temp.push(array[i++]);
  while (j <= end) temp.push(array[j++]);
  for (let k = start; k <= end; k++) {
    array[k] = temp[k - start];
    const bars = document.querySelectorAll('.bar');
    bars[k].style.height = `${array[k]}px`;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function quickSort() {
  await quickSortRecursive(0, array.length - 1);
  const bars = document.querySelectorAll('.bar');
  bars.forEach(bar => bar.classList.add('sorted'));
}

async function quickSortRecursive(low, high) {
  if (low < high) {
    const pivotIndex = await partition(low, high);
    await quickSortRecursive(low, pivotIndex - 1);
    await quickSortRecursive(pivotIndex + 1, high);
  }
}

async function partition(low, high) {
  const bars = document.querySelectorAll('.bar');
  const pivot = array[high];
  bars[high].classList.add('active');
  let i = low - 1;
  for (let j = low; j < high; j++) {
    bars[j].classList.add('active');
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      await swapBars(bars[i], bars[j]);
    }
    bars[j].classList.remove('active');
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  await swapBars(bars[i + 1], bars[high]);
  bars[high].classList.remove('active');
  return i + 1;
}

async function swapBars(bar1, bar2) {
  await new Promise(resolve => setTimeout(resolve, 100));
  const tempHeight = bar1.style.height;
  bar1.style.height = bar2.style.height;
  bar2.style.height = tempHeight;
}

generateArray();
