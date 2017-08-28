initializeWhenReady(document);

class Atumori {
  private videoDom: HTMLVideoElement;
  private atsumoriDom: HTMLElement | null;

  constructor(videoDom: HTMLVideoElement) {
    this.videoDom = videoDom;
    this.createAtsumori();
    this.videoDom.addEventListener("playing", (event) => this.execAtsumori(event))
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
      <div id="atsumori" style="visibility: visible;" >
        <image src="${chrome.extension.getURL("images/atsumori.png")}"/>
      </div>
      `;
      this.atsumoriDom = parent.querySelector("#atsumori") as HTMLElement | null
      parent.insertAdjacentElement("afterbegin", wrapper);
    }
  }

  private sleep(time: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  private async execAtsumori(event: Event) {
    console.log("playing");
    await this.sleep(10);
    console.log("10秒後")
    console.log(event);
    if (this.atsumoriDom) {
      this.atsumoriDom.style.visibility = "visible";
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
