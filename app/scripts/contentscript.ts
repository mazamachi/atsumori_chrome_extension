initializeWhenReady(document);

class Atumori {
  private videoDom: HTMLVideoElement;
  private imgDom: HTMLElement | null;
  private audioDom: HTMLAudioElement | null;
  private wrapper: HTMLElement | null;

  constructor(videoDom: HTMLVideoElement) {
    this.videoDom = videoDom;
    this.createAtsumori();
    this.videoDom.addEventListener("playing", () => this.execAtsumori())
  }

  private createAtsumori() {
    const parent = this.videoDom.parentElement;
    if (parent !== null) {
      this.wrapper = document.createElement("div");
      this.wrapper.classList.add("atsumori-root");
      const shadow = this.wrapper.attachShadow({mode: "open"});

      shadow.innerHTML = `
      <style>
        @import "${chrome.extension.getURL('styles/shadow.css')}";
      </style>
      <div id="atsumori">
        <img id="atsumori-img" src="${chrome.extension.getURL("images/atsumori.png")}"/>
        <audio id="atsumori-audio" src="${chrome.extension.getURL("assets/atsumori.mp3")}"/>
      </div>
      `;
      this.imgDom = shadow.querySelector("#atsumori-img") as HTMLElement | null;
      this.audioDom = shadow.querySelector("audio#atsumori-audio") as HTMLAudioElement | null;
      parent.insertAdjacentElement("afterbegin", this.wrapper);
    }
  }

  private sleep(time: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  private async execAtsumori() {
    console.log("playing");
    await this.sleep(1*1000);

    if (this.videoDom.paused) {
      return;
    }

    console.log("10秒後")
    console.log(this.videoDom);
    if (this.imgDom && this.audioDom && this.wrapper) {
      this.wrapper.style.width = this.videoDom.style.width;
      this.wrapper.style.height = this.videoDom.style.height;

      this.imgDom.classList.add("start");
      this.audioDom.addEventListener("ended", async () => {
        await this.sleep(1*1000);
        this.imgDom!.classList.remove("start")
      });
      await this.audioDom.play();
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
