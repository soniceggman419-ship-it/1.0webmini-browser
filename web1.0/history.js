const historyStack = [];
let currentIndex = -1;

export function pushHistory(url) {
  historyStack.splice(currentIndex + 1);
  historyStack.push(url);
  currentIndex = historyStack.length - 1;
}

export function goBack() {
  if (currentIndex > 0) {
    currentIndex--;
    return historyStack[currentIndex];
  }
  return null;
}

export function goForward() {
  if (currentIndex < historyStack.length - 1) {
    currentIndex++;
    return historyStack[currentIndex];
  }
  return null;
}

export function getCurrentIndex() {
  return currentIndex;
}

export function getHistoryLength() {
  return historyStack.length;
}
