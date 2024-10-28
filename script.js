let array = [];
let comparisons = 0;
let startTime;
let isSorting = false;
const container = document.getElementById('array-container');
const comparisonsEl = document.getElementById('comparisons');
const timeEl = document.getElementById('time');

function generateElements() {
    container.innerHTML = '';
    comparisons = 0;
    comparisonsEl.textContent = '0';
    timeEl.textContent = '0 ms';
    const elementCount = 30;
    array = Array.from({ length: elementCount }, () => Math.floor(Math.random() * 100) + 10);
    
    const elementWidth = Math.max(5, Math.min(20, Math.floor(container.clientWidth / elementCount) - 2));
    
    array.forEach(value => {
        const element = document.createElement('div');
        element.style.width = `${elementWidth}px`;
        element.style.height = `${value}px`;
        element.classList.add('rect');
        container.appendChild(element);
    });
}

function updateElements() {
    const elements = container.children;
    array.forEach((value, index) => {
        elements[index].style.height = `${value}px`;
    });
}

function shuffleElements() {
    if (isSorting) return;
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    comparisons = 0;
    comparisonsEl.textContent = '0';
    timeEl.textContent = '0 ms';
    updateElements();
}

async function bubbleSort() {
    const elements = container.children;
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (!isSorting) return;
            comparisons++;
            comparisonsEl.textContent = comparisons;
            elements[j].style.backgroundColor = '#e74c3c';
            elements[j + 1].style.backgroundColor = '#e74c3c';
            await pause(50);
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                updateElements();
            }
            elements[j].style.backgroundColor = '';
            elements[j + 1].style.backgroundColor = '';
        }
        elements[array.length - i - 1].style.backgroundColor = '#2ecc71';
    }
}

async function insertionSort() {
    const elements = container.children;
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key && isSorting) {
            comparisons++;
            comparisonsEl.textContent = comparisons;
            array[j + 1] = array[j];
            updateElements();
            elements[j + 1].style.backgroundColor = '#e74c3c';
            await pause(50);
            elements[j + 1].style.backgroundColor = '';
            j--;
        }
        array[j + 1] = key;
        updateElements();
    }
}

async function selectionSort() {
    const elements = container.children;
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            if (!isSorting) return;
            comparisons++;
            comparisonsEl.textContent = comparisons;
            elements[j].style.backgroundColor = '#e74c3c';
            await pause(50);
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
            elements[j].style.backgroundColor = '';
        }
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        updateElements();
        elements[i].style.backgroundColor = '#2ecc71';
    }
}

async function quickSort(left = 0, right = array.length - 1) {
    if (!isSorting || left >= right) return;
    const pivotIndex = await partition(left, right);
    await quickSort(left, pivotIndex - 1);
    await quickSort(pivotIndex + 1, right);
}

async function partition(left, right) {
    const pivotValue = array[right];
    const elements = container.children;
    let i = left;
    for (let j = left; j < right; j++) {
        if (!isSorting) return;
        comparisons++;
        comparisonsEl.textContent = comparisons;
        elements[j].style.backgroundColor = '#e74c3c';
        await pause(50);
        if (array[j] < pivotValue) {
            [array[i], array[j]] = [array[j], array[i]];
            updateElements();
            i++;
        }
        elements[j].style.backgroundColor = '';
    }
    [array[i], array[right]] = [array[right], array[i]];
    updateElements();
    elements[i].style.backgroundColor = '#2ecc71';
    return i;
}

async function mergeSort(start = 0, end = array.length - 1) {
    if (start >= end || !isSorting) return;
    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
    updateElements();
}

async function merge(start, mid, end) {
    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);
    let k = start, i = 0, j = 0;
    while (i < left.length && j < right.length && isSorting) {
        comparisons++;
        comparisonsEl.textContent = comparisons;
        await pause(50);
        if (left[i] <= right[j]) {
            array[k++] = left[i++];
        } else {
            array[k++] = right[j++];
        }
    }
    while (i < left.length && isSorting) array[k++] = left[i++];
    while (j < right.length && isSorting) array[k++] = right[j++];
}

function startSort() {
    if (isSorting) return;
    isSorting = true;
    generateElements();
    comparisons = 0;
    const algorithm = document.getElementById('algorithm').value;
    startTime = performance.now();
    switch (algorithm) {
        case 'bubble': bubbleSort().then(showCompletionTime); break;
        case 'insertion': insertionSort().then(showCompletionTime); break;
        case 'selection': selectionSort().then(showCompletionTime); break;
        case 'quick': quickSort().then(showCompletionTime); break;
        case 'merge': mergeSort().then(showCompletionTime); break;
    }
}

function stopSort() { isSorting = false; }

function showCompletionTime() {
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    timeEl.textContent = `${timeTaken.toFixed(2)} ms`;
    isSorting = false;
}

function pause(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

generateElements();
