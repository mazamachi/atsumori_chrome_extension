import { defaultOption, Option } from './interface';

const defaultOption: Option = {
  atsumoriRate: 0.05,
  apologizeRate: 0.25
}

chrome.storage.sync.get(defaultOption, (storage: Option) => initializeWhenReady(document, Object.assign(defaultOption, storage)));

class Atumori {
  private videoDom: HTMLVideoElement;
  private imgDom: HTMLElement | null;
  private atsumoriAudioDom: HTMLAudioElement | null;
  private apologizeAudioDom: HTMLAudioElement | null;
  private wrapper: HTMLElement | null;
  private timing?: number;
  private done = false;
  private option: Option;

  constructor(videoDom: HTMLVideoElement, option: Option) {
    this.option = option
    if (Math.random() > this.option.atsumoriRate) {
      return;
    }
    this.videoDom = videoDom;
    this.createAtsumori();
    this.videoDom.addEventListener("loadeddata", () => {
      this.timing = this.getTiming();
      console.log(this.timing);
    });

    this.videoDom.addEventListener("timeupdate", () => this.execAtsumori());
  }

  private getTiming(): number {
    this.done = false;
    if (this.timing !== undefined) {
      return this.timing;
    } else if (this.videoDom.duration !== NaN && this.videoDom.duration !== Infinity) {
      return this.videoDom.duration * Math.random();
    } else {
      return 5 + 10 * Math.random();
    }
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
        <audio id="apologize-audio" src="${chrome.extension.getURL("assets/apologize.mp3")}"/>
      </div>
      `;
      this.imgDom = shadow.querySelector("#atsumori-img") as HTMLElement | null;
      this.atsumoriAudioDom = shadow.querySelector("audio#atsumori-audio") as HTMLAudioElement | null;
      this.apologizeAudioDom = shadow.querySelector("audio#apologize-audio") as HTMLAudioElement | null;
      parent.insertAdjacentElement("afterbegin", this.wrapper);
    }
  }

  private sleep(time: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  private async execAtsumori() {
    if(this.timing && this.videoDom.currentTime > this.timing && this.videoDom.currentTime < this.timing + 2 && !this.done){
      if (this.wrapper) {
        this.done = true;
        this.wrapper.style.width = this.videoDom.style.width;
        this.wrapper.style.height = this.videoDom.style.height;

        if (Math.random() > this.option.apologizeRate) {
          this.startAtsumori();
        } else {
          this.startAtsumoriWithApologize();
        }
        this.timing = undefined;
      }
    }
  }

  private async startAtsumori() {
    if (this.imgDom && this.atsumoriAudioDom) {
      this.imgDom.classList.add("start");
      this.atsumoriAudioDom.addEventListener("ended", async () => {
        await this.sleep(1*1000);
        this.imgDom!.classList.remove("start")
      });
      await this.atsumoriAudioDom.play();
    }
  }

  private async startAtsumoriWithApologize() {
    if (this.imgDom && this.atsumoriAudioDom && this.apologizeAudioDom) {
      this.imgDom.classList.add("start");
      this.atsumoriAudioDom.addEventListener("pause", async () => {
        this.imgDom!.classList.remove("start")
      });
      this.atsumoriAudioDom.play();
      await this.sleep(1200);
      this.atsumoriAudioDom.pause();
      this.atsumoriAudioDom.currentTime = 0;
      await this.apologizeAudioDom.play();
    }
  }
}

function initializeWhenReady(document: Document, option: Option) {
  const readyStateCheckInterval = setInterval(function() {
    if (document && document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);
      initializeNow(document, option);
    }
  }, 10);
}

function initializeNow(document: Document, option: Option) {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeName === 'VIDEO') {
          new Atumori(node as HTMLVideoElement, option);
        }
      });
    });
  });

  observer.observe(document, { childList: true, subtree: true });

  const videoTags = document.getElementsByTagName('video');
  Array.from(videoTags).forEach(video => {
    new Atumori(video, option);
  });
}
