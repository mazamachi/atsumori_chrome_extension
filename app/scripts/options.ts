import { Option } from './interface';

const defaultOption: Option = {
  atsumoriRate: 0.05,
  apologizeRate: 0.25,
}

function save_options() {
  const atsumoriRate: number = Number((document.getElementById('atsumoriRate') as HTMLInputElement ).value);
  const apologizeRate: number = Number((document.getElementById('apologizeRate') as HTMLInputElement ).value);

  chrome.storage.sync.set({
    atsumoriRate: atsumoriRate,
    apologizeRate: apologizeRate,
  }, function() {
    const status = document.getElementById('status')!;
    status.textContent = 'Saved';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
}

// Restores options from chrome.storage
function restore_options() {
  chrome.storage.sync.get(defaultOption, function(storage: Option) {
    (document.getElementById('atsumoriRate') as HTMLInputElement).value = String(storage.atsumoriRate);
    (document.getElementById('apologizeRate') as HTMLInputElement).value = String(storage.apologizeRate);
  });
}

function restore_defaults() {
  chrome.storage.sync.set(defaultOption, function() {
    restore_options();
    // Update status to let user know options were saved.
    const status = document.getElementById('status')!;
    status.textContent = 'デフォルトに戻しました。';
    setTimeout(function() {
      status.textContent = '';
    }, 1000);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  restore_options();
  document.getElementById('save')!.addEventListener('click', save_options);
  document.getElementById('restore')!.addEventListener('click', restore_defaults);
})
