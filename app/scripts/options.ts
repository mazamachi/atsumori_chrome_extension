import { defaultOption, Option } from './interface';

function save_options() {
  const atsumoriRateDom: HTMLInputElement = document.getElementById('atsumoriRate') as HTMLInputElement;
  const apologizeRateDom: HTMLInputElement = document.getElementById('apologizeRate') as HTMLInputElement;

  if (atsumoriRateDom.validity.patternMismatch || apologizeRateDom.validity.patternMismatch) {
    return;
  }

  const option: Option = {
    apologizeRate: parseFloat(apologizeRateDom.value),
    atsumoriRate: parseFloat(atsumoriRateDom.value),
  };

  chrome.storage.sync.set(option, () => {
    const status = document.getElementById('status')!;
    status.textContent = '保存しました。';
    setTimeout(() => {
      status.textContent = '';
    }, 1000);
  });
}

// Restores options from chrome.storage
function restore_options() {
  chrome.storage.sync.get(defaultOption, (storage: Option) => {
    (document.getElementById('atsumoriRate') as HTMLInputElement).value = String(storage.atsumoriRate);
    (document.getElementById('apologizeRate') as HTMLInputElement).value = String(storage.apologizeRate);
  });
}

function restore_defaults() {
  chrome.storage.sync.set(defaultOption, () => {
    restore_options();
    // Update status to let user know options were saved.
    const status = document.getElementById('status')!;
    status.textContent = "デフォルトに戻しました。";
    setTimeout(() => {
      status.textContent = "";
    }, 1000);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  restore_options();
  document.getElementById('save')!.addEventListener('click', save_options);
  document.getElementById('restore')!.addEventListener('click', restore_defaults);
});
