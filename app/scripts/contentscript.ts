initializeWhenReady(document);

class Atumori {
  private videoDom: HTMLVideoElement;

  constructor(videoDom: HTMLVideoElement) {
    this.videoDom = videoDom;
    this.videoDom.addEventListener("play", (event) => this.showAtsumori(event))
  }

  private showAtsumori(event: Event) {
    setTimeout(() => {
      if (!this.videoDom.paused) {
        console.log(event)
        console.log("10秒後");
      }
    }, 5*1000);
  }
}

function initializeWhenReady(document: Document) {
  const readyStateCheckInterval = setInterval(function() {
    if (document && document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);
      initializeNow(document);
    }
  }, 10);
}

function initializeNow(document: Document) {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeName === 'VIDEO') {
          new Atumori(node as HTMLVideoElement);
        }
      });
    });
  });

  observer.observe(document, { childList: true, subtree: true });

  const videoTags = document.getElementsByTagName('video');
  Array.from(videoTags).forEach(video => {
    new Atumori(video);
  });
}
