initializeWhenReady(document);

class Atumori {
  private videoDom: HTMLVideoElement;
  private atsumoriImgDom: HTMLElement | null;

  constructor(videoDom: HTMLVideoElement) {
    this.videoDom = videoDom;
    this.createAtsumori();
    this.videoDom.addEventListener("playing", () => this.execAtsumori())
  }

  private createAtsumori() {
    const parent = this.videoDom.parentElement;
    if (parent !== null) {
      const wrapper = document.createElement("div");
      wrapper.classList.add("atsumori-root");
      const shadow = wrapper.attachShadow({mode: "open"});

      shadow.innerHTML = `
      <style>
        @import "${chrome.extension.getURL('styles/shadow.css')}";
      </style>
      <div id="atsumori">
        <image id="atsumori-img" src="${chrome.extension.getURL("images/atsumori.png")}"/>
      </div>
      `;
      this.atsumoriImgDom = shadow.querySelector("#atsumori-img") as HTMLElement | null
      parent.insertAdjacentElement("afterbegin", wrapper);
    }
  }

  private sleep(time: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  private async execAtsumori() {
    console.log("playing");
    await this.sleep(1*1000);
    console.log("10秒後")
    console.log(this.videoDom);
    if (this.atsumoriImgDom) {
      this.atsumoriImgDom.classList.add("start");
    }
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
